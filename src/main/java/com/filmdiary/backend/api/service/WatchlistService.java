package com.filmdiary.backend.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.entity.UsuarioWatchlistEntity;
import com.filmdiary.backend.api.entity.UsuarioWatchlistEntityKey;
import com.filmdiary.backend.api.repository.WatchlistRepository;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    public Page<UsuarioWatchlistEntity> getWatchlistPaginada(Long usuarioId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return watchlistRepository.findWatchlistWithMovies(usuarioId, pageable);
    }

    
    public void addToWatchlist(Long usuarioId, Long peliculaId) {
        UsuarioWatchlistEntityKey key = new UsuarioWatchlistEntityKey(usuarioId, peliculaId);
        UsuarioWatchlistEntity watchlistEntry = new UsuarioWatchlistEntity();
        watchlistEntry.setUsuarioWatchlistEntityKey(key);
        watchlistEntry.setFechaAgregado(LocalDateTime.now());
        watchlistRepository.save(watchlistEntry);
    }

    public void removeFromWatchlist(Long usuarioId, Long peliculaId) {
        UsuarioWatchlistEntityKey key = new UsuarioWatchlistEntityKey(usuarioId, peliculaId);
        watchlistRepository.deleteById(key);  // ← Método que ya tienes
    }

    public boolean isInWatchlist(Long usuarioId, Long peliculaId) {
        UsuarioWatchlistEntityKey key = new UsuarioWatchlistEntityKey(usuarioId, peliculaId);
        return watchlistRepository.existsById(key);  // ← Método que ya tienes
    }

    public boolean isInWatchlistByTmdbId(Long usuarioId, Long tmdbId) {
        return watchlistRepository.existsByUsuarioAndTmdbId(usuarioId, tmdbId);
    }
    
}
