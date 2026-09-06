import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();
    const isLoginRequest = request.url.includes('/api/auth/login');

    const authenticatedRequest = token && !isLoginRequest
        ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : request;

    return next(authenticatedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isLoginRequest) {
                authService.logout();
                void router.navigate(['/auth/login']);
            }

            return throwError(() => error);
        })
    );
};
