package com.filmdiary.backend.api.controller;


import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.filmdiary.backend.api.entity.UsuarioDiarioEntity;
import com.filmdiary.backend.api.service.DiarioService;

@RestController
@RequestMapping("/api/diario")
public class DiarioController {

    @Autowired
    private DiarioService diarioService;

    /**
     * Lista Paginada con el diario de un usuario
     */
    @GetMapping
    public ResponseEntity<Page<UsuarioDiarioEntity>> getDiario(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam Long usuarioId) {
            Page<UsuarioDiarioEntity> diario = diarioService.getDiarioPaginado(usuarioId, page, size);
        return ResponseEntity.ok(diario);
    }


    /**
     * Añade una nueva entrada al diario
     */
    @PostMapping
    public ResponseEntity<UsuarioDiarioEntity> addToDiario(
            @RequestParam Long usuarioId,
            @RequestParam Long peliculaId,
            @RequestParam LocalDateTime fechaVisionado,
            @RequestParam float puntuacion) {
        
        UsuarioDiarioEntity entry = diarioService.addToDiario(usuarioId, peliculaId, fechaVisionado, puntuacion);
        return ResponseEntity.ok(entry);
    }

    /**
     * Actualiza una entrada del diario
     */
    @PutMapping("/{entryId}")
    public ResponseEntity<UsuarioDiarioEntity> updateDiarioEntry(
            @PathVariable Long entryId,
            @RequestParam LocalDateTime fechaVisionado,
            @RequestParam float puntuacion) {
        
        UsuarioDiarioEntity entry = diarioService.updateDiarioEntry(entryId, fechaVisionado, puntuacion);
        return ResponseEntity.ok(entry);
    }

    /**
     * Elimina una entrada del diario
     */
    @DeleteMapping("/{entryId}")
    public ResponseEntity<Void> removeFromDiario(@PathVariable Long entryId) {
        diarioService.removeFromDiario(entryId);
        return ResponseEntity.ok().build();
    }

    /**
     * Obtiene una entrada específica del diario
     */
    @GetMapping("/{entryId}")
    public ResponseEntity<UsuarioDiarioEntity> getDiarioEntry(@PathVariable Long entryId) {
        UsuarioDiarioEntity entry = diarioService.getDiarioEntry(entryId);
        return ResponseEntity.ok(entry);
    }
        

    
}
