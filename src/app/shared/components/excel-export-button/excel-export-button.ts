import { Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { finalize } from 'rxjs';

import { ExcelDownloadService } from '../../../core/services/excel-download.service';

@Component({
    selector: 'app-excel-export-button',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './excel-export-button.html'
})
export class ExcelExportButton {
    private readonly excelService = inject(ExcelDownloadService);

    private readonly messageService = inject(MessageService);

    readonly endpoint = input.required<string>();

    readonly fileName = input.required<string>();

    readonly search = input<string>('');

    readonly sortField = input<string>('');

    readonly sortDirection = input<'asc' | 'desc'>('asc');

    readonly disabled = input<boolean>(false);

    readonly exporting = signal(false);

    exportExcel(): void {
        if (this.exporting() || this.disabled()) {
            return;
        }

        this.exporting.set(true);

        this.excelService
            .export({
                endpoint: this.endpoint(),
                fileName: this.fileName(),
                search: this.search(),
                sortField: this.sortField(),
                sortDirection: this.sortDirection()
            })
            .pipe(
                finalize(() => {
                    this.exporting.set(false);
                })
            )
            .subscribe({
                next: (blob) => {
                    this.excelService.download(blob, this.fileName());

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Excel exported successfully.'
                    });
                },

                error: (error: HttpErrorResponse) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Export failed',
                        detail: error.status === 403 ? 'You do not have permission to export.' : 'Unable to export Excel.'
                    });
                }
            });
    }
}
