import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/icons/icon.component';
import { StatusPillComponent } from '../../../shared/components/status-pill.component';
import { ChatPanelComponent } from '../../../shared/components/chat-panel.component';
import { DenunciaService } from '../../../core/services/denuncia.service';
import { Denuncia } from '../../../core/models/denuncia.model';

@Component({
  selector: 'vigia-mensagens',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, StatusPillComponent, ChatPanelComponent],
  templateUrl: './mensagens.component.html',
  styleUrl: './mensagens.component.scss'
})
export class MensagensComponent implements OnInit {
  casos = signal<Denuncia[]>([]);
  selecionada = signal<Denuncia | null>(null);
  carregando = signal(true);

  constructor(private denunciaService: DenunciaService) {}

  ngOnInit(): void {
    this.denunciaService.listar().subscribe({
      next: (lista) => {
        this.casos.set([...lista].sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao)));
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  escolher(d: Denuncia): void {
    this.selecionada.set(d);
  }
}
