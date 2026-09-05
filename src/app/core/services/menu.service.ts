import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppMenuItem } from '../models/app-menu-item';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://localhost:7001/api/menu';

    getMenu(): Observable<AppMenuItem[]> {
        return this.http.get<AppMenuItem[]>(this.apiUrl);
    }
}
