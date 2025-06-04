package com.filmdiary.backend.api.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_diario")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioDiarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrada_pelicula")
    private Long idEntradaPelicula;

    @Column(name = "fecha_visionado")
    private Date fechaVisionado;

    private float puntuacion;

    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "id_pelicula")
    private Long idPelicula;

}
