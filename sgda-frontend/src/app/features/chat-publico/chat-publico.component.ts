import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icons/icon.component';
import { ChatPanelComponent } from '../../shared/components/chat-panel.component';
import { DenunciaService } from '../../core/services/denuncia.service';

@Component({
  selector: 'vigia-chat-publico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, ChatPanelComponent],
  templateUrl: './chat-publico.component.html',
  styleUrl: './chat-publico.component.scss'
})
export class ChatPublicoComponent {
  protocolo = '';
  ativo = signal<string | null>(null);
  erro = signal<string | null>(null);
  a_verificar = signal(false);

  constructor(private denunciaService: DenunciaService, private route: ActivatedRoute) {
    const daRota = this.route.snapshot.paramMap.get('protocolo');
    if (daRota) {
      this.protocolo = daRota;
      this.abrir();
    }
  }

  abrir(): void {
    const p = this.protocolo.trim();
    if (!p) return;

    this.erro.set(null);
    this.a_verificar.set(true);

    // Confirma que o protocolo existe antes de abrir a conversa
    this.denunciaService.rastrear(p).subscribe({
      next: () => {
        this.ativo.set(p);
        this.a_verificar.set(false);
      },
      error: () => {
        this.erro.set('Não encontrámos nenhuma denúncia com este protocolo.');
        this.a_verificar.set(false);
      }
    });
  }

  trocar(): void {
    this.ativo.set(null);
    this.protocolo = '';
  }
}
