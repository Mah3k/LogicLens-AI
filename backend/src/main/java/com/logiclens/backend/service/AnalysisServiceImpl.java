package com.logiclens.backend.service;

import com.logiclens.backend.dto.AnalysisResponse;
import com.logiclens.backend.dto.CodeRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AnalysisServiceImpl implements AnalysisService {

    @Override
    public AnalysisResponse analyzeCode(CodeRequest codeRequest) {

        AnalysisResponse response = new AnalysisResponse();

        response.setComplexity("Low");
        response.setScore(8.5);
        response.setIssues(Arrays.asList(
                "Unused variable detected",
                "Consider adding exception handling"
        ));

        return response;
    }
}