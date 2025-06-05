package com.filmdiary.backend.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filmdiary.backend.api.entity.PeliculaEntity;

public interface PeliculaRepository extends JpaRepository<PeliculaEntity, Long>{

     /**
     * Busca una película por su ID de TMDB
     * @param idTmdb El ID de la película en TMDB
     * @return Optional con la película si existe, vacío si no existe
     */
    Optional<PeliculaEntity> findByIdTmdb(Long idTmdb);
}
