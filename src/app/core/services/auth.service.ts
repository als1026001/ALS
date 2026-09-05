import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
    LoginRequest,
    LoginResponse
} from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly apiUrl =
        'https://localhost:7001/api/auth';

    constructor(
        private http: HttpClient
    ) {}

    login(
        request: LoginRequest
    ): Observable<LoginResponse> {

        return this.http
            .post<LoginResponse>(
                `${this.apiUrl}/login`,
                request
            )
            .pipe(
                tap(response => {

                    localStorage.setItem(
                        'access_token',
                        response.accessToken
                    );

                    localStorage.setItem(
                        'user',
                        JSON.stringify(response)
                    );

                })
            );
    }

    logout(): void {

        localStorage.removeItem(
            'access_token'
        );

        localStorage.removeItem(
            'user'
        );
    }

    getToken(): string | null {

        return localStorage.getItem(
            'access_token'
        );
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

    getCurrentUser():
        LoginResponse | null {

        const value =
            localStorage.getItem('user');

        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as LoginResponse;
        } catch {
            this.logout();
            return null;
        }
    }
}
