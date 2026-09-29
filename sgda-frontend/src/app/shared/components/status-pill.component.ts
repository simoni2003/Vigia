import { Component, Input } from '@angular/core';
import { StatusDenuncia, STATUS_LABEL } from '../../core/models/denuncia.model';

@Component({
  selector: 'vigia-status-pill',
  standalone: true,
  template: `<span class="selo" [class]="'selo--' + status.toLowerCase()">{{ label }}</span>`,
  styles: [`
    .selo--recebida        { background: var(--cor-vermelho-fundo-2); color: var(--cor-vermelho-escuro); }
    .selo--em_analise      { background: var(--cor-alerta-fundo);      color: var(--cor-alerta); }
    .selo--em_investigacao { background: var(--cor-fundo-alt);         color: var(--cor-texto-suave); border: 1px solid var(--cor-borda-forte); }
    .selo--resolvida       { background: var(--cor-sucesso-fundo);     color: var(--cor-sucesso); }
    .selo--arquivada       { background: var(--cor-fundo-alt);         color: var(--cor-texto-suave); }
  `]
})
export class StatusPillComponent {
  @Input({ required: true }) status!: StatusDenuncia;

  get label(): string {
    return STATUS_LABEL[this.status];
  }
}
