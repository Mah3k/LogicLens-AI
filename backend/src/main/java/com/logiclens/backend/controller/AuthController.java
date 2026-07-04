package com.logiclens.backend.controller;

import com.logiclens.backend.dto.request.*;
import com.logiclens.backend.dto.response.AuthResponse;
import com.logiclens.backend.service.AuthService;
import com.logiclens.backend.service.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { "name": "...", "email": "...", "password": "..." }
     * Returns: { "token": "...", "user": { "id": ..., "name": "...", "email": "..."
     * } }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    /**
     * POST /api/auth/login
     * Body: { "email": "...", "password": "..." }
     * Returns: { "token": "...", "user": { "id": ..., "name": "...", "email": "..."
     * } }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.forgotPassword(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(
                authService.verifyOtp(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(request));
    }

    @Autowired
    private EmailService emailService;

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {

        emailService.sendEmail(
                "pirjademahek02@gmail.com",
                "LogicLens AI Test",
                "Congratulations! Email sending is working successfully.");

        return ResponseEntity.ok("Email sent successfully.");
    }
}
