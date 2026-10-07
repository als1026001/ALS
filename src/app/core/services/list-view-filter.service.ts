import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ListViewFilter, ListViewFilterQuery, CreateListViewFilterRequest, UpdateListViewFilterRequest } from '../models/list-view-filter.model';

export interface PagedListViewFilterResult {
    items: ListViewFilter[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ListViewFilterService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/listviewfilter`;

    getPage(query: ListViewFilterQuery): Observable<PagedListViewFilterResult> {
        let params = new HttpParams()
            .set('page', (query.page ?? 1).toString())
            .set('pageSize', (query.pageSize ?? 20).toString())
            .set('sortField', query.sortField ?? 'filterOrder')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.viewId != null) {
            params = params.set('viewId', query.viewId.toString());
        }

        if (query.fieldId != null) {
            params = params.set('fieldId', query.fieldId.toString());
        }

        if (query.isVisible != null) {
            params = params.set('isVisible', query.isVisible.toString());
        }

        return this.http.get<PagedListViewFilterResult>(this.apiUrl, { params });
    }

    getById(viewFilterId: number): Observable<ListViewFilter> {
        return this.http.get<ListViewFilter>(`${this.apiUrl}/${viewFilterId}`);
    }

    create(request: CreateListViewFilterRequest): Observable<ListViewFilter> {
        return this.http.post<ListViewFilter>(this.apiUrl, request);
    }

    update(viewFilterId: number, request: UpdateListViewFilterRequest): Observable<ListViewFilter> {
        return this.http.put<ListViewFilter>(`${this.apiUrl}/${viewFilterId}`, request);
    }

    delete(viewFilterId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${viewFilterId}`);
    }
}
