import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TranslocoHttpLoader implements TranslocoLoader {
    private readonly http = inject(HttpClient);

    getTranslation(lang: string): Observable<Translation> {
        const local$ = this.http.get<Translation>(`/assets/i18n/${lang}.json`).pipe(catchError(() => of({} as Translation)));

        const api$ = this.http.get<Record<string, string>>(`https://localhost:7001/api/translations?lang=${encodeURIComponent(lang)}`).pipe(
            catchError((error) => {
                console.warn('Unable to load dynamic translations:', error);
                return of({});
            })
        );

        return forkJoin([local$, api$]).pipe(
            map(([local, api]) => {
                const result: Translation = structuredClone(local);

                for (const [key, value] of Object.entries(api)) {
                    const parts = key.split('.');
                    let current: Record<string, any> = result;

                    for (let i = 0; i < parts.length - 1; i++) {
                        const part = parts[i];

                        // Reject unsafe object paths.
                        if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
                            break;
                        }

                        if (!Object.prototype.hasOwnProperty.call(current, part) || typeof current[part] !== 'object' || current[part] === null || Array.isArray(current[part])) {
                            current[part] = {};
                        }

                        current = current[part];
                    }

                    const lastPart = parts[parts.length - 1];

                    if (parts.some((part) => ['__proto__', 'constructor', 'prototype'].includes(part))) {
                        continue;
                    }

                    current[lastPart] = value;
                }

                return result;
            })
        );
    }
}
