package com.sgda.backend.repository;

import com.sgda.backend.entity.Denuncia;
import com.sgda.backend.entity.StatusDenuncia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {
    Optional<Denuncia> findByProtocolo(String protocolo);
    List<Denuncia> findByStatus(StatusDenuncia status);
    long countByStatus(StatusDenuncia status);
}
