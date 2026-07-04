package com.logiclens.backend.dto.response;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApiErrorResponse {
    private int status;
    private String message;
    private List<String> errors;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
