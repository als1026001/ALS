import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { MenuAccess, RouteAccess } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE_URL}/permissions`;
    private readonly routeAccessCache = new Map<string, RouteAccess>();
    private permissionsRequest$?: Observable<MenuAccess[]>;

    loadCurrentUserPermissions(force = false): Observable<MenuAccess[]> {
        if (force || !this.permissionsRequest$) {
            this.permissionsRequest$ = this.http.get<MenuAccess[]>(this.apiUrl).pipe(shareReplay(1));
        }

        return this.permissionsRequest$;
    }

    getRouteAccess(routerLink: string, force = false): Observable<RouteAccess> {
        const normalized = this.normalizeRoute(routerLink);
        const cached = this.routeAccessCache.get(normalized);

        if (cached && !force) {
            return new Observable<RouteAccess>((subscriber) => {
                subscriber.next(cached);
                subscriber.complete();
            });
        }

        const params = new HttpParams().set('routerLink', normalized);

        return this.http.get<RouteAccess>(`${this.apiUrl}/access`, { params }).pipe(
            tap((access) => this.routeAccessCache.set(normalized, access)),
            shareReplay(1)
        );
    }

    clear(): void {
        this.permissionsRequest$ = undefined;
        this.routeAccessCache.clear();
    }

    private normalizeRoute(routerLink: string): string {
        const value = routerLink.trim();
        if (!value) return '/';
        return value.startsWith('/') ? value : `/${value}`;
    }
}
