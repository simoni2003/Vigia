package com.sgda.backend.dto;

import com.sgda.backend.entity.StatusDenuncia;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DenunciaStatusUpdateRequest {
    @NotNull
    private StatusDenuncia status;

    private String observacao;
}
