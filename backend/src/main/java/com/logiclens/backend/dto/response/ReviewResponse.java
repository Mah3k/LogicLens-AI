package com.logiclens.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String title;
    private String language;
    private Integer score;
    private String performanceRating;
    private String securityRating;
    private List<String> explanation;
    private List<AnalyzeResponse.BugDto> bugs;
    private String optimizedCode;
    private String tests;
    private LocalDateTime createdAt;
}
