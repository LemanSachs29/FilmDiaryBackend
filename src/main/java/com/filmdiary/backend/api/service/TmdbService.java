package com.filmdiary.backend.api.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.filmdiary.backend.api.config.TmdbConfig;
import com.filmdiary.backend.api.dto.TmdbSearchResponseDto;
import com.filmdiary.backend.api.dto.TmdbMovieDetailsDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TmdbService {
    
    private final TmdbConfig tmdbConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    
    // URLs de TMDB
    private static final String BASE_URL = "https://api.themoviedb.org/3";
    private static final String SEARCH_MOVIE_URL = BASE_URL + "/search/movie";
    private static final String MOVIE_DETAILS_URL = BASE_URL + "/movie/";
    
    /**
     * Busca películas en TMDB
     */
    public TmdbSearchResponseDto searchMovies(String query, Integer page, Boolean includeAdult) {
        log.info("Searching movies: query='{}', page={}, includeAdult={}", query, page, includeAdult);
        
        // Construir URL con parámetros
        String url = UriComponentsBuilder.fromHttpUrl(SEARCH_MOVIE_URL)
                .queryParam("query", query)
                .queryParam("language", "es-ES")
                .queryParam("page", page != null ? page : 1)
                .queryParam("include_adult", includeAdult != null ? includeAdult : false)
                .build()
                .toUriString();
        
        // Headers con Bearer Token
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", tmdbConfig.getBearerAuthHeader());
        headers.set("accept", "application/json");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<TmdbSearchResponseDto> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                TmdbSearchResponseDto.class
            );
            
            log.info("TMDB search successful: {} results found", 
                response.getBody() != null ? response.getBody().getTotalResults() : 0);
            
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error searching movies in TMDB: {}", e.getMessage());
            throw new RuntimeException("Error al buscar películas en TMDB: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene detalles completos de una película específica
     */
    public TmdbMovieDetailsDto getMovieDetails(Long movieId) {
        log.info("Getting movie details for ID: {}", movieId);
        
        String url = UriComponentsBuilder.fromHttpUrl(MOVIE_DETAILS_URL + movieId)
                .queryParam("language", "es-ES")
                .build()
                .toUriString();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", tmdbConfig.getBearerAuthHeader());
        headers.set("accept", "application/json");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<TmdbMovieDetailsDto> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                TmdbMovieDetailsDto.class
            );
            
            log.info("Movie details retrieved successfully for ID: {}", movieId);
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error getting movie details from TMDB: {}", e.getMessage());
            throw new RuntimeException("Error al obtener detalles de la película: " + e.getMessage());
        }
    }
}