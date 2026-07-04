package com.logiclens.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class AnalyzeRequest {

    @NotBlank(message = "Code must not be empty")
    private String code;

    @NotBlank(message = "Language is required")
    private String language;

    /**
     * Which analyses to run.
     * Valid values: explain, bugs, optimize, tests
     * Defaults to all four if null/empty.
     */
    private List<String> options;
}
