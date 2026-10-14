import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { AppMenuItem } from '../models/app-menu-item';

@Injectable({
    providedIn: 'root'
})
export class MenuTranslationService {
    private readonly transloco = inject(TranslocoService);

    translateMenu(item: AppMenuItem): string {
        const key = `menus.${item.menuNo}`;

        const translated = this.transloco.translate(key);

        // Nếu chưa có bản dịch thì giữ nguyên tên từ API.
        return translated === key ? item.label : translated;
    }
}
