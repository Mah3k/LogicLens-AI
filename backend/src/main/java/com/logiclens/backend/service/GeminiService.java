package com.logiclens.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logiclens.backend.dto.AnalysisResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public AnalysisResponse analyzeCode(String language, String code) {

        try {

            System.out.println("🔥 GEMINI SERVICE CALLED");
            System.out.println("LANGUAGE = " + language);
            System.out.println("CODE = " + code);

            String prompt = "Analyze this " + language + " code:\n" + code;

            String jsonBody = """
            {
              "contents": [
                {
                  "parts": [
                    {
                      "text": "%s"
                    }
                  ]
                }
              ]
            }
            """.formatted(prompt.replace("\"", "'"));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                                    + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("STATUS: " + response.statusCode());
            System.out.println("RAW RESPONSE: " + response.body());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Gemini API Failed: " + response.body());
            }

            ObjectMapper mapper = new ObjectMapper();

            // ✅ FIX: parse JSON properly
            JsonNode root = mapper.readTree(response.body());

            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in Gemini response: " + response.body());
            }

            JsonNode textNode = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String text = textNode.asText();

            // ✅ Build response
            AnalysisResponse result = new AnalysisResponse();

            result.setComplexity("O(n) - estimated by AI");
            result.setScore(8.0);

            result.setIssues(List.of(text));

            result.setSuggestions(List.of(
                    "Improve code structure",
                    "Reduce complexity",
                    "Follow best practices"
            ));

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Gemini Error: " + e.getMessage());
        }
    }
}