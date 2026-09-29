package com.sgda.backend.controller;

import com.sgda.backend.dto.ChatMensagemRequest;
import com.sgda.backend.dto.ChatMensagemResponse;
import com.sgda.backend.entity.Usuario;
import com.sgda.backend.security.AuthenticatedUserResolver;
import com.sgda.backend.service.ChatMensagemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Chat Seguro entre o Comite e o Denunciante.
 * Lado publico: acesso apenas com o Protocolo Unico (sem autenticacao JWT).
 * Lado do Comite: acesso restrito, identificado pela denuncia.
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "Chat Seguro")
public class ChatController {

    private final ChatMensagemService chatMensagemService;
    private final AuthenticatedUserResolver authenticatedUserResolver;

    @PostMapping("/publico/{protocolo}")
    public ResponseEntity<ChatMensagemResponse> enviarComoDenunciante(@PathVariable String protocolo,
                                                                       @Valid @RequestBody ChatMensagemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatMensagemService.enviarComoDenunciante(protocolo, request.getConteudo()));
    }

    @GetMapping("/publico/{protocolo}")
    public ResponseEntity<List<ChatMensagemResponse>> listarComoDenunciante(@PathVariable String protocolo) {
        return ResponseEntity.ok(chatMensagemService.listarPorProtocolo(protocolo));
    }

    @PostMapping("/gestao/{denunciaId}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INVESTIGADOR')")
    public ResponseEntity<ChatMensagemResponse> enviarComoComite(@PathVariable Long denunciaId,
                                                                  @Valid @RequestBody ChatMensagemRequest request,
                                                                  Authentication authentication) {
        Usuario usuario = authenticatedUserResolver.resolver(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatMensagemService.enviarComoComite(denunciaId, usuario, request.getConteudo()));
    }

    @GetMapping("/gestao/{denunciaId}")
    @PreAuthorize("hasAnyRole('ADMIN','GESTOR','INVESTIGADOR')")
    public ResponseEntity<List<ChatMensagemResponse>> listarComoComite(@PathVariable Long denunciaId) {
        return ResponseEntity.ok(chatMensagemService.listarPorDenunciaId(denunciaId));
    }
}
