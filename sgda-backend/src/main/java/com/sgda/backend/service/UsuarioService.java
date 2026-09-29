package com.sgda.backend.service;

import com.sgda.backend.dto.UsuarioRequest;
import com.sgda.backend.dto.UsuarioResponse;
import com.sgda.backend.entity.Role;
import com.sgda.backend.entity.Usuario;
import com.sgda.backend.exception.BusinessException;
import com.sgda.backend.exception.ResourceNotFoundException;
import com.sgda.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ja existe um utilizador com este email");
        }
        if (request.getSenha() == null || request.getSenha().isBlank()) {
            throw new BusinessException("A senha e obrigatoria na criacao do utilizador");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .role(request.getRole())
                .ativo(true)
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarInvestigadores() {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.isAtivo() && u.getRole() == Role.INVESTIGADOR)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = buscarEntidade(id);
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setRole(request.getRole());
        if (request.getSenha() != null && !request.getSenha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(request.getSenha()));
        }
        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void desativar(Long id) {
        Usuario usuario = buscarEntidade(id);
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    private Usuario buscarEntidade(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador nao encontrado: " + id));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .ativo(usuario.isAtivo())
                .build();
    }
}
