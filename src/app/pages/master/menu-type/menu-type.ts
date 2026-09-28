import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { CreateMenuTypeRequest, MenuType, UpdateMenuTypeRequest } from '../../../core/models/menu-type.model';

import { MenuTypeService } from '../../../core/services/menu-type.service';

@Component({
    selector: 'app-menu-type',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, CheckboxModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './menu-type.html',
    styleUrl: './menu-type.css'
})
export class MenuTypeComponent {
    private readonly menuTypeService = inject(MenuTypeService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: MenuType[] = [];

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingMenuTypeId: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'menuTypeNo';
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

        this.menuTypeService
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
                    this.showApiError(error, 'Unable to load menu types.');
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
        this.editingMenuTypeId = null;
        this.submitted = false;
        this.form = this.createEmptyForm();
        this.dialogVisible = true;
    }

    edit(item: MenuType): void {
        this.editingMenuTypeId = item.menuTypeId;

        this.submitted = false;

        this.form = {
            menuTypeNo: item.menuTypeNo ?? '',

            menuTypeName: item.menuTypeName ?? '',

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

        const menuTypeNo = this.form.menuTypeNo.trim();

        if (!menuTypeNo) {
            return;
        }

        const request: CreateMenuTypeRequest = {
            menuTypeNo,
            menuTypeName: this.normalizeNullable(this.form.menuTypeName),
            note: this.normalizeNullable(this.form.note),
            isInactive: this.form.isInactive
        };

        this.saving = true;

        if (this.editingMenuTypeId == null) {
            this.menuTypeService.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Menu type created successfully.'
                    });

                    this.page = 1;
                    this.loadData();
                },
                error: (error) => {
                    this.saving = false;
                    this.showApiError(error, 'Unable to create menu type.');
                }
            });

            return;
        }

        const updateRequest: UpdateMenuTypeRequest = {
            ...request
        };

        this.menuTypeService.update(this.editingMenuTypeId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu type updated successfully.'
                });

                this.loadData();
            },
            error: (error) => {
                this.saving = false;
                this.showApiError(error, 'Unable to update menu type.');
            }
        });
    }

    confirmDelete(item: MenuType): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Menu Type "${item.menuTypeNo}"?`,
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

    private delete(item: MenuType): void {
        this.menuTypeService.delete(item.menuTypeId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu type deleted successfully.'
                });

                if (this.items.length === 1 && this.page > 1) {
                    this.page--;
                }

                this.loadData();
            },
            error: (error) => {
                this.showApiError(error, 'Unable to delete menu type.');
            }
        });
    }

    private createEmptyForm(): {
        menuTypeNo: string;
        menuTypeName: string;
        note: string;
        isInactive: boolean;
    } {
        return {
            menuTypeNo: '',
            menuTypeName: '',
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
