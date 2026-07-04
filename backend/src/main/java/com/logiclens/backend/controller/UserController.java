package com.logiclens.backend.controller;

import com.logiclens.backend.dto.request.*;
import com.logiclens.backend.dto.response.AuthResponse;
import com.logiclens.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/user/profile
     * Returns: { id, name, email }
     */
    @GetMapping("/profile")
    public ResponseEntity<AuthResponse.UserDto> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    /**
     * PUT /api/user/profile
     * Body: { "name": "...", "email": "..." }
     */
    @PutMapping("/profile")
    public ResponseEntity<AuthResponse.UserDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }

    /**
     * PATCH /api/user/password
     * Body: { "currentPassword": "...", "newPassword": "..." }
     */
    @PatchMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    /**
     * DELETE /api/user/account
     * Permanently deletes the authenticated user and all their data.
     */
    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount(
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteAccount(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Account deleted."));
    }
}
