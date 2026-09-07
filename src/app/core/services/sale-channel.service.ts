import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { SaleChannel, SaleChannelQuery, CreateSaleChannelRequest, UpdateSaleChannelRequest } from '../models/sale-channel.model';

import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class SaleChannelService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/salechannel`;

    getPage(query: SaleChannelQuery): Observable<PagedResult<SaleChannel>> {
        let params = new HttpParams()
            .set('page', query.page)
            .set('pageSize', query.pageSize)
            .set('sortField', query.sortField ?? 'saleChannelNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<PagedResult<SaleChannel>>(this.apiUrl, { params });
    }

    getById(saleChannelId: number): Observable<SaleChannel> {
        return this.http.get<SaleChannel>(`${this.apiUrl}/${saleChannelId}`);
    }

    create(request: CreateSaleChannelRequest): Observable<SaleChannel> {
        return this.http.post<SaleChannel>(this.apiUrl, request);
    }

    update(saleChannelId: number, request: UpdateSaleChannelRequest): Observable<SaleChannel> {
        return this.http.put<SaleChannel>(`${this.apiUrl}/${saleChannelId}`, request);
    }

    delete(saleChannelId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${saleChannelId}`);
    }
}
