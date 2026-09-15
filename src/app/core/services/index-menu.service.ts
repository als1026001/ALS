import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { CreateIndexMenuRequest, IndexMenu, IndexMenuQuery, PagedIndexMenuResult, UpdateIndexMenuRequest } from '../models/index-menu.model';

@Injectable({
    providedIn: 'root'
})
export class IndexMenuService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/indexmenu`;

    // =========================================================
    // Visible menus used by the application topbar
    // GET /api/indexmenu
    // =========================================================

    getVisibleMenus(): Observable<IndexMenu[]> {
        return this.http.get<IndexMenu[]>(this.apiUrl);
    }

    // =========================================================
    // Management page
    // GET /api/indexmenu/manage
    // =========================================================

    getPage(query: IndexMenuQuery): Observable<PagedIndexMenuResult> {
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

        return this.http.get<PagedIndexMenuResult>(`${this.apiUrl}/manage`, {
            params
        });
    }

    // =========================================================
    // Get one
    // =========================================================

    getById(indexMenuId: number): Observable<IndexMenu> {
        return this.http.get<IndexMenu>(`${this.apiUrl}/${indexMenuId}`);
    }

    // =========================================================
    // Create
    // =========================================================

    create(request: CreateIndexMenuRequest): Observable<IndexMenu> {
        return this.http.post<IndexMenu>(this.apiUrl, request);
    }

    // =========================================================
    // Update
    // =========================================================

    update(indexMenuId: number, request: UpdateIndexMenuRequest): Observable<IndexMenu> {
        return this.http.put<IndexMenu>(`${this.apiUrl}/${indexMenuId}`, request);
    }

    // =========================================================
    // Delete
    // =========================================================

    delete(indexMenuId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${indexMenuId}`);
    }
}
