package com.sgda.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_mensagens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "denuncia_id", nullable = false)
    private Denuncia denuncia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RemetenteChat remetente;

    /** Preenchido quando o remetente e do lado do Comite. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Builder.Default
    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private boolean lida = false;
}
