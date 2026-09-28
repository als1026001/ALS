import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { CreateMenuSetupRequest, MenuParentLookup, MenuSetup, MenuSetupQuery, PagedMenuSetupResult, UpdateMenuSetupRequest } from '../models/menu-setup.model';

@Injectable({
    providedIn: 'root'
})
export class MenuSetupService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/menusetup`;

    // =========================================================
    // Management page
    // GET /api/menusetup
    // =========================================================

    getPage(query: MenuSetupQuery): Observable<PagedMenuSetupResult> {
        let params = new HttpParams().set('page', query.page.toString()).set('pageSize', query.pageSize.toString());

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.sortField?.trim()) {
            params = params.set('sortField', query.sortField.trim());
        }

        if (query.sortDirection) {
            params = params.set('sortDirection', query.sortDirection);
        }

        return this.http.get<PagedMenuSetupResult>(this.apiUrl, { params });
    }

    // =========================================================
    // Parent menu lookup
    // GET /api/menusetup/parents
    // =========================================================

    getParents(excludeMenuId?: number | null): Observable<MenuParentLookup[]> {
        let params = new HttpParams();

        if (excludeMenuId != null) {
            params = params.set('excludeMenuId', excludeMenuId.toString());
        }

        return this.http.get<MenuParentLookup[]>(`${this.apiUrl}/parents`, { params });
    }

    // =========================================================
    // Get one
    // =========================================================

    getById(menuId: number): Observable<MenuSetup> {
        return this.http.get<MenuSetup>(`${this.apiUrl}/${menuId}`);
    }

    // =========================================================
    // Create
    // =========================================================

    create(request: CreateMenuSetupRequest): Observable<MenuSetup> {
        return this.http.post<MenuSetup>(this.apiUrl, request);
    }

    // =========================================================
    // Update
    // =========================================================

    update(menuId: number, request: UpdateMenuSetupRequest): Observable<MenuSetup> {
        return this.http.put<MenuSetup>(`${this.apiUrl}/${menuId}`, request);
    }

    // =========================================================
    // Delete
    // =========================================================

    delete(menuId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${menuId}`);
    }
}
