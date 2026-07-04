package com.logiclens.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RenameReviewRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;
}