package com.logiclens.backend.controller;

import com.logiclens.backend.dto.request.AnalyzeRequest;
import com.logiclens.backend.dto.request.RenameReviewRequest;
import com.logiclens.backend.dto.response.*;
import com.logiclens.backend.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    /**
     * POST /api/analyze
     */
    @PostMapping("/analyze")
    public ResponseEntity<AnalyzeResponse> analyze(
            @Valid @RequestBody AnalyzeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {

        return ResponseEntity.ok(
                analysisService.analyze(request, userDetails.getUsername())
        );
    }

    /**
     * GET /api/reviews
     */
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                analysisService.getHistory(userDetails.getUsername())
        );
    }

    /**
     * GET /api/reviews/{id}
     */
    @GetMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponse> getReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                analysisService.getReviewById(id, userDetails.getUsername())
        );
    }

    /**
     * PATCH /api/reviews/{id}/title
     */
    @PatchMapping("/reviews/{id}/title")
    public ResponseEntity<Map<String, String>> renameReview(
            @PathVariable Long id,
            @Valid @RequestBody RenameReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        analysisService.renameReview(
                id,
                userDetails.getUsername(),
                request.getTitle()
        );

        return ResponseEntity.ok(
                Map.of("message", "Review renamed successfully.")
        );
    }

    /**
     * DELETE /api/reviews/{id}
     */
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        analysisService.deleteReview(
                id,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(
                Map.of("message", "Review deleted successfully.")
        );
    }

    /**
     * GET /api/dashboard/stats
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                analysisService.getDashboardStats(userDetails.getUsername())
        );
    }

    /**
     * GET /api/progress
     */
    @GetMapping("/progress")
    public ResponseEntity<ProgressResponse> getProgress(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                analysisService.getProgress(userDetails.getUsername())
        );
    }
}