import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icons/icon.component';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role, ROTULO_ROLE, UsuarioGestao, UsuarioRequest } from '../../../core/models/usuario.model';

@Component({
  selector: 'vigia-utilizadores',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './utilizadores.component.html',
  styleUrl: './utilizadores.component.scss'
})
export class UtilizadoresComponent implements OnInit {
  lista = signal<UsuarioGestao[]>([]);
  carregando = signal(true);
  modo = signal<'nenhum' | 'novo' | 'editar'>('nenhum');
  erro = signal<string | null>(null);
  aGuardar = signal(false);

  editandoId: number | null = null;
  form: UsuarioRequest = this.formVazio();

  roles: Role[] = ['ADMIN', 'GESTOR', 'INVESTIGADOR'];
  rotuloRole = ROTULO_ROLE;

  constructor(private usuarioService: UsuarioService, public auth: AuthService) {}

  ngOnInit(): void {
    this.carregar();
  }

  novo(): void {
    this.editandoId = null;
    this.form = this.formVazio();
    this.erro.set(null);
    this.modo.set('novo');
  }

  editar(u: UsuarioGestao): void {
    this.editandoId = u.id;
    this.form = { nome: u.nome, email: u.email, role: u.role, senha: '' };
    this.erro.set(null);
    this.modo.set('editar');
  }

  fechar(): void {
    this.modo.set('nenhum');
    this.editandoId = null;
  }

  guardar(): void {
    this.erro.set(null);

    if (!this.form.nome.trim() || !this.form.email.trim()) {
      this.erro.set('Nome e email são obrigatórios.');
      return;
    }
    if (this.modo() === 'novo' && !this.form.senha) {
      this.erro.set('Define uma palavra-passe para o novo utilizador.');
      return;
    }

    const pedido: UsuarioRequest = { ...this.form };
    if (!pedido.senha) delete pedido.senha;

    this.aGuardar.set(true);
    const acao = this.modo() === 'novo'
      ? this.usuarioService.criar(pedido)
      : this.usuarioService.atualizar(this.editandoId as number, pedido);

    acao.subscribe({
      next: () => {
        this.aGuardar.set(false);
        this.fechar();
        this.carregar();
      },
      error: (e) => {
        this.aGuardar.set(false);
        this.erro.set(e?.error?.mensagem ?? 'Não foi possível guardar o utilizador.');
      }
    });
  }

  desativar(u: UsuarioGestao): void {
    if (!confirm(`Desativar o acesso de ${u.nome}? Esta pessoa deixa de conseguir entrar no painel.`)) return;
    this.usuarioService.desativar(u.id).subscribe(() => this.carregar());
  }

  eu(u: UsuarioGestao): boolean {
    return u.email === this.auth.usuario()?.email;
  }

  private carregar(): void {
    this.usuarioService.listar().subscribe({
      next: (l) => {
        this.lista.set(l);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  private formVazio(): UsuarioRequest {
    return { nome: '', email: '', senha: '', role: 'INVESTIGADOR' };
  }
}
