package com.sgda.backend.service;

import com.sgda.backend.entity.Denuncia;
import com.sgda.backend.entity.HistoricoAcao;
import com.sgda.backend.entity.Usuario;
import com.sgda.backend.repository.HistoricoAcaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoAcaoService {

    private final HistoricoAcaoRepository historicoAcaoRepository;

    public HistoricoAcao registrar(Denuncia denuncia, Usuario usuario, String acao, String detalhes) {
        HistoricoAcao historico = HistoricoAcao.builder()
                .denuncia(denuncia)
                .usuario(usuario)
                .acao(acao)
                .detalhes(detalhes)
                .build();
        return historicoAcaoRepository.save(historico);
    }

    public List<HistoricoAcao> listarPorDenuncia(Long denunciaId) {
        return historicoAcaoRepository.findByDenunciaIdOrderByDataHoraAsc(denunciaId);
    }
}
