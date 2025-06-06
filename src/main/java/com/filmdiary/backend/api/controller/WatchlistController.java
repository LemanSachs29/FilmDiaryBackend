package com.filmdiary.backend.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.filmdiary.backend.api.entity.UsuarioWatchlistEntity;
import com.filmdiary.backend.api.service.WatchlistService;
import com.filmdiary.backend.api.service.MovieIntegrationService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/watchlist")
@Slf4j
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;
    
    @Autowired
    private MovieIntegrationService movieIntegrationService;

    /**
     * Obtiene la watchlist paginada del usuario
     * GET /api/watchlist?page=0&size=10&usuarioId=1
     */
    @GetMapping
    public ResponseEntity<Page<UsuarioWatchlistEntity>> getWatchlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Long usuarioId) {
        
        log.info("Getting watchlist for user: {} (page: {}, size: {})", usuarioId, page, size);
        
        Page<UsuarioWatchlistEntity> watchlist = watchlistService.getWatchlistPaginada(usuarioId, page, size);
        
        log.info("Retrieved {} watchlist entries for user {}", watchlist.getNumberOfElements(), usuarioId);
        return ResponseEntity.ok(watchlist);
    }

    /**
     * Añade una película de TMDB a la watchlist del usuario
     * Verifica si existe en BD local, si no la obtiene de TMDB y la guarda
     * POST /api/watchlist/tmdb/{tmdbId}
     */
    @PostMapping("/tmdb/{tmdbId}")
    public ResponseEntity<Void> addTmdbMovieToWatchlist(
            @PathVariable Long tmdbId,
            @RequestParam Long usuarioId) {
        
        log.info("Adding TMDB movie {} to watchlist for user {}", tmdbId, usuarioId);
        
        // Usar MovieIntegrationService que maneja la lógica de obtener/crear película
        movieIntegrationService.addToWatchlist(usuarioId, tmdbId);
        
        log.info("TMDB movie {} successfully added to watchlist for user {}", tmdbId, usuarioId);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina una película de la watchlist usando el ID local de la película
     * DELETE /api/watchlist/{peliculaId}
     */
    @DeleteMapping("/{peliculaId}")
    public ResponseEntity<Void> removeFromWatchlist(
            @PathVariable Long peliculaId,
            @RequestParam Long usuarioId) {
        
        log.info("Removing movie {} from watchlist for user {}", peliculaId, usuarioId);
        
        watchlistService.removeFromWatchlist(usuarioId, peliculaId);
        
        log.info("Movie {} successfully removed from watchlist for user {}", peliculaId, usuarioId);
        return ResponseEntity.ok().build();
    }

    /**
     * Verifica si una película está en la watchlist del usuario
     * GET /api/watchlist/check/{peliculaId}
     */
    @GetMapping("/check/{peliculaId}")
    public ResponseEntity<Boolean> isInWatchlist(
            @PathVariable Long peliculaId,
            @RequestParam Long usuarioId) {
        
        log.debug("Checking if movie {} is in watchlist for user {}", peliculaId, usuarioId);
        
        boolean exists = watchlistService.isInWatchlist(usuarioId, peliculaId);
        
        log.debug("Movie {} {} in watchlist for user {}", 
                 peliculaId, exists ? "is" : "is not", usuarioId);
        
        return ResponseEntity.ok(exists);
    }

    /**
     * Obtiene el conteo total de películas en la watchlist del usuario
     * GET /api/watchlist/count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getWatchlistCount(@RequestParam Long usuarioId) {
        
        log.info("Getting watchlist count for user: {}", usuarioId);
        
        // Obtener todas las películas (página grande) y contar
        Page<UsuarioWatchlistEntity> watchlist = watchlistService.getWatchlistPaginada(usuarioId, 0, Integer.MAX_VALUE);
        Long count = watchlist.getTotalElements();
        
        log.info("User {} has {} movies in watchlist", usuarioId, count);
        return ResponseEntity.ok(count);
    }
}