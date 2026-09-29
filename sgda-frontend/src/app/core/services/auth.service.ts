import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioLogado } from '../models/usuario.model';

const CHAVE_SESSAO = 'vigia_sessao';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<UsuarioLogado | null>(this.recuperarSessao());

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<UsuarioLogado> {
    return this.http
      .post<UsuarioLogado>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(tap((sessao) => this.guardarSessao(sessao)));
  }

  logout(): void {
    localStorage.removeItem(CHAVE_SESSAO);
    this.usuario.set(null);
  }

  get token(): string | null {
    return this.usuario()?.token ?? null;
  }

  get autenticado(): boolean {
    return !!this.usuario();
  }

  private guardarSessao(sessao: UsuarioLogado) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    this.usuario.set(sessao);
  }

  private recuperarSessao(): UsuarioLogado | null {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    return bruto ? (JSON.parse(bruto) as UsuarioLogado) : null;
  }
}
