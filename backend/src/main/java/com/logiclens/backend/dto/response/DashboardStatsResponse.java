package com.logiclens.backend.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsResponse {
    private long totalReviews;
    private int averageScore;
    private String improvementLevel;
}
