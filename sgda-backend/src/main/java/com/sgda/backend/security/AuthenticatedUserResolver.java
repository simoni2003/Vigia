package com.sgda.backend.security;

import com.sgda.backend.entity.Usuario;
import com.sgda.backend.exception.ResourceNotFoundException;
import com.sgda.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * O principal guardado no contexto de seguranca e um UserDetails do Spring
 * (apenas email/roles). Este resolvedor converte-o na entidade Usuario
 * completa quando os controllers precisam de registar quem realizou uma acao.
 */
@Component
@RequiredArgsConstructor
public class AuthenticatedUserResolver {

    private final UsuarioRepository usuarioRepository;

    public Usuario resolver(Authentication authentication) {
        String email = authentication.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador autenticado nao encontrado: " + email));
    }
}
