package com.sgda.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMensagemRequest {
    @NotBlank
    private String conteudo;
}
