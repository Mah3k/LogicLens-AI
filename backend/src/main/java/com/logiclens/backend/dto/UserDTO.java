package com.logiclens.backend.dto;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
@Data
public class UserDTO {
    @NotBlank(message = "Name is required")
    private String name;
    @Email(message = "Invalid email")
    private String email;
     @NotBlank(message = "Password is required")
    private String password;

}