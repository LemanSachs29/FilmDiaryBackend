package com.filmdiary.backend.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

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
    public UsuarioDiarioEntity addToDiario(Long usuarioId, Long peliculaId, LocalDateTime fechaVisionado, float puntuacion) {
        UsuarioDiarioEntity diarioEntry = UsuarioDiarioEntity.builder()
                .idUsuario(usuarioId)
                .idPelicula(peliculaId)
                .fechaVisionado(fechaVisionado)
                .puntuacion(puntuacion)
                .build();
        
        return diarioRepository.save(diarioEntry);
    }

    /**
     * Actualiza una entrada del diario
     */
    public UsuarioDiarioEntity updateDiarioEntry(Long entryId, LocalDateTime fechaVisionado, float puntuacion) {
        UsuarioDiarioEntity entry = diarioRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entrada del diario no encontrada"));
        
        entry.setFechaVisionado(fechaVisionado);
        entry.setPuntuacion(puntuacion);
        
        return diarioRepository.save(entry);
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
        return diarioRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entrada del diario no encontrada"));
    }
}