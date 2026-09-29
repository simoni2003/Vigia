package com.sgda.backend.dto;

import com.sgda.backend.entity.StatusDenuncia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class DenunciaResponse {
    private Long id;
    private String protocolo;
    private String descricao;
    private StatusDenuncia status;
    private boolean anonima;
    private String anexoUrl;
    private LocalDateTime dataCriacao;
    private String investigadorResponsavel;
}
