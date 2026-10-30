import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-erp-page-shell',
    standalone: true,
    imports: [ButtonModule, ToolbarModule],
    templateUrl: './erp-page-shell.html'
})
export class ErpPageShell {
    readonly title = input.required<string>();
    readonly description = input<string>('This feature is under development.');
    readonly refresh = output<void>();
}
