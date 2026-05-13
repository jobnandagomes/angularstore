import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated();

  // Se estiver tentando acessar a página de login enquanto autenticado
  if (isAuthenticated && state.url.includes('/auth/login')) {
    router.navigate(['/courses']);
    return false;
  }

  if (isAuthenticated) {
    return true;
  }

  // Armazena a URL que o usuário tentou acessar
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
}; 