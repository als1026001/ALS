import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Color, ColorQuery, CreateColorRequest, UpdateColorRequest } from '../models/color.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class ColorService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE_URL}/color`;

    getPage(query: ColorQuery): Observable<PagedResult<Color>> {
        let params = new HttpParams()
            .set('page', query.page)
            .set('pageSize', query.pageSize)
            .set('sortField', query.sortField ?? 'colorNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<PagedResult<Color>>(this.apiUrl, { params });
    }

    getById(colorId: number): Observable<Color> {
        return this.http.get<Color>(`${this.apiUrl}/${colorId}`);
    }

    create(request: CreateColorRequest): Observable<Color> {
        return this.http.post<Color>(this.apiUrl, request);
    }

    update(colorId: number, request: UpdateColorRequest): Observable<Color> {
        return this.http.put<Color>(`${this.apiUrl}/${colorId}`, request);
    }

    delete(colorId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${colorId}`);
    }
}
