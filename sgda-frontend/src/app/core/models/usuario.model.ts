export type Role = 'ADMIN' | 'GESTOR' | 'INVESTIGADOR';

export interface UsuarioLogado {
  nome: string;
  email: string;
  role: Role;
  token: string;
}

export interface UsuarioGestao {
  id: number;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  role: Role;
}

export const ROTULO_ROLE: Record<Role, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  INVESTIGADOR: 'Investigador'
};
