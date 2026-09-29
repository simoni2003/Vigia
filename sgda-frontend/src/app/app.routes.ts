import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'rastreio',
    loadComponent: () => import('./features/rastreio/rastreio.component').then(m => m.RastreioComponent)
  },
  {
    path: 'rastreio/:protocolo',
    loadComponent: () => import('./features/rastreio/rastreio.component').then(m => m.RastreioComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat-publico/chat-publico.component').then(m => m.ChatPublicoComponent)
  },
  {
    path: 'chat/:protocolo',
    loadComponent: () => import('./features/chat-publico/chat-publico.component').then(m => m.ChatPublicoComponent)
  },
  {
    path: 'entrar',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'painel',
    loadComponent: () => import('./features/admin/shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'denuncias',
        loadComponent: () => import('./features/admin/denuncias/denuncias-lista.component').then(m => m.DenunciasListaComponent)
      },
      {
        path: 'denuncias/:id',
        loadComponent: () => import('./features/admin/denuncias/denuncia-detalhe.component').then(m => m.DenunciaDetalheComponent)
      },
      {
        path: 'mensagens',
        loadComponent: () => import('./features/admin/mensagens/mensagens.component').then(m => m.MensagensComponent)
      },
      {
        path: 'utilizadores',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/admin/utilizadores/utilizadores.component').then(m => m.UtilizadoresComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
