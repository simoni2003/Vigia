package com.sgda.backend.dto;

import com.sgda.backend.entity.StatusDenuncia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProtocoloTrackingResponse {
    private String protocolo;
    private StatusDenuncia status;
    private LocalDateTime dataCriacao;
    private List<HistoricoItem> historico;

    @Data
    @Builder
    @AllArgsConstructor
    public static class HistoricoItem {
        private String acao;
        private LocalDateTime dataHora;
    }
}
