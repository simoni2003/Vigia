import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../../shared/icons/icon.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'vigia-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss'
})
export class AdminShellComponent {
  constructor(public auth: AuthService, private router: Router) {}

  ehAdmin(): boolean {
    return this.auth.usuario()?.role === 'ADMIN';
  }

  pesquisar(valor: string): void {
    const q = valor.trim();
    this.router.navigate(['/painel/denuncias'], { queryParams: q ? { q } : {} });
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/entrar']);
  }
}
