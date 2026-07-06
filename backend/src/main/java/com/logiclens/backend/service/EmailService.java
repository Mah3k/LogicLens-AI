package com.logiclens.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String body) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            System.out.println("EMAIL SENT SUCCESSFULLY");

        } catch (Exception e) {

            e.printStackTrace();

            System.out.println("EMAIL ERROR: " + e.getMessage());

            throw e;
        }
    }

    public void sendOtp(String to, String otp) {

        String subject = "LogicLens AI - Password Reset OTP";

        String body = "Hello,\n\n" +
                "Your LogicLens AI password reset OTP is:\n\n" +
                otp +
                "\n\nThis OTP will expire in 5 minutes.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Regards,\nLogicLens AI";

        sendEmail(to, subject, body);
    }
}