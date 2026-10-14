import { Injectable, effect, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type AppLanguage = 'vi' | 'en' | 'cn';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private readonly transloco = inject(TranslocoService);
    private readonly languageKey = 'erp.language';

    readonly selectedLanguage = signal<AppLanguage>(this.readLanguage());

    constructor() {
        effect(() => {
            const language = this.selectedLanguage();

            this.transloco.setActiveLang(language);

            document.documentElement.lang = language === 'cn' ? 'zh-CN' : language;
        });
    }

    setLanguage(language: AppLanguage): void {
        this.selectedLanguage.set(language);
        localStorage.setItem(this.languageKey, language);
    }

    private readLanguage(): AppLanguage {
        const value = localStorage.getItem(this.languageKey);

        // Migrate previously saved language code
        if (value === 'zh') {
            localStorage.setItem(this.languageKey, 'cn');
            return 'cn';
        }

        if (value === 'vi' || value === 'en' || value === 'cn') {
            return value;
        }

        return 'en';
    }
}
