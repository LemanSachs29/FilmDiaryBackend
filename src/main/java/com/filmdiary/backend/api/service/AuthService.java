package com.filmdiary.backend.api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.dto.AuthRequestDto;
import com.filmdiary.backend.api.dto.AuthResponseDto;
import com.filmdiary.backend.api.entity.Role;
import com.filmdiary.backend.api.entity.UsuarioEntity;
import com.filmdiary.backend.api.repository.UsuarioRepository;
import com.filmdiary.backend.api.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authManager;
    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDto login(AuthRequestDto request) {
        log.info("Login attempt for: {}", request.getEmail());
        
        // Verificar que el usuario existe
        UsuarioEntity user = usuarioRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Autenticar
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        
        log.info("Successful login: {}", request.getEmail());
        
        String token = jwtUtil.generateToken(user);
        return new AuthResponseDto(token);
    }

    public AuthResponseDto register(AuthRequestDto request) {
        log.info("Registration attempt for: {}", request.getEmail());
        
        if (usuarioRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        UsuarioEntity.UsuarioEntityBuilder builder = UsuarioEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .fechaAlta(LocalDateTime.now());

        if(request.getNombre() != null){
            builder.nombre(request.getNombre());
        }
        if(request.getApellido() != null){
            builder.apellido(request.getApellido());
        }
        if(request.getFechaNac() != null){
            builder.fechaNac(request.getFechaNac());
        }
        
        UsuarioEntity nuevoUsuario = builder.build();
        usuarioRepo.save(nuevoUsuario);
        
        log.info("User registered successfully: {}", nuevoUsuario.getEmail());

        String token = jwtUtil.generateToken(nuevoUsuario);
        return new AuthResponseDto(token);
    }
}