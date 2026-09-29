import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

/**
 * Conjunto mínimo de ícones desenhados à mão para o Vigia — traço fino
 * consistente, cantos ligeiramente arredondados, sem recorrer a um pacote
 * de ícones genérico (Feather/Heroicons/Material), para manter uma
 * identidade visual própria.
 */
@Component({
  selector: 'vigia-icon',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  template: `
    <svg [attr.width]="tamanho" [attr.height]="tamanho" viewBox="0 0 24 24" fill="none"
         [attr.stroke]="cor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <ng-container [ngSwitch]="nome">

        <!-- brasão / selo (marca Vigia) -->
        <path *ngSwitchCase="'selo'" d="M12 2 3 6v6c0 5.2 3.8 9.7 9 11 5.2-1.3 9-5.8 9-11V6l-9-4Z" />

        <!-- painel / grelha -->
        <g *ngSwitchCase="'painel'">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
        </g>

        <!-- documento / denúncia -->
        <g *ngSwitchCase="'documento'">
          <path d="M6 3.5h9l3.5 3.5V20a.6.6 0 0 1-.6.6H6.6A.6.6 0 0 1 6 20V3.5Z" />
          <path d="M9 12h6M9 15.5h6M9 8.5h3" />
        </g>

        <!-- pessoas / utilizadores -->
        <g *ngSwitchCase="'pessoas'">
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20c.6-3.6 3-5.5 5.5-5.5s4.9 1.9 5.5 5.5" />
          <circle cx="17.5" cy="7.5" r="2.2" />
          <path d="M14.8 12.2c2.2.1 4 1.8 4.5 4.6" />
        </g>

        <!-- conversa / mensagens -->
        <path *ngSwitchCase="'conversa'" d="M4 5.5h16v10.2H9.8L5.5 19V15.7H4V5.5Z" />

        <!-- sair -->
        <g *ngSwitchCase="'sair'">
          <path d="M13.5 3.5H6.6A.6.6 0 0 0 6 4.1v15.8a.6.6 0 0 0 .6.6h6.9" />
          <path d="M11 12h9.5m0 0-3-3m3 3-3 3" />
        </g>

        <!-- busca -->
        <g *ngSwitchCase="'busca'">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m19.5 19.5-4.3-4.3" />
        </g>

        <!-- sino / notificação -->
        <path *ngSwitchCase="'sino'" d="M12 3.5c-2.6 0-4 2-4 5v3.2c0 1-.4 1.8-1.1 2.6L6 15.5h12l-.9-1.2c-.7-.8-1.1-1.6-1.1-2.6V8.5c0-3-1.4-5-4-5ZM10 18.5a2 2 0 0 0 4 0" />

        <!-- escudo com marca de verificação (confidencialidade) -->
        <g *ngSwitchCase="'confidencial'">
          <path d="M12 3 5 5.8v5c0 5 3 8.4 7 9.7 4-1.3 7-4.7 7-9.7v-5L12 3Z" />
          <path d="m9.2 12.1 2 2 3.6-4.2" />
        </g>

        <!-- cadeado (encriptação) -->
        <g *ngSwitchCase="'cadeado'">
          <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.4" />
          <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
        </g>

        <!-- relógio (resposta 48h / SLA) -->
        <g *ngSwitchCase="'relogio'">
          <circle cx="12" cy="12.5" r="8" />
          <path d="M12 8v4.7l3.2 2" />
        </g>

        <!-- balança (comité independente) -->
        <g *ngSwitchCase="'balanca'">
          <path d="M12 3.5v16.5M7 20.5h10" />
          <path d="M4 8h6M14 8h6" />
          <path d="M4 8 1.8 13a2.4 2.4 0 0 0 4.5 0L4 8ZM20 8l-2.2 5a2.4 2.4 0 0 0 4.5 0L20 8Z" />
        </g>

        <!-- seta (navegação/expandir) -->
        <path *ngSwitchCase="'seta'" d="M9 6.5 15 12l-6 5.5" />

        <!-- olho (rastreio) -->
        <g *ngSwitchCase="'olho'">
          <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.6" />
        </g>

        <!-- enviar -->
        <path *ngSwitchCase="'enviar'" d="M20.5 3.5 10.2 13.8M20.5 3.5l-6.7 17-3.6-6.7L3.5 10.2l17-6.7Z" />

        <!-- lápis / editar -->
        <g *ngSwitchCase="'lapis'">
          <path d="M4 20l1-4.2L16.3 4.5a1.9 1.9 0 0 1 2.7 0l.5.5a1.9 1.9 0 0 1 0 2.7L8.2 19 4 20Z" />
          <path d="m14.5 6.4 3.1 3.1" />
        </g>

        <!-- mais -->
        <path *ngSwitchCase="'mais'" d="M12 5v14M5 12h14" />

        <!-- fechar -->
        <path *ngSwitchCase="'fechar'" d="m6 6 12 12M18 6 6 18" />

        <!-- voltar -->
        <path *ngSwitchCase="'voltar'" d="M15 6.5 9 12l6 5.5" />

        <!-- clipe / anexo -->
        <path *ngSwitchCase="'clipe'" d="m20 11-8.2 8.2a5 5 0 0 1-7.1-7.1L13 3.8a3.4 3.4 0 0 1 4.8 4.8l-8.4 8.4a1.8 1.8 0 0 1-2.6-2.6L14.5 7" />

      </ng-container>
    </svg>
  `,
})
export class IconComponent {
  @Input() nome = 'selo';
  @Input() tamanho = 20;
  @Input() cor = 'currentColor';
}
