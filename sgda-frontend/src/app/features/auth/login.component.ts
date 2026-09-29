import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icons/icon.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'vigia-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  senha = '';
  entrando = signal(false);
  erro = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  entrar(): void {
    this.erro.set(null);
    this.entrando.set(true);

    this.auth.login(this.email, this.senha).subscribe({
      next: () => {
        this.entrando.set(false);
        this.router.navigate(['/painel']);
      },
      error: () => {
        this.entrando.set(false);
        this.erro.set('Email ou palavra-passe inválidos.');
      }
    });
  }
}
