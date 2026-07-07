package com.logiclens.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private String port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    public void testConfig() {

        log.info("=========== MAIL CONFIG ===========");
        log.info("HOST = {}", host);
        log.info("PORT = {}", port);
        log.info("USERNAME = {}", username);
        log.info("PASSWORD EMPTY = {}", password == null || password.isEmpty());
        log.info("===================================");

    }

    public void sendEmail(String to, String subject, String body) {

        testConfig();

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(username);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("Email sent successfully to {}", to);

        } catch (Exception e) {

            log.error("Email sending failed", e);
            throw new RuntimeException("Email sending failed", e);

        }

    }

    public void sendOtp(String to, String otp) {

        String subject = "LogicLens AI - Password Reset OTP";

        String body =
                "Hello,\n\n" +
                "Your LogicLens AI password reset OTP is:\n\n" +
                otp +
                "\n\nThis OTP will expire in 5 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Regards,\nLogicLens AI";

        sendEmail(to, subject, body);

    }

}