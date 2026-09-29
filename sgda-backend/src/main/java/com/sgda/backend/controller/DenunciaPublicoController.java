package com.sgda.backend.controller;

import com.sgda.backend.dto.DenunciaRequest;
import com.sgda.backend.dto.DenunciaResponse;
import com.sgda.backend.dto.ProtocoloTrackingResponse;
import com.sgda.backend.service.DenunciaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints publicos do Portal do Denunciante.
 * Nota: em producao, o endpoint de submissao deve ainda ser protegido por
 * reCAPTCHA/rate-limiting antes de chegar aqui (ex: filtro dedicado ou WAF).
 */
@RestController
@RequestMapping("/api/denuncias")
@RequiredArgsConstructor
@Tag(name = "Portal do Denunciante (Publico)")
public class DenunciaPublicoController {

    private final DenunciaService denunciaService;

    @PostMapping("/publico")
    public ResponseEntity<DenunciaResponse> criar(@Valid @RequestBody DenunciaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(denunciaService.criarDenuncia(request));
    }

    @GetMapping("/rastreio/{protocolo}")
    public ResponseEntity<ProtocoloTrackingResponse> rastrear(@PathVariable String protocolo) {
        return ResponseEntity.ok(denunciaService.rastrear(protocolo));
    }
}
