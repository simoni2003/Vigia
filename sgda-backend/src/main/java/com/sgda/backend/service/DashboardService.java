package com.sgda.backend.service;

import com.sgda.backend.dto.DashboardResponse;
import com.sgda.backend.entity.StatusDenuncia;
import com.sgda.backend.repository.DenunciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DenunciaRepository denunciaRepository;

    @Transactional(readOnly = true)
    public DashboardResponse gerarDashboard() {
        Map<String, Long> contadorPorStatus = new LinkedHashMap<>();
        for (StatusDenuncia status : StatusDenuncia.values()) {
            contadorPorStatus.put(status.name(), denunciaRepository.countByStatus(status));
        }

        return DashboardResponse.builder()
                .totalDenuncias(denunciaRepository.count())
                .contadorPorStatus(contadorPorStatus)
                .build();
    }
}
