package com.filmdiary.backend.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filmdiary.backend.api.entity.PeliculaEntity;

public interface PeliculaRepository extends JpaRepository<PeliculaEntity, Long>{

}
