package com.filmdiary.backend.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.entity.UsuarioDiarioEntity;
import com.filmdiary.backend.api.repository.DiarioRepository;


@Service
public class DiarioService {

    @Autowired
    private DiarioRepository diarioRepository;

    /**
     * Obtiene el diario paginado del usuario con la información de películas incluida
     */
    public Page<UsuarioDiarioEntity> getDiarioPaginado(Long usuarioId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return diarioRepository.findDiarioWithMovies(usuarioId, pageable);
    }

    /**
     * Añade una nueva entrada al diario
     */
    public UsuarioDiarioEntity addToDiario(Long usuarioId, Long peliculaId, LocalDate fechaVisionado, float puntuacion) {
        // 1. Crear y guardar la entrada
        UsuarioDiarioEntity diarioEntry = UsuarioDiarioEntity.builder()
                .idUsuario(usuarioId)
                .idPelicula(peliculaId)
                .fechaVisionado(fechaVisionado)
                .puntuacion(puntuacion)
                .build();
        
        UsuarioDiarioEntity saved = diarioRepository.save(diarioEntry);
        
        // 2. CRUCIAL: Recargar la entrada con la relación de película
        return diarioRepository.findDiarioEntryWithMovie(saved.getIdEntradaPelicula())
                .orElse(saved); // Fallback si algo falla
    }

    /**
     * Actualiza una entrada del diario
     */
    public UsuarioDiarioEntity updateDiarioEntry(Long entryId, LocalDate fechaVisionado, float puntuacion) {
        UsuarioDiarioEntity entry = diarioRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entrada del diario no encontrada"));
        
        entry.setFechaVisionado(fechaVisionado);
        entry.setPuntuacion(puntuacion);
        
        UsuarioDiarioEntity saved = diarioRepository.save(entry);
        
        // También recargar aquí para consistencia
        return diarioRepository.findDiarioEntryWithMovie(saved.getIdEntradaPelicula())
                .orElse(saved);
    }

    /**
     * Elimina una entrada del diario
     */
    public void removeFromDiario(Long entryId) {
        if (!diarioRepository.existsById(entryId)) {
            throw new RuntimeException("La entrada del diario no existe");
        }
        
        diarioRepository.deleteById(entryId);
    }

    /**
     * Obtiene una entrada específica del diario
     */
    public UsuarioDiarioEntity getDiarioEntry(Long entryId) {
        // Usar query que incluye película
        return diarioRepository.findDiarioEntryWithMovie(entryId)
                .orElseThrow(() -> new RuntimeException("Entrada del diario no encontrada"));
    }
}