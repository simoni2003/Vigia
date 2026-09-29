package com.sgda.backend.controller;

import com.sgda.backend.dto.DashboardResponse;
import com.sgda.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gestao/dashboard")
@RequiredArgsConstructor
@Tag(name = "Painel de Gestao - Dashboard (Restrito)")
@PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(dashboardService.gerarDashboard());
    }
}
