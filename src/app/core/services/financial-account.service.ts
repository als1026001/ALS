import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { CreateFinancialAccountRequest, FinancialAccount, FinancialAccountQuery, PagedFinancialAccountResult, UpdateFinancialAccountRequest } from '../models/financial-account.model';

@Injectable({
    providedIn: 'root'
})
export class FinancialAccountService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/financialaccount`;

    getPage(query: FinancialAccountQuery): Observable<PagedFinancialAccountResult> {
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

        return this.http.get<PagedFinancialAccountResult>(this.apiUrl, { params });
    }

    getById(accountId: number): Observable<FinancialAccount> {
        return this.http.get<FinancialAccount>(`${this.apiUrl}/${accountId}`);
    }

    getLookup(): Observable<FinancialAccount[]> {
        return this.http.get<FinancialAccount[]>(`${this.apiUrl}/lookup`);
    }

    create(request: CreateFinancialAccountRequest): Observable<FinancialAccount> {
        return this.http.post<FinancialAccount>(this.apiUrl, request);
    }

    update(accountId: number, request: UpdateFinancialAccountRequest): Observable<FinancialAccount> {
        return this.http.put<FinancialAccount>(`${this.apiUrl}/${accountId}`, request);
    }

    delete(accountId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${accountId}`);
    }
}
