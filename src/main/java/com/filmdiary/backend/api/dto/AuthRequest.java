package com.filmdiary.backend.api.dto;
import java.sql.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private Date fechaNac;

}
