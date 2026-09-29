import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/usuario.model';

export const roleGuard = (permitidos: Role[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.usuario()?.role;
  if (role && permitidos.includes(role)) return true;

  router.navigate(['/painel']);
  return false;
};
