package com.filmdiary.backend.api.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.filmdiary.backend.api.entity.UsuarioEntity;
import com.filmdiary.backend.api.repository.UsuarioRepository;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Cargando usuario por email: {}", username);
        
        UsuarioEntity usuario = usuarioRepo.findByEmail(username)
                .orElseThrow(() -> {
                    log.error("Usuario no encontrado en loadUserByUsername: {}", username);
                    return new UsernameNotFoundException("Usuario no encontrado");
                });

        log.info("Usuario encontrado en loadUserByUsername: {}", usuario.getEmail());
        
        UserDetails userDetails = new User(
                usuario.getEmail(),
                usuario.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(usuario.getRole().name()))
        );
        
        log.info("UserDetails creado para: {}", userDetails.getUsername());
        return userDetails;
    }
}