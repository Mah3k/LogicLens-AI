package com.logiclens.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    @Value("${SPRING_MAIL_USERNAME}")
    private String senderEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String to, String subject, String body) {

        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set("api-key", apiKey);

        Map<String, Object> request = Map.of(

                "sender", Map.of(
                        "name", "LogicLens AI",
                        "email", senderEmail
                ),

                "to", List.of(
                        Map.of("email", to)
                ),

                "subject", subject,

                "textContent", body

        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        entity,
                        String.class
                );

        log.info("Brevo Response : {}", response.getBody());

    }

    public void sendOtp(String to, String otp) {

        String subject = "LogicLens AI - Password Reset OTP";

        String body =
                "Hello,\n\n" +
                "Your LogicLens AI Password Reset OTP is:\n\n" +
                otp +
                "\n\nThis OTP expires in 5 minutes.\n\n" +
                "Regards,\nLogicLens AI";

        sendEmail(to, subject, body);

    }

}