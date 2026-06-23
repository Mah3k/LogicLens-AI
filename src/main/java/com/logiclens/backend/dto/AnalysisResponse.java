package com.logiclens.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalysisResponse {

    private String complexity;
    private double score;
    private List<String> issues;
    private List<String> suggestions;
}