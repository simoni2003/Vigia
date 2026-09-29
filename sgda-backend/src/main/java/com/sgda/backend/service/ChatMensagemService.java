package com.sgda.backend.service;

import com.sgda.backend.dto.ChatMensagemResponse;
import com.sgda.backend.entity.ChatMensagem;
import com.sgda.backend.entity.Denuncia;
import com.sgda.backend.entity.RemetenteChat;
import com.sgda.backend.entity.Usuario;
import com.sgda.backend.exception.ResourceNotFoundException;
import com.sgda.backend.repository.ChatMensagemRepository;
import com.sgda.backend.repository.DenunciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMensagemService {

    private final ChatMensagemRepository chatMensagemRepository;
    private final DenunciaRepository denunciaRepository;
    private final HistoricoAcaoService historicoAcaoService;

    @Transactional
    public ChatMensagemResponse enviarComoDenunciante(String protocolo, String conteudo) {
        Denuncia denuncia = denunciaRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException("Protocolo nao encontrado: " + protocolo));

        ChatMensagem mensagem = ChatMensagem.builder()
                .denuncia(denuncia)
                .remetente(RemetenteChat.DENUNCIANTE)
                .conteudo(conteudo)
                .build();
        mensagem = chatMensagemRepository.save(mensagem);

        historicoAcaoService.registrar(denuncia, null, "MENSAGEM_CHAT",
                "Nova mensagem do denunciante no chat seguro");

        return toResponse(mensagem);
    }

    @Transactional
    public ChatMensagemResponse enviarComoComite(Long denunciaId, Usuario usuario, String conteudo) {
        Denuncia denuncia = denunciaRepository.findById(denunciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Denuncia nao encontrada: " + denunciaId));

        ChatMensagem mensagem = ChatMensagem.builder()
                .denuncia(denuncia)
                .remetente(RemetenteChat.COMITE)
                .usuario(usuario)
                .conteudo(conteudo)
                .build();
        mensagem = chatMensagemRepository.save(mensagem);

        historicoAcaoService.registrar(denuncia, usuario, "MENSAGEM_CHAT",
                "Nova mensagem do Comite no chat seguro");

        return toResponse(mensagem);
    }

    @Transactional(readOnly = true)
    public List<ChatMensagemResponse> listarPorProtocolo(String protocolo) {
        Denuncia denuncia = denunciaRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException("Protocolo nao encontrado: " + protocolo));
        return listarPorDenunciaId(denuncia.getId());
    }

    @Transactional(readOnly = true)
    public List<ChatMensagemResponse> listarPorDenunciaId(Long denunciaId) {
        return chatMensagemRepository.findByDenunciaIdOrderByDataEnvioAsc(denunciaId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ChatMensagemResponse toResponse(ChatMensagem mensagem) {
        return ChatMensagemResponse.builder()
                .id(mensagem.getId())
                .remetente(mensagem.getRemetente())
                .conteudo(mensagem.getConteudo())
                .dataEnvio(mensagem.getDataEnvio())
                .build();
    }
}
