package com.filmdiary.backend.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;

@Getter
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private String token;
    private UserInfoDto user;
    
    @Getter
    @Builder
    public static class UserInfoDto {
        private Long id;
        private String username;
        private String email;
        private String nombre;
        private String apellido;
        private LocalDate fechaNac;
        private LocalDateTime fechaAlta;
        private String role;
    }
}