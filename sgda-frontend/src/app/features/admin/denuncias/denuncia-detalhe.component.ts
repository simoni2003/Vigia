import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/icons/icon.component';
import { StatusPillComponent } from '../../../shared/components/status-pill.component';
import { ChatPanelComponent } from '../../../shared/components/chat-panel.component';
import { DenunciaService } from '../../../core/services/denuncia.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Denuncia, HistoricoDetalhe, StatusDenuncia, STATUS_LABEL, rotuloAcao
} from '../../../core/models/denuncia.model';
import { UsuarioGestao } from '../../../core/models/usuario.model';

interface Aviso { tipo: 'ok' | 'erro'; texto: string; }

@Component({
  selector: 'vigia-denuncia-detalhe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, StatusPillComponent, ChatPanelComponent],
  templateUrl: './denuncia-detalhe.component.html',
  styleUrl: './denuncia-detalhe.component.scss'
})
export class DenunciaDetalheComponent implements OnInit {
  denuncia = signal<Denuncia | null>(null);
  historico = signal<HistoricoDetalhe[]>([]);
  investigadores = signal<UsuarioGestao[]>([]);
  naoEncontrada = signal(false);
  aGuardar = signal(false);
  aviso = signal<Aviso | null>(null);

  novoEstado: StatusDenuncia = 'RECEBIDA';
  observacao = '';
  investigadorId: number | null = null;

  estados = (Object.keys(STATUS_LABEL) as StatusDenuncia[]).map((valor) => ({ valor, label: STATUS_LABEL[valor] }));
  rotulo = rotuloAcao;

  constructor(
    private route: ActivatedRoute,
    private denunciaService: DenunciaService,
    private usuarioService: UsuarioService,
    private auth: AuthService
  ) {}

  get id(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  podeAtribuir(): boolean {
    const role = this.auth.usuario()?.role;
    return role === 'ADMIN' || role === 'GESTOR';
  }

  ngOnInit(): void {
    this.carregar();
    if (this.podeAtribuir()) {
      this.usuarioService.investigadores().subscribe((lista) => this.investigadores.set(lista));
    }
  }

  atualizarEstado(): void {
    this.aGuardar.set(true);
    this.aviso.set(null);
    this.denunciaService.atualizarStatus(this.id, this.novoEstado, this.observacao.trim() || undefined).subscribe({
      next: (d) => {
        this.denuncia.set(d);
        this.observacao = '';
        this.aGuardar.set(false);
        this.aviso.set({ tipo: 'ok', texto: 'Estado atualizado.' });
        this.recarregarHistorico();
      },
      error: () => {
        this.aGuardar.set(false);
        this.aviso.set({ tipo: 'erro', texto: 'Não foi possível atualizar o estado.' });
      }
    });
  }

  atribuir(): void {
    if (this.investigadorId === null) return;
    this.aGuardar.set(true);
    this.aviso.set(null);
    this.denunciaService.atribuirInvestigador(this.id, this.investigadorId).subscribe({
      next: (d) => {
        this.denuncia.set(d);
        this.aGuardar.set(false);
        this.aviso.set({ tipo: 'ok', texto: 'Investigador atribuído.' });
        this.recarregarHistorico();
      },
      error: () => {
        this.aGuardar.set(false);
        this.aviso.set({ tipo: 'erro', texto: 'Não foi possível atribuir o investigador.' });
      }
    });
  }

  private carregar(): void {
    this.denunciaService.buscar(this.id).subscribe({
      next: (d) => {
        this.denuncia.set(d);
        this.novoEstado = d.status;
      },
      error: () => this.naoEncontrada.set(true)
    });
    this.recarregarHistorico();
  }

  private recarregarHistorico(): void {
    this.denunciaService.historico(this.id).subscribe((h) => this.historico.set(h));
  }
}
