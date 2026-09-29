package com.sgda.backend.config;

import com.sgda.backend.entity.Role;
import com.sgda.backend.entity.Usuario;
import com.sgda.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria um utilizador Admin por defeito no primeiro arranque, para permitir
 * o login inicial e a criacao dos restantes utilizadores (Gestor/Investigador)
 * atraves da API.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.nome}")
    private String adminNome;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.senha}")
    private String adminSenha;

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByEmail(adminEmail)) {
            return;
        }

        Usuario admin = Usuario.builder()
                .nome(adminNome)
                .email(adminEmail)
                .senhaHash(passwordEncoder.encode(adminSenha))
                .role(Role.ADMIN)
                .ativo(true)
                .build();

        usuarioRepository.save(admin);
        log.info("Utilizador Admin criado -> email: {} | senha inicial: {}", adminEmail, adminSenha);
    }
}
