import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
    AutoGenerateNumber,
    AutoGenerateNumberQuery,
    CreateAutoGenerateNumberRequest,
    UpdateAutoGenerateNumberRequest
} from '../models/auto-generate-number.model';

export interface AutoGenerateNumberPagedResult {
    items: AutoGenerateNumber[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class AutoGenerateNumberService {
    private readonly apiUrl =
        `${API_BASE_URL}/autogeneratenumber`;

    constructor(
        private readonly http: HttpClient
    ) {}

    getPage(
        query: AutoGenerateNumberQuery
    ): Observable<AutoGenerateNumberPagedResult> {
        let params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString())
            .set(
                'sortField',
                query.sortField ?? 'refFunctionCode'
            )
            .set(
                'sortDirection',
                query.sortDirection ?? 'asc'
            );

        if (query.search?.trim()) {
            params = params.set(
                'search',
                query.search.trim()
            );
        }

        return this.http.get<AutoGenerateNumberPagedResult>(
            this.apiUrl,
            { params }
        );
    }

    getById(
        refFunctionCode: number
    ): Observable<AutoGenerateNumber> {
        return this.http.get<AutoGenerateNumber>(
            `${this.apiUrl}/${refFunctionCode}`
        );
    }

    create(
        request: CreateAutoGenerateNumberRequest
    ): Observable<AutoGenerateNumber> {
        return this.http.post<AutoGenerateNumber>(
            this.apiUrl,
            request
        );
    }

    update(
        refFunctionCode: number,
        request: UpdateAutoGenerateNumberRequest
    ): Observable<AutoGenerateNumber> {
        return this.http.put<AutoGenerateNumber>(
            `${this.apiUrl}/${refFunctionCode}`,
            request
        );
    }

    delete(
        refFunctionCode: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${refFunctionCode}`
        );
    }
}