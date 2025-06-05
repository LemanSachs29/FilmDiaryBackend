package com.filmdiary.backend.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.filmdiary.backend.api.entity.UsuarioWatchlistEntity;
import com.filmdiary.backend.api.service.WatchlistService;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<Page<UsuarioWatchlistEntity>> getWatchlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Long usuarioId) {
        
        Page<UsuarioWatchlistEntity> watchlist = watchlistService.getWatchlistPaginada(usuarioId, page, size);
        
        return ResponseEntity.ok(watchlist);
    }
}

