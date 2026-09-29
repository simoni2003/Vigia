package com.sgda.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class DashboardResponse {
    private long totalDenuncias;
    private Map<String, Long> contadorPorStatus;
}
