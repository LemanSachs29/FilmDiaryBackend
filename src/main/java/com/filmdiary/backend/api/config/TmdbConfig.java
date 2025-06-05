package com.filmdiary.backend.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "tmdb")
@Getter
@Setter
public class TmdbConfig {
    
    private String apiKey;
    
    public String getBearerAuthHeader() {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("TMDB API Key no configurada. Establece la variable TMDB_API_KEY");
        }
        return "Bearer " + apiKey;
    }
}