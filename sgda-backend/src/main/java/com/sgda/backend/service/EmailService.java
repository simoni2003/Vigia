package com.sgda.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.comite-email}")
    private String comiteEmail;

    @Value("${app.mail.enabled:false}")
    private boolean emailEnabled;

    @Async
    public void enviarConfirmacaoDenuncia(String emailDestino, String protocolo) {
        if (emailDestino == null || emailDestino.isBlank()) return;
        String assunto = "Confirmacao de Denuncia - Protocolo " + protocolo;
        String corpo = "A sua denuncia foi registada com sucesso.\n\n" +
                "Guarde o seu Protocolo Unico para acompanhar o estado do processo: " + protocolo + "\n\n" +
                "Comite de Etica";
        enviar(emailDestino, assunto, corpo);
    }

    @Async
    public void enviarNotificacaoComite(String protocolo) {
        String assunto = "Nova Denuncia Recebida - Protocolo " + protocolo;
        String corpo = "Uma nova denuncia foi submetida no sistema.\n" +
                "Protocolo: " + protocolo + "\n" +
                "Aceda ao Painel de Gestao para mais detalhes.";
        enviar(comiteEmail, assunto, corpo);
    }

    @Async
    public void enviarAtualizacaoStatus(String emailDestino, String protocolo, String novoStatus) {
        if (emailDestino == null || emailDestino.isBlank()) return;
        String assunto = "Atualizacao da sua Denuncia - Protocolo " + protocolo;
        String corpo = "O estado da sua denuncia (Protocolo " + protocolo + ") foi atualizado para: " + novoStatus;
        enviar(emailDestino, assunto, corpo);
    }

    private void enviar(String destino, String assunto, String corpo) {
        if (!emailEnabled) {
            log.info("[EMAIL DESATIVADO] Para: {} | Assunto: {} | Corpo: {}", destino, assunto, corpo);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(destino);
            message.setSubject(assunto);
            message.setText(corpo);
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Falha ao enviar email para {}: {}", destino, ex.getMessage());
        }
    }
}
