import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioGestao, UsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = `${environment.apiUrl}/gestao/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioGestao[]> {
    return this.http.get<UsuarioGestao[]>(this.base);
  }

  investigadores(): Observable<UsuarioGestao[]> {
    return this.http.get<UsuarioGestao[]>(`${this.base}/investigadores`);
  }

  criar(request: UsuarioRequest): Observable<UsuarioGestao> {
    return this.http.post<UsuarioGestao>(this.base, request);
  }

  atualizar(id: number, request: UsuarioRequest): Observable<UsuarioGestao> {
    return this.http.put<UsuarioGestao>(`${this.base}/${id}`, request);
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
