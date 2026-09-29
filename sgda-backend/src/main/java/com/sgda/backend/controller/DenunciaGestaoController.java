package com.sgda.backend.controller;

import com.sgda.backend.dto.*;
import com.sgda.backend.entity.StatusDenuncia;
import com.sgda.backend.entity.Usuario;
import com.sgda.backend.security.AuthenticatedUserResolver;
import com.sgda.backend.service.DenunciaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gestao/denuncias")
@RequiredArgsConstructor
@Tag(name = "Painel de Gestao - Denuncias (Restrito)")
@PreAuthorize("hasAnyRole('ADMIN','GESTOR','INVESTIGADOR')")
public class DenunciaGestaoController {

    private final DenunciaService denunciaService;
    private final AuthenticatedUserResolver authenticatedUserResolver;

    @GetMapping
    public ResponseEntity<List<DenunciaResponse>> listar(
            @RequestParam(required = false) StatusDenuncia status) {
        return ResponseEntity.ok(denunciaService.listarTodas(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DenunciaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(denunciaService.buscarPorId(id));
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoAcaoResponse>> historico(@PathVariable Long id) {
        return ResponseEntity.ok(denunciaService.listarHistorico(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INVESTIGADOR')")
    public ResponseEntity<DenunciaResponse> atualizarStatus(@PathVariable Long id,
                                                             @Valid @RequestBody DenunciaStatusUpdateRequest request,
                                                             Authentication authentication) {
        Usuario usuario = authenticatedUserResolver.resolver(authentication);
        return ResponseEntity.ok(denunciaService.atualizarStatus(id, request, usuario));
    }

    @PutMapping("/{id}/investigador")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<DenunciaResponse> atribuirInvestigador(@PathVariable Long id,
                                                                  @Valid @RequestBody AtribuirInvestigadorRequest request,
                                                                  Authentication authentication) {
        Usuario usuario = authenticatedUserResolver.resolver(authentication);
        return ResponseEntity.ok(denunciaService.atribuirInvestigador(id, request.getInvestigadorId(), usuario));
    }
}
