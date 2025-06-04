package com.filmdiary.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filmdiary.backend.api.dto.AuthRequestDto;
import com.filmdiary.backend.api.dto.AuthResponseDto;
import com.filmdiary.backend.api.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto request) {
        // Validación básica
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email y contraseña son obligatorios");
        }
        
        AuthResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody AuthRequestDto request) {
        // Validación básica
        if (request.getEmail() == null || request.getPassword() == null || request.getUsername() == null) {
            throw new RuntimeException("Email, contraseña y username son obligatorios");
        }
        
        AuthResponseDto response = authService.register(request);
        return ResponseEntity.ok(response);
    }
}