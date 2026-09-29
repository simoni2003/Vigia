package com.sgda.backend.repository;

import com.sgda.backend.entity.HistoricoAcao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoAcaoRepository extends JpaRepository<HistoricoAcao, Long> {
    List<HistoricoAcao> findByDenunciaIdOrderByDataHoraAsc(Long denunciaId);
}
