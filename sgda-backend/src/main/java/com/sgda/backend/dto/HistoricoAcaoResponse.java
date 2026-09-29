package com.sgda.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class HistoricoAcaoResponse {
    private Long id;
    private String acao;
    private String detalhes;
    private String usuario;
    private LocalDateTime dataHora;
}
