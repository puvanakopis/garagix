import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Functional HTTP Interceptor for JWT authentication and 401 session handling.
 * Attaches 'Authorization: Bearer <token>' to outgoing requests and handles token expiration.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = authService.getToken();

  let authReq = req;
  if (token && !req.headers.has('Authorization')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized indicates invalid or expired token
      // Only intercept for non-login endpoints so login error messages can be displayed inline
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.logout();
        toastService.showError('Your session has expired. Please sign in again.', 'Session Expired');
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url }
        });
      }
      return throwError(() => error);
    })
  );
};

