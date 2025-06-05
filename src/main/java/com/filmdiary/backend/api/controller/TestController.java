package com.filmdiary.backend.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filmdiary.backend.api.config.TmdbConfig;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {
    
    private final TmdbConfig tmdbConfig;
    
    @GetMapping("/tmdb")
    public ResponseEntity<String> testTmdb() {
        try {
            String bearerHeader = tmdbConfig.getBearerAuthHeader();
            return ResponseEntity.ok("✅ TMDB configurado correctamente!\nHeader: " + 
                bearerHeader.substring(0, 20) + "...");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error: " + e.getMessage());
        }
    }
}