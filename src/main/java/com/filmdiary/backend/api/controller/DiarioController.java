package com.filmdiary.backend.api.controller;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.filmdiary.backend.api.entity.UsuarioDiarioEntity;
import com.filmdiary.backend.api.service.DiarioService;
import com.filmdiary.backend.api.service.MovieIntegrationService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/diario")
@Slf4j
public class DiarioController {

    @Autowired
    private DiarioService diarioService;
    
    @Autowired
    private MovieIntegrationService movieIntegrationService;

    /**
     * Obtiene el diario paginado del usuario
     * GET /api/diario?page=0&size=10&usuarioId=1
     */
    @GetMapping
    public ResponseEntity<Page<UsuarioDiarioEntity>> getDiario(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Long usuarioId) {
        
        log.info("Getting diary for user: {} (page: {}, size: {})", usuarioId, page, size);
        
        Page<UsuarioDiarioEntity> diario = diarioService.getDiarioPaginado(usuarioId, page, size);
        
        log.info("Retrieved {} diary entries for user {}", diario.getNumberOfElements(), usuarioId);
        return ResponseEntity.ok(diario);
    }

    /**
     * Añade una película de TMDB al diario del usuario
     * Verifica si existe en BD local, si no la obtiene de TMDB y la guarda
     * POST /api/diario/tmdb/{tmdbId}
     */
    @PostMapping("/tmdb/{tmdbId}")
    public ResponseEntity<UsuarioDiarioEntity> addTmdbMovieToDiario(
            @PathVariable Long tmdbId,
            @RequestParam Long usuarioId,
            @RequestParam(required = false) Float puntuacion,
            @RequestParam(required = false) LocalDate fechaVisionado) {
        
        log.info("Adding TMDB movie {} to diary for user {} with rating {}", 
                 tmdbId, usuarioId, puntuacion);
        
        // Usar MovieIntegrationService que maneja la lógica de obtener/crear película
        UsuarioDiarioEntity entry = movieIntegrationService.addToDiario(
            usuarioId, tmdbId, puntuacion, fechaVisionado);
        
        log.info("TMDB movie {} successfully added to diary for user {}", tmdbId, usuarioId);
        return ResponseEntity.ok(entry);
    }

    /**
     * Actualiza una entrada del diario existente
     * PUT /api/diario/{entryId}
     */
    @PutMapping("/{entryId}")
    public ResponseEntity<UsuarioDiarioEntity> updateDiarioEntry(
            @PathVariable Long entryId,
            @RequestParam(required = false) LocalDate fechaVisionado,
            @RequestParam(required = false) Float puntuacion) {
        
        log.info("Updating diary entry {} with date: {} and rating: {}", 
                 entryId, fechaVisionado, puntuacion);
        
        // Obtener la entrada actual para preservar valores no modificados
        UsuarioDiarioEntity currentEntry = diarioService.getDiarioEntry(entryId);
        
        // Usar valores actuales si no se proporcionan nuevos
        LocalDate newFecha = fechaVisionado != null ? fechaVisionado : currentEntry.getFechaVisionado();
        float newPuntuacion = puntuacion != null ? puntuacion : currentEntry.getPuntuacion();
        
        // Validar puntuación si se proporciona
        if (puntuacion != null && (puntuacion < 0 || puntuacion > 5)) {
            throw new RuntimeException("La puntuación debe estar entre 0 y 5");
        }
        
        UsuarioDiarioEntity entry = diarioService.updateDiarioEntry(entryId, newFecha, newPuntuacion);
        
        log.info("Diary entry {} successfully updated", entryId);
        return ResponseEntity.ok(entry);
    }

    /**
     * Elimina una entrada del diario
     * DELETE /api/diario/{entryId}
     */
    @DeleteMapping("/{entryId}")
    public ResponseEntity<Void> removeFromDiario(@PathVariable Long entryId) {
        
        log.info("Removing diary entry: {}", entryId);
        
        diarioService.removeFromDiario(entryId);
        
        log.info("Diary entry {} successfully removed", entryId);
        return ResponseEntity.ok().build();
    }

    /**
     * Obtiene una entrada específica del diario
     * GET /api/diario/{entryId}
     */
    @GetMapping("/{entryId}")
    public ResponseEntity<UsuarioDiarioEntity> getDiarioEntry(@PathVariable Long entryId) {
        
        log.info("Getting diary entry: {}", entryId);
        
        UsuarioDiarioEntity entry = diarioService.getDiarioEntry(entryId);
        
        log.info("Retrieved diary entry: {}", entryId);
        return ResponseEntity.ok(entry);
    }
}