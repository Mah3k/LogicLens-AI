package com.logiclens.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Enter a valid email address")
    @NotBlank(message = "Email is required")
    private String email;
}
