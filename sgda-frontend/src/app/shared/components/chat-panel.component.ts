import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IconComponent } from '../icons/icon.component';
import { ChatService } from '../../core/services/chat.service';
import { ChatMensagem } from '../../core/models/denuncia.model';

/**
 * Chat Seguro. O mesmo componente serve os dois lados da conversa:
 *  - modo "publico": o denunciante, identificado apenas pelo protocolo
 *  - modo "gestao": o Comité, identificado pelo id da denúncia (JWT)
 * Atualiza por polling simples (10s), suficiente para o volume esperado.
 */
@Component({
  selector: 'vigia-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="chat">
      <div class="chat__lista" #lista>
        @if (!mensagens().length) {
          <p class="chat__vazio">
            {{ modo === 'publico'
                ? 'Ainda não há mensagens. Podes escrever a primeira ao Comité.'
                : 'Ainda não há mensagens neste caso.' }}
          </p>
        }
        @for (m of mensagens(); track m.id) {
          <div class="chat__msg" [class.chat__msg--propria]="propria(m)">
            <p class="chat__autor">{{ autor(m) }}</p>
            <div class="chat__bolha">{{ m.conteudo }}</div>
            <span class="chat__hora mono">{{ m.dataEnvio | date:'dd/MM HH:mm' }}</span>
          </div>
        }
      </div>

      @if (erro()) {
        <p class="aviso aviso--erro chat__erro">{{ erro() }}</p>
      }

      <div class="chat__compor">
        <textarea rows="2" [(ngModel)]="texto" placeholder="Escreve uma mensagem… (Ctrl+Enter para enviar)"
                  (keydown.control.enter)="enviar()"></textarea>
        <button class="btn btn-primario" (click)="enviar()" [disabled]="enviando() || !texto.trim()">
          <vigia-icon nome="enviar" [tamanho]="16" cor="#fff" />
          Enviar
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .chat { display: flex; flex-direction: column; height: 100%; min-height: 320px; }
    .chat__lista {
      flex: 1; overflow-y: auto; display: flex; flex-direction: column;
      gap: var(--espaco-4); padding: var(--espaco-5);
    }
    .chat__vazio { color: var(--cor-texto-suave); font-size: 14px; text-align: center; margin: auto; max-width: 30ch; }
    .chat__msg { display: flex; flex-direction: column; align-items: flex-start; max-width: 78%; }
    .chat__msg--propria { align-self: flex-end; align-items: flex-end; }
    .chat__autor { font-size: 12px; font-weight: 600; color: var(--cor-texto-suave); margin-bottom: 3px; }
    .chat__bolha {
      background: var(--cor-fundo-alt); padding: 10px 14px; border-radius: 14px 14px 14px 4px;
      font-size: 14.5px; line-height: 1.45; white-space: pre-wrap; word-break: break-word;
    }
    .chat__msg--propria .chat__bolha {
      background: var(--cor-vermelho); color: #fff; border-radius: 14px 14px 4px 14px;
    }
    .chat__hora { font-size: 11px; color: var(--cor-texto-suave); margin-top: 3px; }
    .chat__erro { margin: 0 var(--espaco-5) var(--espaco-3); }
    .chat__compor {
      display: flex; gap: var(--espaco-3); align-items: flex-end;
      padding: var(--espaco-4) var(--espaco-5); border-top: 1px solid var(--cor-borda);
    }
    .chat__compor textarea {
      flex: 1; font-family: var(--fonte-ui); font-size: 14.5px; padding: 10px 12px;
      border: 1px solid var(--cor-borda-forte); border-radius: var(--raio-s); resize: none;
    }
    .chat__compor textarea:focus { outline: none; border-color: var(--cor-vermelho); box-shadow: 0 0 0 3px var(--cor-vermelho-fundo); }
  `]
})
export class ChatPanelComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) modo!: 'publico' | 'gestao';
  @Input({ required: true }) referencia!: string | number;
  @ViewChild('lista') lista?: ElementRef<HTMLElement>;

  mensagens = signal<ChatMensagem[]>([]);
  enviando = signal(false);
  erro = signal<string | null>(null);
  texto = '';

  private temporizador?: ReturnType<typeof setInterval>;

  constructor(private chat: ChatService) {}

  ngOnChanges(): void {
    this.parar();
    this.mensagens.set([]);
    this.erro.set(null);
    this.carregar();
    this.temporizador = setInterval(() => this.carregar(), 10000);
  }

  ngOnDestroy(): void {
    this.parar();
  }

  propria(m: ChatMensagem): boolean {
    return this.modo === 'publico' ? m.remetente === 'DENUNCIANTE' : m.remetente === 'COMITE';
  }

  autor(m: ChatMensagem): string {
    if (this.modo === 'publico') return m.remetente === 'COMITE' ? 'Comité de Ética' : 'Tu';
    return m.remetente === 'COMITE' ? 'Comité' : 'Denunciante';
  }

  enviar(): void {
    const conteudo = this.texto.trim();
    if (!conteudo || this.enviando()) return;

    this.enviando.set(true);
    this.erro.set(null);

    const pedido: Observable<ChatMensagem> = this.modo === 'publico'
      ? this.chat.enviarPublico(String(this.referencia), conteudo)
      : this.chat.enviarGestao(Number(this.referencia), conteudo);

    pedido.subscribe({
      next: () => {
        this.texto = '';
        this.enviando.set(false);
        this.carregar();
      },
      error: () => {
        this.erro.set('Não foi possível enviar a mensagem. Tenta novamente.');
        this.enviando.set(false);
      }
    });
  }

  private carregar(): void {
    const pedido: Observable<ChatMensagem[]> = this.modo === 'publico'
      ? this.chat.listarPublico(String(this.referencia))
      : this.chat.listarGestao(Number(this.referencia));

    pedido.subscribe({
      next: (lista) => {
        const mudou = lista.length !== this.mensagens().length;
        this.mensagens.set(lista);
        if (mudou) this.rolarParaFim();
      },
      error: () => this.erro.set('Não foi possível carregar a conversa.')
    });
  }

  private rolarParaFim(): void {
    setTimeout(() => {
      const el = this.lista?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  private parar(): void {
    if (this.temporizador) clearInterval(this.temporizador);
  }
}
