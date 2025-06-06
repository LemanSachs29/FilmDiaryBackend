package com.filmdiary.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filmdiary.backend.api.dto.RegisterRequestDto;
import com.filmdiary.backend.api.dto.LoginRequestDto;
import com.filmdiary.backend.api.dto.AuthRequestDto;
import com.filmdiary.backend.api.dto.AuthResponseDto;
import com.filmdiary.backend.api.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        // Convertir a AuthRequestDto para mantener compatibilidad con el servicio
        AuthRequestDto authRequest = new AuthRequestDto();
        authRequest.setEmail(request.getEmail());
        authRequest.setPassword(request.getPassword());
        
        AuthResponseDto response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        // Convertir a AuthRequestDto para mantener compatibilidad con el servicio
        AuthRequestDto authRequest = new AuthRequestDto();
        authRequest.setUsername(request.getUsername());
        authRequest.setPassword(request.getPassword());
        authRequest.setEmail(request.getEmail());
        authRequest.setNombre(request.getNombre());
        authRequest.setApellido(request.getApellido());
        authRequest.setFechaNac(request.getFechaNac());
        
        AuthResponseDto response = authService.register(authRequest);
        return ResponseEntity.ok(response);
    }
}