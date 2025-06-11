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
           "WHERE w.usuarioWatchlistEntityKey.idUsuario = :usuarioId " +
           "ORDER BY w.fechaAgregado DESC")
    Page<UsuarioWatchlistEntity> findWatchlistWithMovies(@Param("usuarioId") Long usuarioId, Pageable pageable);
    

     @Query("SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END " +
           "FROM UsuarioWatchlistEntity w " +
           "JOIN w.pelicula p " +
           "WHERE w.usuarioWatchlistEntityKey.idUsuario = :usuarioId " +
           "AND p.idTmdb = :tmdbId")
    boolean existsByUsuarioAndTmdbId(@Param("usuarioId") Long usuarioId, @Param("tmdbId") Long tmdbId);
}
