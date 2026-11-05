import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard for routes requiring customer authentication
 */
export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  // Redirect to login with current attempted URL as returnUrl
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};

/**
 * Guard for routes requiring administrator privileges
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};

/**
 * Guard for guest-only routes (login, register). Prevents already-signed-in users
 * from revisiting the login/register screen by redirecting them to their active dashboard.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return authService.isAdmin()
      ? router.createUrlTree(['/admin/dashboard'])
      : router.createUrlTree(['/customer/dashboard']);
  }
  return true;
};
