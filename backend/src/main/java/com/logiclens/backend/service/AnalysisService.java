package com.logiclens.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logiclens.backend.dto.request.AnalyzeRequest;
import com.logiclens.backend.dto.response.*;
import com.logiclens.backend.entity.*;
import com.logiclens.backend.exception.ResourceNotFoundException;
import com.logiclens.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeminiService geminiService;
    private final CodeReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public ProgressResponse getProgress(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CodeReview> reviews = reviewRepository.findTop8ByUserIdOrderByCreatedAtAsc(user.getId());

        List<ProgressResponse.ScorePoint> scoreHistory = new ArrayList<>();

        for (CodeReview review : reviews) {
            scoreHistory.add(
                    new ProgressResponse.ScorePoint(
                            review.getCreatedAt().toLocalDate().toString(),
                            review.getQualityScore()));
        }

        LocalDateTime weekAgo = LocalDateTime.now().minusDays(6);

        List<CodeReview> weeklyReviews = reviewRepository.findByUserIdAndCreatedAtAfter(user.getId(), weekAgo);

        Map<String, Integer> activityMap = new LinkedHashMap<>();

        activityMap.put("Mon", 0);
        activityMap.put("Tue", 0);
        activityMap.put("Wed", 0);
        activityMap.put("Thu", 0);
        activityMap.put("Fri", 0);
        activityMap.put("Sat", 0);
        activityMap.put("Sun", 0);

        for (CodeReview review : weeklyReviews) {

            String day = switch (review.getCreatedAt().getDayOfWeek()) {
                case MONDAY -> "Mon";
                case TUESDAY -> "Tue";
                case WEDNESDAY -> "Wed";
                case THURSDAY -> "Thu";
                case FRIDAY -> "Fri";
                case SATURDAY -> "Sat";
                case SUNDAY -> "Sun";
            };

            activityMap.put(day, activityMap.getOrDefault(day, 0) + 1);
        }

        List<ProgressResponse.ActivityPoint> activity = new ArrayList<>();

        activityMap.forEach((day, count) -> activity.add(
                new ProgressResponse.ActivityPoint(day, count)));

        List<CodeReview> allReviews = reviewRepository.findByUserId(user.getId());

        int avgScore = allReviews.isEmpty()
                ? 0
                : (int) allReviews.stream()
                        .mapToInt(CodeReview::getQualityScore)
                        .average()
                        .orElse(0);

        ProgressResponse.SkillStats skills = ProgressResponse.SkillStats.builder()
                .readability(Math.min(avgScore + 5, 100))
                .bugFreeRate(Math.min(avgScore + 2, 100))
                .testing(Math.max(avgScore - 10, 40))
                .optimization(Math.min(avgScore + 1, 100))
                .build();

        List<String> insights = new ArrayList<>();

        insights.add("Average quality score: " + avgScore + "/100");
        insights.add("Total reviews completed: " + allReviews.size());

        if (avgScore >= 90) {
            insights.add("Excellent coding quality. Keep maintaining this level.");
        } else if (avgScore >= 75) {
            insights.add("Your code quality is improving consistently.");
        } else {
            insights.add("Focus on fixing bugs and improving readability.");
        }

        return ProgressResponse.builder().scoreHistory(scoreHistory).activity(activity).skills(skills)
                .insights(insights).build();
    }

    @Transactional
    public AnalyzeResponse analyze(AnalyzeRequest request, String userEmail) throws JsonProcessingException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Call Gemini (or fallback)
        AnalyzeResponse result = geminiService.analyze(request.getCode(), request.getLanguage(), request.getOptions());

        // Auto-generate a readable title
        String title = buildTitle(request.getCode(), request.getLanguage());

        // Persist the review
        CodeReview review = CodeReview.builder()
                .user(user)
                .title(title)
                .language(request.getLanguage())
                .originalCode(request.getCode())
                .qualityScore(result.getScore())
                .performanceRating(result.getPerformance())
                .securityRating(result.getSecurity())
                .explanationJson(objectMapper.writeValueAsString(result.getExplanation()))
                .bugsJson(objectMapper.writeValueAsString(result.getBugs()))
                .optimizedCode(result.getOptimizedCode())
                .testsCode(result.getTests())
                .build();

        reviewRepository.save(review);
        log.info("Saved review #{} for user {}", review.getId(), userEmail);

        return result;
    }

    public List<ReviewResponse> getHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    public ReviewResponse getReviewById(Long reviewId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CodeReview review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        return toReviewResponse(review);
    }

    @Transactional
    public void renameReview(Long reviewId, String userEmail, String title) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CodeReview review = reviewRepository
                .findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setTitle(title);

        reviewRepository.save(review);

        log.info("Review {} renamed to '{}' by {}", reviewId, title, userEmail);
    }

    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CodeReview review = reviewRepository
                .findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        reviewRepository.delete(review);

        log.info("Review {} deleted by {}", reviewId, userEmail);
    }

    public DashboardStatsResponse getDashboardStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long total = reviewRepository.countByUserId(user.getId());
        Double avg = reviewRepository.findAverageScoreByUserId(user.getId());
        int avgScore = avg != null ? avg.intValue() : 0;

        String level = avgScore >= 85 ? "Advanced" : avgScore >= 70 ? "Intermediate" : "Beginner";

        return DashboardStatsResponse.builder()
                .totalReviews(total)
                .averageScore(avgScore)
                .improvementLevel(level)
                .build();
    }

    // ---- helpers ----

    private String buildTitle(String code, String language) {
        // Try to extract first function/class name from the code
        String[] lines = code.strip().split("\n");
        for (String line : lines) {
            String trimmed = line.strip();
            if (trimmed.contains("function ") || trimmed.contains("def ") ||
                    trimmed.contains("class ") || trimmed.contains("public ")) {
                String title = trimmed.replaceAll("\\{.*", "").replaceAll(";.*", "").strip();
                if (title.length() > 60)
                    title = title.substring(0, 60) + "…";
                return title;
            }
        }
        return language + " · " + lines.length + " lines";
    }

    @SuppressWarnings("unchecked")
    private ReviewResponse toReviewResponse(CodeReview review) {
        List<String> explanation = safeParseList(review.getExplanationJson(), String.class);
        List<AnalyzeResponse.BugDto> bugs = safeParseList(review.getBugsJson(), AnalyzeResponse.BugDto.class);

        return ReviewResponse.builder()
                .id(review.getId())
                .title(review.getTitle())
                .language(review.getLanguage())
                .score(review.getQualityScore())
                .performanceRating(review.getPerformanceRating())
                .securityRating(review.getSecurityRating())
                .explanation(explanation)
                .bugs(bugs)
                .optimizedCode(review.getOptimizedCode())
                .tests(review.getTestsCode())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private <T> List<T> safeParseList(String json, Class<T> clazz) {
        if (json == null || json.isBlank())
            return List.of();
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
        } catch (Exception e) {
            log.warn("Could not parse JSON list: {}", e.getMessage());
            return List.of();
        }
    }
}
