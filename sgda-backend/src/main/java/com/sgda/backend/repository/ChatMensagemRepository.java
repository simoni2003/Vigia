package com.sgda.backend.repository;

import com.sgda.backend.entity.ChatMensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMensagemRepository extends JpaRepository<ChatMensagem, Long> {
    List<ChatMensagem> findByDenunciaIdOrderByDataEnvioAsc(Long denunciaId);
}
