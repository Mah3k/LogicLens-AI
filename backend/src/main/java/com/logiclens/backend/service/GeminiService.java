package com.logiclens.backend.service;

import com.logiclens.backend.dto.response.AnalyzeResponse;
import com.logiclens.backend.dto.response.AnalyzeResponse.BugDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * GeminiService (v2)
 * -------------------
 * Delegates AI analysis to the Python FastAPI microservice on port 8001.
 * Python handles Gemini natively via google-generativeai SDK.
 * Spring Boot handles auth, users, reviews — Python handles AI.
 *
 * Falls back to a mock response if the Python service is unreachable,
 * so the app keeps working during development without the service running.
 */
@Slf4j
@Service
public class GeminiService {

    private final WebClient webClient;

    public GeminiService(
            @Value("${ai-service.base-url}") String aiServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(aiServiceUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
        log.info("AI microservice URL: {}", aiServiceUrl);
    }

    public AnalyzeResponse analyze(String code, String language, List<String> options) {
        if (options == null || options.isEmpty()) {
            options = List.of("explain", "bugs", "optimize", "tests");
        }

        try {
            Map<String, Object> requestBody = Map.of(
                    "code", code,
                    "language", language,
                    "options", options
            );

            log.info("Calling AI microservice at /api/ai/analyze ...");

            AnalyzeResponse response = webClient.post()
                    .uri("/api/ai/analyze")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(AnalyzeResponse.class)
                    .timeout(Duration.ofSeconds(25))
                    .block();

            if (response != null) {
                log.info("REAL AI analysis complete — score: {}", response.getScore());
                return response;
            }

        } catch (WebClientResponseException e) {
            log.error("AI service returned an error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("AI service unreachable or timed out ({}). Using FALLBACK response.", e.toString());
        }

        log.warn("Returning FALLBACK (non-AI) response — real AI service did not respond.");
        return buildFallbackResponse(code, language);
    }

    private AnalyzeResponse buildFallbackResponse(String code, String language) {
        int lines = code.split("\n").length;

        // Wider, less predictable range so a broken AI connection doesn't
        // silently produce the same score for every review.
        int base = 55 + new Random().nextInt(40); // 55–94
        int lengthPenalty = Math.min(15, lines / 10);
        int score = Math.max(50, base - lengthPenalty);

        return AnalyzeResponse.builder()
                .score(score)
                .performance(score >= 85 ? "A" : score >= 65 ? "B" : "C")
                .security(score >= 75 ? "Good" : "Review")
                .explanation(List.of(
                        "This " + language + " snippet defines core business logic.",
                        "Variables are initialised before the main control flow.",
                        "The result is returned at the end of the function."
                ))
                .bugs(score < 80
                        ? List.of(BugDto.builder()
                                .severity("Medium")
                                .title("Unhandled edge case")
                                .detail("Guard against null or empty input at the top of the function.")
                                .build())
                        : List.of())
                .optimizedCode("// Optimized version\n" + code)
                .tests("test('handles typical input', () => {\n  // arrange → act → assert\n});\ntest('handles edge case', () => {\n  // arrange → act → assert\n});")
                .build();
    }
}