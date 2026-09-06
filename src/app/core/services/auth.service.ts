import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { PermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly permissionService = inject(PermissionService);
    private readonly apiUrl = `${API_BASE_URL}/auth`;

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
            tap((response) => {
                localStorage.setItem('access_token', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response));
                this.permissionService.clear();
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        this.permissionService.clear();
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        const user = this.getCurrentUser();

        if (!token || !user || new Date(user.expiresAt).getTime() <= Date.now()) {
            this.logout();
            return false;
        }

        return true;
    }

    getCurrentUser(): LoginResponse | null {
        const value = localStorage.getItem('user');
        if (!value) return null;

        try {
            return JSON.parse(value) as LoginResponse;
        } catch {
            this.logout();
            return null;
        }
    }
}
