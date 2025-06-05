package com.filmdiary.backend.api.entity;

import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pelicula")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeliculaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pelicula")
    @NotNull
    private Long id;

    @Column(name = "id_tmdb")
    @NotNull
    private Long idTmdb;

    private String titulo;

    @Column(name = "release_date")
    @NotNull
    private Date releaseDate;

    @Column(name = "poster_url")
    @NotNull
    private String posterUrl;

}
