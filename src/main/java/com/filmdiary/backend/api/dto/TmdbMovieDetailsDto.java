package com.filmdiary.backend.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TmdbMovieDetailsDto {
    
    private boolean adult;
    
    @JsonProperty("backdrop_path")
    private String backdropPath;
    
    private Long budget;
    
    private List<GenreDto> genres;
    
    private Long id;
    
    @JsonProperty("imdb_id")
    private String imdbId;
    
    @JsonProperty("original_language")
    private String originalLanguage;
    
    @JsonProperty("original_title")
    private String originalTitle;
    
    private String overview;
    
    private Double popularity;
    
    @JsonProperty("poster_path")
    private String posterPath;
    
    @JsonProperty("release_date")
    private String releaseDate;
    
    private Long revenue;
    
    private Integer runtime; // duración en minutos
    
    private String status;
    
    private String tagline;
    
    private String title;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    @JsonProperty("vote_count")
    private Integer voteCount;
    
    // DTO anidado para géneros
    @Getter
    @Setter
    public static class GenreDto {
        private Integer id;
        private String name;
    }
}