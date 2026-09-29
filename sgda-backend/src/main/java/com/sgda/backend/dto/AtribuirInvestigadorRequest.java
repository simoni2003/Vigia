package com.sgda.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtribuirInvestigadorRequest {
    @NotNull
    private Long investigadorId;
}
