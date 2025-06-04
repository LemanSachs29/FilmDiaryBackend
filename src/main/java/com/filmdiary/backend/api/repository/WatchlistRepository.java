package com.filmdiary.backend.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filmdiary.backend.api.entity.UsuarioWatchlistEntity;
import com.filmdiary.backend.api.entity.UsuarioWatchlistEntityKey;

public interface WatchlistRepository extends JpaRepository<UsuarioWatchlistEntity, UsuarioWatchlistEntityKey>{

}
