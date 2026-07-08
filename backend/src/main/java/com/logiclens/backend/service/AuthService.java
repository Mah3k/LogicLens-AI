package com.logiclens.backend.service;

import com.logiclens.backend.dto.request.*;
import com.logiclens.backend.dto.response.*;

import com.logiclens.backend.entity.PasswordResetOtp;
import com.logiclens.backend.entity.User;

import com.logiclens.backend.exception.BadRequestException;

import com.logiclens.backend.repository.PasswordResetOtpRepository;
import com.logiclens.backend.repository.UserRepository;

import com.logiclens.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordResetOtpRepository otpRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final AuthenticationManager authenticationManager;

    private final EmailService emailService;

    // ==========================
    // REGISTER
    // ==========================

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with that email already exists.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        log.info("Registered user {}", user.getEmail());

        String token = jwtUtil.generateToken(user.getEmail());

        return buildAuthResponse(token, user);
    }

    // ==========================
    // LOGIN
    // ==========================

    public AuthResponse login(LoginRequest request) {

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

        } catch (AuthenticationException e) {

            log.warn("Login failed for {} — {}: {}", request.getEmail(), e.getClass().getSimpleName(), e.getMessage());

            throw new BadRequestException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("Invalid email or password."));

        String token = jwtUtil.generateToken(user.getEmail());

        return buildAuthResponse(token, user);
    }

    // ==========================
    // FORGOT PASSWORD
    // ==========================

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("No account exists with this email."));

        otpRepository.deleteByEmail(user.getEmail());

        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetOtp resetOtp = PasswordResetOtp.builder()
                .email(user.getEmail())
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        otpRepository.save(resetOtp);

        emailService.sendEmail(
                user.getEmail(),
                "LogicLens AI Password Reset OTP",
                "Hello " + user.getName()
                        + ",\n\n"
                        + "Your OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP will expire in 10 minutes.\n\n"
                        + "If you didn't request this, ignore this email.");

        log.info("OTP sent to {}", user.getEmail());

        return "OTP sent successfully.";
    }

    // ---------- CONTINUES IN PART 2 ----------
        // ==========================
    // VERIFY OTP
    // ==========================

    public String verifyOtp(VerifyOtpRequest request) {

        PasswordResetOtp resetOtp = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("OTP not found. Please request a new one."));

        if (LocalDateTime.now().isAfter(resetOtp.getExpiryTime())) {
            otpRepository.delete(resetOtp);
            throw new BadRequestException("OTP has expired.");
        }

        if (!resetOtp.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP.");
        }

        return "OTP verified successfully.";
    }

    // ==========================
    // RESET PASSWORD
    // ==========================

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {

        PasswordResetOtp resetOtp = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("OTP not found."));

        if (LocalDateTime.now().isAfter(resetOtp.getExpiryTime())) {

            otpRepository.delete(resetOtp);

            throw new BadRequestException("OTP has expired.");
        }

        if (!resetOtp.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("User not found."));

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        otpRepository.delete(resetOtp);

        log.info("Password reset successfully for {}", user.getEmail());

        return "Password reset successful.";
    }

    // ==========================
    // AUTH RESPONSE
    // ==========================

    private AuthResponse buildAuthResponse(String token, User user) {

        return AuthResponse.builder()
                .token(token)
                .user(
                        AuthResponse.UserDto.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .build()
                )
                .build();
    }

}