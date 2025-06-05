package com.filmdiary.backend.api.repository;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.filmdiary.backend.api.entity.UsuarioDiarioEntity;

public interface DiarioRepository extends JpaRepository<UsuarioDiarioEntity, Long>{

    @Query("SELECT d FROM UsuarioDiarioEntity d " +
           "JOIN FETCH d.pelicula " +
           "WHERE d.idUsuario = :usuarioId " +
           "ORDER BY d.fechaVisionado DESC")
    Page<UsuarioDiarioEntity> findDiarioWithMovies(@Param("usuarioId") Long usuarioId, Pageable pageable);
   

}
