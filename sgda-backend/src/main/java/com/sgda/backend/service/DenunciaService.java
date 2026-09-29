package com.sgda.backend.service;

import com.sgda.backend.dto.*;
import com.sgda.backend.entity.*;
import com.sgda.backend.exception.ResourceNotFoundException;
import com.sgda.backend.repository.DenunciaRepository;
import com.sgda.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DenunciaService {

    private final DenunciaRepository denunciaRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistoricoAcaoService historicoAcaoService;
    private final EmailService emailService;

    @Transactional
    public DenunciaResponse criarDenuncia(DenunciaRequest request) {
        Denuncia denuncia = Denuncia.builder()
                .descricao(request.getDescricao())
                .anonima(request.isAnonima())
                .emailDenunciante(request.isAnonima() ? null : request.getEmailDenunciante())
                .anexoUrl(request.getAnexoUrl())
                .build();

        denuncia = denunciaRepository.save(denuncia);

        historicoAcaoService.registrar(denuncia, null, "DENUNCIA_CRIADA",
                "Denuncia submetida atraves do Portal do Denunciante");

        emailService.enviarConfirmacaoDenuncia(denuncia.getEmailDenunciante(), denuncia.getProtocolo());
        emailService.enviarNotificacaoComite(denuncia.getProtocolo());

        return toResponse(denuncia);
    }

    @Transactional(readOnly = true)
    public ProtocoloTrackingResponse rastrear(String protocolo) {
        Denuncia denuncia = buscarPorProtocolo(protocolo);

        List<ProtocoloTrackingResponse.HistoricoItem> historico = historicoAcaoService
                .listarPorDenuncia(denuncia.getId())
                .stream()
                .map(h -> ProtocoloTrackingResponse.HistoricoItem.builder()
                        .acao(h.getAcao())
                        .dataHora(h.getDataHora())
                        .build())
                .collect(Collectors.toList());

        return ProtocoloTrackingResponse.builder()
                .protocolo(denuncia.getProtocolo())
                .status(denuncia.getStatus())
                .dataCriacao(denuncia.getDataCriacao())
                .historico(historico)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DenunciaResponse> listarTodas(StatusDenuncia status) {
        List<Denuncia> denuncias = (status != null)
                ? denunciaRepository.findByStatus(status)
                : denunciaRepository.findAll();

        return denuncias.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DenunciaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidadePorId(id));
    }

    @Transactional
    public DenunciaResponse atualizarStatus(Long id, DenunciaStatusUpdateRequest request, Usuario usuarioLogado) {
        Denuncia denuncia = buscarEntidadePorId(id);
        denuncia.setStatus(request.getStatus());
        denuncia = denunciaRepository.save(denuncia);

        String detalhes = "Status alterado para " + request.getStatus()
                + (request.getObservacao() != null ? " - Obs: " + request.getObservacao() : "");
        historicoAcaoService.registrar(denuncia, usuarioLogado, "STATUS_ATUALIZADO", detalhes);

        if (!denuncia.isAnonima()) {
            emailService.enviarAtualizacaoStatus(denuncia.getEmailDenunciante(), denuncia.getProtocolo(),
                    request.getStatus().name());
        }

        return toResponse(denuncia);
    }

    @Transactional
    public DenunciaResponse atribuirInvestigador(Long id, Long investigadorId, Usuario usuarioLogado) {
        Denuncia denuncia = buscarEntidadePorId(id);
        Usuario investigador = usuarioRepository.findById(investigadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Investigador nao encontrado: " + investigadorId));

        denuncia.setInvestigadorResponsavel(investigador);
        denuncia = denunciaRepository.save(denuncia);

        historicoAcaoService.registrar(denuncia, usuarioLogado, "INVESTIGADOR_ATRIBUIDO",
                "Investigador atribuido: " + investigador.getNome());

        return toResponse(denuncia);
    }

    @Transactional(readOnly = true)
    public List<HistoricoAcaoResponse> listarHistorico(Long id) {
        Denuncia denuncia = buscarEntidadePorId(id);
        return historicoAcaoService.listarPorDenuncia(denuncia.getId()).stream()
                .map(h -> HistoricoAcaoResponse.builder()
                        .id(h.getId())
                        .acao(h.getAcao())
                        .detalhes(h.getDetalhes())
                        .usuario(h.getUsuario() != null ? h.getUsuario().getNome() : null)
                        .dataHora(h.getDataHora())
                        .build())
                .collect(Collectors.toList());
    }

    Denuncia buscarEntidadePorId(Long id) {
        return denunciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Denuncia nao encontrada: " + id));
    }

    Denuncia buscarPorProtocolo(String protocolo) {
        return denunciaRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException("Protocolo nao encontrado: " + protocolo));
    }

    private DenunciaResponse toResponse(Denuncia denuncia) {
        return DenunciaResponse.builder()
                .id(denuncia.getId())
                .protocolo(denuncia.getProtocolo())
                .descricao(denuncia.getDescricao())
                .status(denuncia.getStatus())
                .anonima(denuncia.isAnonima())
                .anexoUrl(denuncia.getAnexoUrl())
                .dataCriacao(denuncia.getDataCriacao())
                .investigadorResponsavel(denuncia.getInvestigadorResponsavel() != null
                        ? denuncia.getInvestigadorResponsavel().getNome() : null)
                .build();
    }
}
