package com.filmdiary.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.filmdiary.backend.api.dto.TmdbSearchResponseDto;
import com.filmdiary.backend.api.dto.TmdbMovieDetailsDto;
import com.filmdiary.backend.api.service.TmdbService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieSearchController {
    
    private final TmdbService tmdbService;
    
    /**
     * Busca películas en TMDB
     * 
     * @param query Texto a buscar (obligatorio)
     * @param page Página de resultados (opcional, default=1)
     * @param includeAdult Incluir contenido adulto (opcional, default=false)
     * @return Lista paginada de películas
     */
    @GetMapping("/search")
    public ResponseEntity<TmdbSearchResponseDto> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "false") Boolean includeAdult) {
        
        // Validación básica
        if (query == null || query.trim().isEmpty()) {
            throw new RuntimeException("El parámetro 'query' es obligatorio");
        }
        
        TmdbSearchResponseDto results = tmdbService.searchMovies(query.trim(), page, includeAdult);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Obtiene detalles completos de una película específica
     * 
     * @param movieId ID de la película en TMDB
     * @return Detalles completos de la película
     */
    @GetMapping("/{movieId}")
    public ResponseEntity<TmdbMovieDetailsDto> getMovieDetails(@PathVariable Long movieId) {
        TmdbMovieDetailsDto movie = tmdbService.getMovieDetails(movieId);
        return ResponseEntity.ok(movie);
    }
}