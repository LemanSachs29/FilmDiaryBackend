package com.filmdiary.backend.api.dto;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequestDto {
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private LocalDate fechaNac;

}
