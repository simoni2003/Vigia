import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../shared/icons/icon.component';
import { StatusPillComponent } from '../../shared/components/status-pill.component';
import { DenunciaService } from '../../core/services/denuncia.service';
import { ProtocoloTracking, rotuloAcao } from '../../core/models/denuncia.model';

@Component({
  selector: 'vigia-rastreio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, StatusPillComponent],
  templateUrl: './rastreio.component.html',
  styleUrl: './rastreio.component.scss'
})
export class RastreioComponent {
  protocolo = '';
  rotulo = rotuloAcao;
  carregando = signal(false);
  erro = signal<string | null>(null);
  resultado = signal<ProtocoloTracking | null>(null);

  constructor(
    private denunciaService: DenunciaService,
    private route: ActivatedRoute
  ) {
    const daRota = this.route.snapshot.paramMap.get('protocolo');
    if (daRota) {
      this.protocolo = daRota;
      this.consultar();
    }
  }

  consultar(): void {
    if (!this.protocolo.trim()) return;

    this.erro.set(null);
    this.resultado.set(null);
    this.carregando.set(true);

    this.denunciaService.rastrear(this.protocolo.trim()).subscribe({
      next: (dados) => {
        this.resultado.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não encontrámos nenhuma denúncia com este protocolo.');
        this.carregando.set(false);
      }
    });
  }
}
