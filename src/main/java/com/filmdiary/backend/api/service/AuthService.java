package com.filmdiary.backend.api.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.dto.AuthRequest;
import com.filmdiary.backend.api.dto.AuthResponse;
import com.filmdiary.backend.api.entity.Role;
import com.filmdiary.backend.api.entity.UsuarioEntity;
import com.filmdiary.backend.api.repository.UsuarioRepository;
import com.filmdiary.backend.api.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j  // Para logs
public class AuthService {

    private final AuthenticationManager authManager;
    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        log.info("Intento de login para email: {}", request.getEmail());
        
        try {
            // Verificar que el usuario existe
            UsuarioEntity user = usuarioRepo.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        log.error("Usuario no encontrado: {}", request.getEmail());
                        return new RuntimeException("Usuario no encontrado");
                    });
            
            log.info("Usuario encontrado: {}", user.getEmail());
            
            // Intentar autenticación
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
            
            log.info("Autenticación exitosa para: {}", request.getEmail());
            
            String token = jwtUtil.generateToken(user);
            
            return new AuthResponse(token);
            
        } catch (Exception e) {
            log.error("Error en login: {}", e.getMessage());
            throw e;
        }
    }

    public AuthResponse register(AuthRequest request) {
        log.info("Intento de registro para email: {}", request.getEmail());
        
        if (usuarioRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        UsuarioEntity.UsuarioEntityBuilder builder = UsuarioEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .fechaAlta(new java.sql.Date(System.currentTimeMillis()));

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
        log.info("Usuario registrado exitosamente: {}", nuevoUsuario.getEmail());

        String token = jwtUtil.generateToken(nuevoUsuario);
        return new AuthResponse(token);
    }
}