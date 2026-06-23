package com.logiclens.backend.controller;

import com.logiclens.backend.dto.AnalysisResponse;
import com.logiclens.backend.dto.CodeRequest;
import com.logiclens.backend.dto.LoginRequest;
import com.logiclens.backend.dto.UserDTO;
import com.logiclens.backend.model.User;
import com.logiclens.backend.service.GeminiService;
import com.logiclens.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {


private final UserService userService;
private final GeminiService geminiService;

public UserController(UserService userService, GeminiService geminiService) {
    this.userService = userService;
    this.geminiService = geminiService;
}

// ================= USER APIs =================

@PostMapping
public User createUser(@Valid @RequestBody UserDTO userDTO) {

    User user = new User();
    user.setName(userDTO.getName());
    user.setEmail(userDTO.getEmail());
    user.setPassword(userDTO.getPassword());

    return userService.createUser(user);
}

@GetMapping
public List<User> getAllUsers() {
    return userService.getAllUsers();
}

@PostMapping("/login")
public String loginUser(@RequestBody LoginRequest loginRequest) {

    return userService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
    );
}

// ================= AI API =================

@PostMapping("/analyze-ai")
public ResponseEntity<AnalysisResponse> analyzeAI(@RequestBody CodeRequest request){

    System.out.println("🔥 CONTROLLER HIT SUCCESS");

    AnalysisResponse response = geminiService.analyzeCode(
            request.getLanguage(),
            request.getCode()
    );

    System.out.println("🔥 RESPONSE = " + response);

    return ResponseEntity.ok(response);
}


}
