package com.logiclens.backend.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {

    private List<ScorePoint> scoreHistory;

    private List<ActivityPoint> activity;

    private SkillStats skills;

    private List<String> insights;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ScorePoint {
        private String date;
        private Integer score;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ActivityPoint {
        private String day;
        private Integer count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillStats {

        private Integer readability;

        private Integer bugFreeRate;

        private Integer testing;

        private Integer optimization;
    }
}