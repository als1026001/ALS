import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface ExcelExportOptions {
    endpoint: string;
    fileName: string;

    search?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

@Injectable({
    providedIn: 'root'
})
export class ExcelDownloadService {
    private readonly http = inject(HttpClient);

    export(options: ExcelExportOptions): Observable<Blob> {
        let params = new HttpParams();

        if (options.search?.trim()) {
            params = params.set('search', options.search.trim());
        }

        if (options.sortField?.trim()) {
            params = params.set('sortField', options.sortField.trim());
        }

        if (options.sortDirection) {
            params = params.set('sortDirection', options.sortDirection);
        }

        const endpoint = options.endpoint.replace(/^\/+/, '');

        return this.http.get(`${API_BASE_URL}/${endpoint}`, {
            params,
            responseType: 'blob'
        });
    }

    download(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = `${fileName}_${this.getTimestamp()}.xlsx`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }

    private getTimestamp(): string {
        const now = new Date();

        const yyyy = now.getFullYear();

        const MM = String(now.getMonth() + 1).padStart(2, '0');

        const dd = String(now.getDate()).padStart(2, '0');

        const HH = String(now.getHours()).padStart(2, '0');

        const mm = String(now.getMinutes()).padStart(2, '0');

        const ss = String(now.getSeconds()).padStart(2, '0');

        return `${yyyy}${MM}${dd}_${HH}${mm}${ss}`;
    }
}
