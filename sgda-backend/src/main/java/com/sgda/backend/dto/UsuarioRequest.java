package com.sgda.backend.dto;

import com.sgda.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRequest {
    @NotBlank
    private String nome;

    @NotBlank @Email
    private String email;

    /** Obrigatorio na criacao; opcional na edicao (mantem a senha atual se vazio) */
    private String senha;

    @NotNull
    private Role role;
}
