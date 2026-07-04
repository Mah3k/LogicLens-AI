package com.logiclens.backend.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AnalyzeResponse {

    private Integer score;
    private String performance;   // "A", "B", "C"
    private String security;      // "Good", "Review"

    private List<String> explanation;
    private List<BugDto> bugs;
    private String optimizedCode;
    private String tests;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class BugDto {
        private String severity;  // High / Medium / Low
        private String title;
        private String detail;
    }
}
