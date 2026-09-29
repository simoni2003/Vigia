import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/icons/icon.component';
import { StatusPillComponent } from '../../../shared/components/status-pill.component';
import { DenunciaService } from '../../../core/services/denuncia.service';
import { Denuncia, StatusDenuncia, STATUS_LABEL } from '../../../core/models/denuncia.model';

@Component({
  selector: 'vigia-denuncias-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, StatusPillComponent],
  templateUrl: './denuncias-lista.component.html',
  styleUrl: './denuncias-lista.component.scss'
})
export class DenunciasListaComponent implements OnInit {
  todas = signal<Denuncia[]>([]);
  carregando = signal(true);
  erro = signal(false);
  busca = signal('');
  filtroStatus = signal<StatusDenuncia | ''>('');

  estados = (Object.keys(STATUS_LABEL) as StatusDenuncia[]).map((valor) => ({ valor, label: STATUS_LABEL[valor] }));

  filtradas = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const estado = this.filtroStatus();
    return this.todas().filter((d) =>
      (!estado || d.status === estado) && (!termo || d.protocolo.toLowerCase().includes(termo))
    );
  });

  constructor(private denunciaService: DenunciaService, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((p) => this.busca.set(p.get('q') ?? ''));
  }

  ngOnInit(): void {
    this.denunciaService.listar().subscribe({
      next: (lista) => {
        this.todas.set([...lista].sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao)));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      }
    });
  }
}
