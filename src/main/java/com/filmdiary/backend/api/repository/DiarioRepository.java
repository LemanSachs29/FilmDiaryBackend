package com.filmdiary.backend.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filmdiary.backend.api.entity.UsuarioDiarioEntity;

public interface DiarioRepository extends JpaRepository<UsuarioDiarioEntity, Long>{

    List<UsuarioDiarioEntity> findByUsuarioId(Long usuarioId);
    
    List<UsuarioDiarioEntity> findByUsuarioIdAndPeliculaId(Long usuarioId, Long peliculaId);
    
    List<UsuarioDiarioEntity> findByUsuarioIdOrderByFechaVistaDesc(Long usuarioId);

}
