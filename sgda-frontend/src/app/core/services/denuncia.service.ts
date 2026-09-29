import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Denuncia, DenunciaRequest, ProtocoloTracking, DashboardResumo,
  HistoricoDetalhe, StatusDenuncia
} from '../models/denuncia.model';

@Injectable({ providedIn: 'root' })
export class DenunciaService {
  private readonly base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // --- Portal do denunciante (público) ---
  criar(request: DenunciaRequest): Observable<Denuncia> {
    return this.http.post<Denuncia>(`${this.base}/denuncias/publico`, request);
  }

  rastrear(protocolo: string): Observable<ProtocoloTracking> {
    return this.http.get<ProtocoloTracking>(`${this.base}/denuncias/rastreio/${protocolo}`);
  }

  // --- Painel de gestão (restrito) ---
  listar(status?: StatusDenuncia): Observable<Denuncia[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Denuncia[]>(`${this.base}/gestao/denuncias`, { params });
  }

  buscar(id: number): Observable<Denuncia> {
    return this.http.get<Denuncia>(`${this.base}/gestao/denuncias/${id}`);
  }

  historico(id: number): Observable<HistoricoDetalhe[]> {
    return this.http.get<HistoricoDetalhe[]>(`${this.base}/gestao/denuncias/${id}/historico`);
  }

  atualizarStatus(id: number, status: StatusDenuncia, observacao?: string): Observable<Denuncia> {
    return this.http.put<Denuncia>(`${this.base}/gestao/denuncias/${id}/status`, { status, observacao });
  }

  atribuirInvestigador(id: number, investigadorId: number): Observable<Denuncia> {
    return this.http.put<Denuncia>(`${this.base}/gestao/denuncias/${id}/investigador`, { investigadorId });
  }

  dashboard(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.base}/gestao/dashboard`);
  }
}
