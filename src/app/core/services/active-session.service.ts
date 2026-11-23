import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
    ActiveSession,
    ActiveSessionPage,
    ActiveSessionQuery
} from '../models/active-session.model';

@Injectable({ providedIn: 'root' })
export class ActiveSessionService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_BASE_URL}/active-sessions`;

    getPage(query: ActiveSessionQuery): Observable<ActiveSessionPage> {
        const params = new HttpParams()
            .set('page', query.page.toString())
            .set('pageSize', query.pageSize.toString());

        return this.http.get<ActiveSessionPage>(
            this.apiUrl, { params }
        );
    }

    heartbeat(): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/heartbeat`, {}
        );
    }

    forceLogout(session: ActiveSession): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/${encodeURIComponent(session.sessionId)}/force-logout`,
            {}
        );
    }
}