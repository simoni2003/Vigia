package com.sgda.backend.dto;

import com.sgda.backend.entity.RemetenteChat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ChatMensagemResponse {
    private Long id;
    private RemetenteChat remetente;
    private String conteudo;
    private LocalDateTime dataEnvio;
}
