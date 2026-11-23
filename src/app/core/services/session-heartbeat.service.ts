import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Subscription, timer } from 'rxjs';
import { catchError, exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ActiveSessionService } from './active-session.service';

@Injectable({ providedIn: 'root' })
export class SessionHeartbeatService {
    private readonly auth = inject(AuthService);
    private readonly sessions = inject(ActiveSessionService);
    private subscription?: Subscription;

    start(): void {
        if (this.subscription || !this.auth.getToken()) {
            return;
        }

        this.subscription = timer(0, 30000).pipe(
            exhaustMap(() => {
                if (!this.auth.getToken()) {
                    this.stop();
                    return EMPTY;
                }

                return this.sessions.heartbeat().pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401) {
                            this.stop();
                        }
                        return EMPTY;
                    })
                );
            })
        ).subscribe();
    }

    stop(): void {
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }
}