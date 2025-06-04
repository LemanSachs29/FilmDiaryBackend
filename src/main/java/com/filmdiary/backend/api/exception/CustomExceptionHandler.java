package com.filmdiary.backend.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class CustomExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.error("Error en la aplicación: {}", e.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            "ERROR",
            e.getMessage()
        );
        
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e) {
        log.warn("Intento de login fallido: credenciales incorrectas");
        
        ErrorResponse error = new ErrorResponse(
            "CREDENCIALES_INCORRECTAS",
            "Email o contraseña incorrectos"
        );
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        log.error("Error inesperado: ", e);
        
        ErrorResponse error = new ErrorResponse(
            "ERROR_INTERNO",
            "Ha ocurrido un error interno en el servidor"
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // Clase interna para la respuesta de error
    public static class ErrorResponse {
        private final String codigo;
        private final String mensaje;
        
        public ErrorResponse(String codigo, String mensaje) {
            this.codigo = codigo;
            this.mensaje = mensaje;
        }
        
        public String getCodigo() { return codigo; }
        public String getMensaje() { return mensaje; }
    }
}