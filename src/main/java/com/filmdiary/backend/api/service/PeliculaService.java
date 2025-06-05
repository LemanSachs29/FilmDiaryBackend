package com.filmdiary.backend.api.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.entity.PeliculaEntity;
import com.filmdiary.backend.api.repository.PeliculaRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PeliculaService {

    @Autowired
    private PeliculaRepository peliculaRepository;

    /**
     * Busca una película por su ID de TMDB
     * @param tmdbId ID de la película en TMDB
     * @return Optional con la película si existe en BD local
     */
    public Optional<PeliculaEntity> findByTmdbId(Long tmdbId) {
        log.debug("Buscando película con TMDB ID: {}", tmdbId);
        return peliculaRepository.findByIdTmdb(tmdbId);
    }

    /**
     * Guarda una película en la base de datos
     * @param pelicula La película a guardar
     * @return La película guardada con su ID generado
     */
    public PeliculaEntity save(PeliculaEntity pelicula) {
        log.info("Guardando película: {} (TMDB ID: {})", pelicula.getTitulo(), pelicula.getIdTmdb());
        return peliculaRepository.save(pelicula);
    }

    /**
     * Busca una película por su ID local
     * @param id ID local de la película
     * @return Optional con la película si existe
     */
    public Optional<PeliculaEntity> findById(Long id) {
        return peliculaRepository.findById(id);
    }

    /**
     * Verifica si una película existe por su TMDB ID
     * @param tmdbId ID de TMDB
     * @return true si existe, false si no
     */
    public boolean existsByTmdbId(Long tmdbId) {
        return peliculaRepository.findByIdTmdb(tmdbId).isPresent();
    }
}