package com.filmdiary.backend.api.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.filmdiary.backend.api.entity.UsuarioWatchlistEntity;
import com.filmdiary.backend.api.entity.UsuarioWatchlistEntityKey;

public interface WatchlistRepository extends JpaRepository<UsuarioWatchlistEntity, UsuarioWatchlistEntityKey> {
    
    
    @Query("SELECT w FROM UsuarioWatchlistEntity w " +
           "JOIN FETCH w.pelicula " +
           "WHERE w.id.usuarioId = :usuarioId " +
           "ORDER BY w.fechaAnadido DESC")
    Page<UsuarioWatchlistEntity> findWatchlistWithMovies(@Param("usuarioId") Long usuarioId, Pageable pageable);
    
}
