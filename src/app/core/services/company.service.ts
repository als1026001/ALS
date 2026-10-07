import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Company, CompanyQuery, CreateCompanyRequest, UpdateCompanyRequest } from '../models/company.model';

export interface CompanyPagedResult {
    items: Company[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private readonly apiUrl = `${API_BASE_URL}/company`;

    constructor(private readonly http: HttpClient) {}

    getPage(query: CompanyQuery): Observable<CompanyPagedResult> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString())
            .set('sortField', query.sortField ?? 'companyNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        if (query.isActive !== undefined && query.isActive !== null) {
            params = params.set('isActive', query.isActive.toString());
        }

        return this.http.get<CompanyPagedResult>(this.apiUrl, { params });
    }

    getById(companyId: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/${companyId}`);
    }

    create(request: CreateCompanyRequest): Observable<Company> {
        return this.http.post<Company>(this.apiUrl, request);
    }

    update(companyId: number, request: UpdateCompanyRequest): Observable<Company> {
        return this.http.put<Company>(`${this.apiUrl}/${companyId}`, request);
    }

    delete(companyId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${companyId}`);
    }
}
