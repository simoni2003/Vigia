package com.sgda.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "denuncias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Denuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(nullable = false, unique = true, updatable = false)
    private String protocolo = UUID.randomUUID().toString();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Builder.Default
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private StatusDenuncia status = StatusDenuncia.RECEBIDA;

    @Builder.Default
    @Column(nullable = false)
    private boolean anonima = true;

    /** Apenas preenchido quando a denuncia nao e anonima; usado para notificacoes de status. */
    @Column(name = "email_denunciante")
    private String emailDenunciante;

    @Column(name = "anexo_url")
    private String anexoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigador_id")
    private Usuario investigadorResponsavel;

    @Builder.Default
    @OneToMany(mappedBy = "denuncia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoricoAcao> historico = new ArrayList<>();
}
