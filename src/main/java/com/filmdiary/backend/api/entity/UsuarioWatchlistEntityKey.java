package com.filmdiary.backend.api.entity;
import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioWatchlistEntityKey implements Serializable{


    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "id_pelicula")
    private Long idPelicula;


}
