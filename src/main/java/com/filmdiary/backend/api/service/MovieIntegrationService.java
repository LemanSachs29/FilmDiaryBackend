package com.filmdiary.backend.api.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.dto.TmdbMovieDetailsDto;
import com.filmdiary.backend.api.entity.PeliculaEntity;
import com.filmdiary.backend.api.entity.UsuarioDiarioEntity;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MovieIntegrationService {

    @Autowired
    private TmdbService tmdbService;
    
    @Autowired
    private PeliculaService peliculaService;
    
    @Autowired
    private WatchlistService watchlistService;
    
    @Autowired
    private DiarioService diarioService;

    /**
     * Añade una película de TMDB a la watchlist del usuario (idempotente)
     * Si la película no existe en BD local, la obtiene de TMDB y la guarda
     */
    public void addToWatchlist(Long usuarioId, Long tmdbId) {
        log.info("Adding movie {} to watchlist for user {}", tmdbId, usuarioId);
        
        // 1. Obtener o crear la película en BD local
        PeliculaEntity pelicula = getOrCreateMovie(tmdbId);
        
        // 2. Añadir solo si no está ya en la watchlist (idempotente)
        if (!watchlistService.isInWatchlist(usuarioId, pelicula.getId())) {
            watchlistService.addToWatchlist(usuarioId, pelicula.getId());
            log.info("Movie {} successfully added to watchlist for user {}", tmdbId, usuarioId);
        } else {
            log.debug("Movie {} already in watchlist for user {} - no action needed", tmdbId, usuarioId);
        }
    }


    /**
     * Añade una película de TMDB al diario del usuario
     */
    public UsuarioDiarioEntity addToDiario(Long usuarioId, Long tmdbId, Float puntuacion, LocalDate fechaVisionado) {
        log.info("Adding movie {} to diary for user {} with rating {}", tmdbId, usuarioId, puntuacion);
        
        // 1. Obtener o crear la película en BD local
        PeliculaEntity pelicula = getOrCreateMovie(tmdbId);
        
        // 2. Validar puntuación si se proporciona
        if (puntuacion != null && (puntuacion < 0 || puntuacion > 5)) {
            throw new IllegalArgumentException("La puntuación debe estar entre 0 y 5");
        }
        
        // 3. Añadir al diario (puede haber múltiples entradas de la misma película)
        UsuarioDiarioEntity diarioEntry = diarioService.addToDiario(
            usuarioId, 
            pelicula.getId(), 
            fechaVisionado != null ? fechaVisionado : LocalDate.now(), 
            puntuacion != null ? puntuacion : 0.0f
        );
        
        log.info("Movie {} successfully added to diary for user {}", tmdbId, usuarioId);
        return diarioEntry;
    }

    /**
     * Método principal: Obtiene una película de BD local o la crea desde TMDB
     */
    private PeliculaEntity getOrCreateMovie(Long tmdbId) {
        log.debug("Getting or creating movie with TMDB ID: {}", tmdbId);
        
        // 1. Buscar si ya existe en BD local
        Optional<PeliculaEntity> existingMovie = peliculaService.findByTmdbId(tmdbId);
        if (existingMovie.isPresent()) {
            log.debug("Movie {} found in local database", tmdbId);
            return existingMovie.get();
        }
        
        // 2. No existe, obtener de TMDB
        log.info("Movie {} not found locally, fetching from TMDB", tmdbId);
        TmdbMovieDetailsDto tmdbMovie = tmdbService.getMovieDetails(tmdbId);
        
        if (tmdbMovie == null) {
            throw new RuntimeException("Película no encontrada en TMDB con ID: " + tmdbId);
        }
        
        // 3. Convertir de TMDB DTO a entidad local
        PeliculaEntity nuevaPelicula = convertTmdbToEntity(tmdbMovie);
        
        // 4. Guardar en BD local
        PeliculaEntity peliculaGuardada = peliculaService.save(nuevaPelicula);
        
        log.info("Movie {} successfully saved to local database with ID {}", tmdbId, peliculaGuardada.getId());
        return peliculaGuardada;
    }

    /**
     * Convierte un DTO de TMDB a una entidad de película local
     */
    private PeliculaEntity convertTmdbToEntity(TmdbMovieDetailsDto tmdbMovie) {
        return PeliculaEntity.builder()
                .idTmdb(tmdbMovie.getId())
                .titulo(tmdbMovie.getTitle())
                .posterUrl(tmdbMovie.getPosterPath() != null ? 
                    "https://image.tmdb.org/t/p/w500" + tmdbMovie.getPosterPath() : null)
                .releaseDate(parseReleaseDate(tmdbMovie.getReleaseDate()))
                .build();
    }

    /**
     * Convierte fecha de TMDB (String "YYYY-MM-DD") a LocalDate
     */
    private LocalDate parseReleaseDate(String releaseDateString) {
        if (releaseDateString == null || releaseDateString.isEmpty()) {
            return null;
        }
        
        try {
            return LocalDate.parse(releaseDateString); // "1972-03-14" → LocalDate
        } catch (Exception e) {
            log.warn("Could not parse release date: {}", releaseDateString);
            return null;
        }
    }
}