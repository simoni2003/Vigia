export type StatusDenuncia = 'RECEBIDA' | 'EM_ANALISE' | 'EM_INVESTIGACAO' | 'RESOLVIDA' | 'ARQUIVADA';

export interface Denuncia {
  id: number;
  protocolo: string;
  descricao: string;
  status: StatusDenuncia;
  anonima: boolean;
  anexoUrl?: string;
  dataCriacao: string;
  investigadorResponsavel?: string;
}

export interface DenunciaRequest {
  descricao: string;
  anonima: boolean;
  emailDenunciante?: string;
  anexoUrl?: string;
}

export interface HistoricoItem {
  acao: string;
  dataHora: string;
}

export interface ProtocoloTracking {
  protocolo: string;
  status: StatusDenuncia;
  dataCriacao: string;
  historico: HistoricoItem[];
}

export interface DashboardResumo {
  totalDenuncias: number;
  contadorPorStatus: Record<StatusDenuncia, number>;
}

export const STATUS_LABEL: Record<StatusDenuncia, string> = {
  RECEBIDA: 'Recebida',
  EM_ANALISE: 'Em análise',
  EM_INVESTIGACAO: 'Em investigação',
  RESOLVIDA: 'Resolvida',
  ARQUIVADA: 'Arquivada'
};

export interface HistoricoDetalhe {
  id: number;
  acao: string;
  detalhes?: string;
  usuario?: string;
  dataHora: string;
}

export interface ChatMensagem {
  id: number;
  remetente: 'DENUNCIANTE' | 'COMITE';
  conteudo: string;
  dataEnvio: string;
}

const ROTULOS_ACAO: Record<string, string> = {
  DENUNCIA_CRIADA: 'Denúncia recebida',
  STATUS_ATUALIZADO: 'Estado atualizado',
  INVESTIGADOR_ATRIBUIDO: 'Investigador atribuído',
  MENSAGEM_CHAT: 'Nova mensagem no chat seguro'
};

export function rotuloAcao(codigo: string): string {
  return ROTULOS_ACAO[codigo] ?? codigo;
}
