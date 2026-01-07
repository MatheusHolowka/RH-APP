import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importe nosso serviço

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  } else {
    console.warn('Bloqueado pelo AuthGuard! Redirecionando para /login');
    router.navigate(['/login']);
    return false;
  }
};