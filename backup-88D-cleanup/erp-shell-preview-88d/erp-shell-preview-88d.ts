import { Component } from '@angular/core';
import { ErpPageShell } from '../../shared/components/erp-page-shell/erp-page-shell';

@Component({
    selector: 'app-erp-shell-preview-88d',
    standalone: true,
    imports: [ErpPageShell],
    template: `
        <app-erp-page-shell
            title="ERP Page Shell Preview"
            description="Temporary UI verification page."
            (refresh)="onRefresh()"
        />
    `
})
export class ErpShellPreview88D {
    onRefresh(): void {
        console.log('ERP Page Shell Refresh event: PASS');
    }
}
