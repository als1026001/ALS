import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { CreateExpenseCategoryRequest, ExpenseCategory, ExpenseCategoryQuery, FinancialAccountLookup, UpdateExpenseCategoryRequest } from '../models/expense-category.model';

import { PagedResult } from '../models/paged-result.model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseCategoryService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${API_BASE_URL}/expensecategory`;

    getPage(query: ExpenseCategoryQuery): Observable<PagedResult<ExpenseCategory>> {
        let params = new HttpParams()
            .set('page', query.page)
            .set('pageSize', query.pageSize)
            .set('sortField', query.sortField ?? 'expenseNo')
            .set('sortDirection', query.sortDirection ?? 'asc');

        if (query.search?.trim()) {
            params = params.set('search', query.search.trim());
        }

        return this.http.get<PagedResult<ExpenseCategory>>(this.apiUrl, { params });
    }

    getById(expenseId: number): Observable<ExpenseCategory> {
        return this.http.get<ExpenseCategory>(`${this.apiUrl}/${expenseId}`);
    }

    create(request: CreateExpenseCategoryRequest): Observable<ExpenseCategory> {
        return this.http.post<ExpenseCategory>(this.apiUrl, request);
    }

    update(expenseId: number, request: UpdateExpenseCategoryRequest): Observable<ExpenseCategory> {
        return this.http.put<ExpenseCategory>(`${this.apiUrl}/${expenseId}`, request);
    }

    delete(expenseId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${expenseId}`);
    }

    getAccounts(): Observable<FinancialAccountLookup[]> {
        return this.http.get<FinancialAccountLookup[]>(`${this.apiUrl}/accounts`);
    }
}
