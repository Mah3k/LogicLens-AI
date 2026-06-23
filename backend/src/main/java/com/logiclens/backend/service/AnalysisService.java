package com.logiclens.backend.service;

import com.logiclens.backend.dto.AnalysisResponse;
import com.logiclens.backend.dto.CodeRequest;

public interface AnalysisService {

    AnalysisResponse analyzeCode(CodeRequest codeRequest);
}