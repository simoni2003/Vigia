import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/icons/icon.component';
import { StatusPillComponent } from '../../../shared/components/status-pill.component';
import { DenunciaService } from '../../../core/services/denuncia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Denuncia, DashboardResumo, StatusDenuncia, STATUS_LABEL } from '../../../core/models/denuncia.model';

interface FatiaDistribuicao {
  status: StatusDenuncia;
  label: string;
  total: number;
  percentagem: number;
}

@Component({
  selector: 'vigia-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, StatusPillComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  resumo = signal<DashboardResumo | null>(null);
  denuncias = signal<Denuncia[]>([]);
  carregando = signal(true);

  distribuicao = computed<FatiaDistribuicao[]>(() => {
    const r = this.resumo();
    if (!r || r.totalDenuncias === 0) return [];

    return (Object.keys(r.contadorPorStatus) as StatusDenuncia[])
      .map((status) => ({
        status,
        label: STATUS_LABEL[status],
        total: r.contadorPorStatus[status],
        percentagem: Math.round((r.contadorPorStatus[status] / r.totalDenuncias) * 100)
      }))
      .filter((f) => f.total > 0);
  });

  constructor(
    private denunciaService: DenunciaService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.denunciaService.listar().subscribe({
      next: (lista) => {
        const ordenada = [...lista].sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao));
        this.denuncias.set(ordenada.slice(0, 6));
        this.carregando.set(false);
        this.carregarResumo(lista);
      },
      error: () => this.carregando.set(false)
    });
  }

  /** O endpoint de dashboard é só para Admin/Gestor; o Investigador vê o resumo calculado da lista. */
  private carregarResumo(lista: Denuncia[]): void {
    if (this.auth.usuario()?.role === 'INVESTIGADOR') {
      this.resumo.set(this.resumoLocal(lista));
      return;
    }
    this.denunciaService.dashboard().subscribe({
      next: (r) => this.resumo.set(r),
      error: () => this.resumo.set(this.resumoLocal(lista))
    });
  }

  private resumoLocal(lista: Denuncia[]): DashboardResumo {
    const contador: Record<StatusDenuncia, number> = {
      RECEBIDA: 0, EM_ANALISE: 0, EM_INVESTIGACAO: 0, RESOLVIDA: 0, ARQUIVADA: 0
    };
    lista.forEach((d) => contador[d.status]++);
    return { totalDenuncias: lista.length, contadorPorStatus: contador };
  }

  primeiroNome(): string {
    const nome = this.auth.usuario()?.nome ?? '';
    return nome.split(' ')[0] || nome;
  }
}
