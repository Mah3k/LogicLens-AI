package com.logiclens.backend.service;

import com.logiclens.backend.dto.request.*;
import com.logiclens.backend.dto.response.AuthResponse;
import com.logiclens.backend.entity.User;
import com.logiclens.backend.exception.*;
import com.logiclens.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse.UserDto getProfile(String email) {
        User user = findByEmail(email);
        return toDto(user);
    }

    @Transactional
    public AuthResponse.UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);

        // If changing email, make sure it is not already taken
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("That email address is already in use.");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        return toDto(user);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = findByEmail(email);
        userRepository.delete(user);
    }

    // ---- helpers ----

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AuthResponse.UserDto toDto(User user) {
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
