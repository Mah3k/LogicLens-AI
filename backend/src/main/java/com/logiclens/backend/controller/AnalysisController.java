package com.logiclens.backend.controller;

import com.logiclens.backend.dto.AnalysisResponse;
import com.logiclens.backend.dto.CodeRequest;
import com.logiclens.backend.service.AnalysisService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyze")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping
    public AnalysisResponse analyzeCode(@RequestBody CodeRequest codeRequest) {
        return analysisService.analyzeCode(codeRequest);
    }
}