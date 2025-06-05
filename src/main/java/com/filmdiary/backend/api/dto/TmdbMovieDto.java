package com.filmdiary.backend.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TmdbMovieDto {
    
    private boolean adult;
    
    @JsonProperty("backdrop_path")
    private String backdropPath;
    
    @JsonProperty("genre_ids")
    private List<Integer> genreIds;
    
    private Long id;
    
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
    
    private String title;
    
    private boolean video;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    @JsonProperty("vote_count")
    private Integer voteCount;
}