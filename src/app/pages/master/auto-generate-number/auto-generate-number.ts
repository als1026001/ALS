import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { AutoGenerateNumber, CreateAutoGenerateNumberRequest, UpdateAutoGenerateNumberRequest } from '../../../core/models/auto-generate-number.model';

import { AutoGenerateNumberService } from '../../../core/services/auto-generate-number.service';

@Component({
    selector: 'app-auto-generate-number',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, InputNumberModule, CheckboxModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './auto-generate-number.html',
    styleUrl: './auto-generate-number.css'
})
export class AutoGenerateNumberComponent {
    private readonly service = inject(AutoGenerateNumberService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: AutoGenerateNumber[] = [];

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingRefFunctionCode: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'refFunctionCode';
    sortDirection: 'asc' | 'desc' = 'asc';

    form = this.createEmptyForm();

    loadData(event?: TableLazyLoadEvent): void {
        if (event) {
            const rows = event.rows ?? this.pageSize;
            const first = event.first ?? 0;

            this.pageSize = rows;
            this.page = Math.floor(first / rows) + 1;

            if (event.sortField) {
                this.sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
            }

            if (event.sortOrder === -1) {
                this.sortDirection = 'desc';
            } else if (event.sortOrder === 1) {
                this.sortDirection = 'asc';
            }
        }

        this.loading = true;

        this.service
            .getPage({
                page: this.page,
                pageSize: this.pageSize,
                search: this.searchText,
                sortField: this.sortField,
                sortDirection: this.sortDirection
            })
            .subscribe({
                next: (result) => {
                    this.items = result.items ?? [];
                    this.totalRecords = result.totalCount ?? 0;
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;

                    this.showApiError(error, 'Unable to load auto generate numbers.');
                }
            });
    }

    search(): void {
        this.page = 1;
        this.loadData();
    }

    clearSearch(): void {
        this.searchText = '';
        this.page = 1;
        this.loadData();
    }

    refresh(): void {
        this.loadData();
    }

    openNew(): void {
        this.editingRefFunctionCode = null;
        this.submitted = false;
        this.form = this.createEmptyForm();
        this.dialogVisible = true;
    }

    edit(item: AutoGenerateNumber): void {
        this.editingRefFunctionCode = item.refFunctionCode;

        this.submitted = false;

        this.form = {
            refFunctionCode: item.refFunctionCode,
            refFunctionName: item.refFunctionName ?? '',
            prefix: item.prefix ?? '',
            suffix: item.suffix ?? '',
            minimumDigit: item.minimumDigit ?? null,
            initialNumber: item.initialNumber ?? null,
            currentNumber: item.currentNumber ?? null,
            isUseSubsidiary: item.isUseSubsidiary ?? false,
            isUseLocation: item.isUseLocation ?? false,
            isAllowOverride: item.isAllowOverride ?? false,
            note: item.note ?? '',
            isInactive: item.isInactive ?? false
        };

        this.dialogVisible = true;
    }

    hideDialog(): void {
        if (this.saving) {
            return;
        }

        this.dialogVisible = false;
        this.submitted = false;
    }

    save(): void {
        this.submitted = true;

        if (this.form.refFunctionCode == null || this.form.refFunctionCode <= 0) {
            return;
        }

        const request: CreateAutoGenerateNumberRequest = {
            refFunctionCode: this.form.refFunctionCode,

            refFunctionName: this.normalizeNullable(this.form.refFunctionName),

            prefix: this.normalizeNullable(this.form.prefix),

            suffix: this.normalizeNullable(this.form.suffix),

            minimumDigit: this.form.minimumDigit,
            initialNumber: this.form.initialNumber,
            currentNumber: this.form.currentNumber,

            isUseSubsidiary: this.form.isUseSubsidiary,

            isUseLocation: this.form.isUseLocation,

            isAllowOverride: this.form.isAllowOverride,

            note: this.normalizeNullable(this.form.note),

            isInactive: this.form.isInactive
        };

        this.saving = true;

        if (this.editingRefFunctionCode == null) {
            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Auto generate number created successfully.'
                    });

                    this.page = 1;
                    this.loadData();
                },
                error: (error) => {
                    this.saving = false;

                    this.showApiError(error, 'Unable to create auto generate number.');
                }
            });

            return;
        }

        const updateRequest: UpdateAutoGenerateNumberRequest = {
            ...request,

            // Keep the PK unchanged while editing.
            refFunctionCode: this.editingRefFunctionCode
        };

        this.service.update(this.editingRefFunctionCode, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Auto generate number updated successfully.'
                });

                this.loadData();
            },
            error: (error) => {
                this.saving = false;

                this.showApiError(error, 'Unable to update auto generate number.');
            }
        });
    }

    confirmDelete(item: AutoGenerateNumber): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Ref Function Code "${item.refFunctionCode}"?`,

            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',

            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.delete(item);
            }
        });
    }

    private delete(item: AutoGenerateNumber): void {
        this.service.delete(item.refFunctionCode).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Auto generate number deleted successfully.'
                });

                if (this.items.length === 1 && this.page > 1) {
                    this.page--;
                }

                this.loadData();
            },
            error: (error) => {
                this.showApiError(error, 'Unable to delete auto generate number.');
            }
        });
    }

    private createEmptyForm(): {
        refFunctionCode: number | null;
        refFunctionName: string;
        prefix: string;
        suffix: string;
        minimumDigit: number | null;
        initialNumber: number | null;
        currentNumber: number | null;
        isUseSubsidiary: boolean;
        isUseLocation: boolean;
        isAllowOverride: boolean;
        note: string;
        isInactive: boolean;
    } {
        return {
            refFunctionCode: null,
            refFunctionName: '',
            prefix: '',
            suffix: '',
            minimumDigit: 1,
            initialNumber: 1,
            currentNumber: 1,
            isUseSubsidiary: false,
            isUseLocation: false,
            isAllowOverride: false,
            note: '',
            isInactive: false
        };
    }

    private normalizeNullable(value?: string | null): string | null {
        const result = value?.trim();

        return result ? result : null;
    }

    private showApiError(error: any, fallbackMessage: string): void {
        const detail = error?.error?.message ?? error?.error?.title ?? fallbackMessage;

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail
        });
    }
}
