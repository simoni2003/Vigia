package com.sgda.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historico_acoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricoAcao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "denuncia_id", nullable = false)
    private Denuncia denuncia;

    /** Nulo quando a acao e realizada pelo sistema ou pelo proprio denunciante. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false)
    private String acao;

    @Column(columnDefinition = "TEXT")
    private String detalhes;

    @Builder.Default
    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();
}
