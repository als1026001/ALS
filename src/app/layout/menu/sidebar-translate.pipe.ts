import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

@Pipe({
    name: 'sidebarTranslate',
    standalone: true,
    pure: false
})
export class SidebarTranslatePipe implements PipeTransform, OnDestroy {
    private readonly subscription: Subscription;

    constructor(
        private readonly transloco: TranslocoService,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.subscription = this.transloco.langChanges$.subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    transform(label: string | undefined): string {
        if (!label) {
            return '';
        }

        // Only translate labels that exist in the sidebar dictionary.
        // API labels are already translated by PostgreSQL.
        const key = `sidebar.${label}`;

        const translations = this.transloco.getTranslation(this.transloco.getActiveLang());

        if (!Object.prototype.hasOwnProperty.call(translations, key)) {
            return label;
        }

        return this.transloco.translate(key);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
