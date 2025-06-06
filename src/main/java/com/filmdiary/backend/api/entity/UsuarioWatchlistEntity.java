package com.filmdiary.backend.api.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_watchlist")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class UsuarioWatchlistEntity {
    
    @EmbeddedId
    private UsuarioWatchlistEntityKey usuarioWatchlistEntityKey;

    @Column(name = "fecha_agregado")
    private LocalDateTime fechaAgregado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pelicula", insertable = false, updatable = false)
    private PeliculaEntity pelicula;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    @JsonIgnore
    private UsuarioEntity usuario;

}
