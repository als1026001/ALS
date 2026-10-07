import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { CenterSearchItem } from '../models/center-search.model';

@Injectable({
    providedIn: 'root'
})
export class CenterSearchService {
    private readonly http = inject(HttpClient);

    search(search: string, limit: number = 10): Observable<CenterSearchItem[]> {
        const params = new HttpParams().set('search', search).set('limit', limit.toString());

        return this.http.get<CenterSearchItem[]>(`${API_BASE_URL}/center-search`, { params });
    }
}
