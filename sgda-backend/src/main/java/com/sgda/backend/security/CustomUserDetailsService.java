package com.sgda.backend.security;

import com.sgda.backend.entity.Usuario;
import com.sgda.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilizador nao encontrado: " + email));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenhaHash())
                .disabled(!usuario.isAtivo())
                .authorities(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().name()))
                .build();
    }
}
