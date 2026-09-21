import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { AppMenuItem } from '../models/app-menu-item';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);

    private readonly menuApiUrl = `${API_BASE_URL}/menu`;

    getMenu(): Observable<AppMenuItem[]> {
        return this.http.get<AppMenuItem[]>(this.menuApiUrl);
    }
}
