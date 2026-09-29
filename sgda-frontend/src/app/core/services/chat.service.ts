import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMensagem } from '../models/denuncia.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly base = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  // Denunciante: acede apenas com o protocolo
  listarPublico(protocolo: string): Observable<ChatMensagem[]> {
    return this.http.get<ChatMensagem[]>(`${this.base}/publico/${protocolo}`);
  }

  enviarPublico(protocolo: string, conteudo: string): Observable<ChatMensagem> {
    return this.http.post<ChatMensagem>(`${this.base}/publico/${protocolo}`, { conteudo });
  }

  // Comité: acesso restrito por JWT
  listarGestao(denunciaId: number): Observable<ChatMensagem[]> {
    return this.http.get<ChatMensagem[]>(`${this.base}/gestao/${denunciaId}`);
  }

  enviarGestao(denunciaId: number, conteudo: string): Observable<ChatMensagem> {
    return this.http.post<ChatMensagem>(`${this.base}/gestao/${denunciaId}`, { conteudo });
  }
}
