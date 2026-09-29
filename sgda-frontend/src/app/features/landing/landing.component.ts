import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icons/icon.component';
import { DenunciaService } from '../../core/services/denuncia.service';
import { Denuncia, DenunciaRequest } from '../../core/models/denuncia.model';

@Component({
  selector: 'vigia-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  form: DenunciaRequest = { descricao: '', anonima: true, emailDenunciante: '' };

  enviando = signal(false);
  erro = signal<string | null>(null);
  resultado = signal<Denuncia | null>(null);

  constructor(private denunciaService: DenunciaService) {}

  submeter(): void {
    this.erro.set(null);

    if (this.form.descricao.trim().length < 10) {
      this.erro.set('Descreve a situação com um pouco mais de detalhe antes de submeteres.');
      return;
    }
    if (!this.form.anonima && !this.form.emailDenunciante) {
      this.erro.set('Indica um email para receberes atualizações, ou submete de forma anónima.');
      return;
    }

    this.enviando.set(true);
    const payload: DenunciaRequest = {
      descricao: this.form.descricao,
      anonima: this.form.anonima,
      emailDenunciante: this.form.anonima ? undefined : this.form.emailDenunciante
    };

    this.denunciaService.criar(payload).subscribe({
      next: (denuncia) => {
        this.resultado.set(denuncia);
        this.enviando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível submeter a denúncia agora. Tenta novamente em instantes.');
        this.enviando.set(false);
      }
    });
  }

  novaDenuncia(): void {
    this.resultado.set(null);
    this.form = { descricao: '', anonima: true, emailDenunciante: '' };
  }
}
