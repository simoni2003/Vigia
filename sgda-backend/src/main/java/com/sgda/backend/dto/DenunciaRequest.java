package com.sgda.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DenunciaRequest {

    @NotBlank(message = "A descricao da denuncia e obrigatoria")
    private String descricao;

    private boolean anonima = true;

    /** Obrigatorio apenas se anonima = false */
    @Email
    private String emailDenunciante;

    private String anexoUrl;
}
