import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

import { CreateMenuFieldRequest, MenuField, MenuFieldQuery, UpdateMenuFieldRequest } from '../../../core/models/menu-field.model';

import { MenuParentLookup } from '../../../core/models/menu-setup.model';

import { MenuFieldService } from '../../../core/services/menu-field.service';
import { MenuSetupService } from '../../../core/services/menu-setup.service';

@Component({
    selector: 'app-menu-field',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, SelectModule, CheckboxModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './menu-field.html',
    styleUrl: './menu-field.css'
})
export class MenuFieldComponent implements OnInit {
    private readonly menuFieldService = inject(MenuFieldService);
    private readonly menuSetupService = inject(MenuSetupService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    items: MenuField[] = [];
    menus: MenuParentLookup[] = [];

    totalRecords = 0;
    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingFieldId: number | null = null;

    searchText = '';
    selectedMenuId: number | null = null;

    page = 1;
    pageSize = 20;

    sortField = 'fieldCode';
    sortDirection: 'asc' | 'desc' = 'asc';

    form: CreateMenuFieldRequest = this.createEmptyForm();

    ngOnInit(): void {
        this.loadMenus();
    }

    // =========================================================
    // Menu lookup
    // =========================================================

    loadMenus(): void {
        this.menuSetupService.getParents().subscribe({
            next: (data) => {
                this.menus = data;
            },
            error: (error) => {
                console.error(error);

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to load menu list.'
                });
            }
        });
    }

    // =========================================================
    // Lazy table
    // =========================================================

    loadData(event?: TableLazyLoadEvent): void {
        if (event) {
            const first = event.first ?? 0;
            const rows = event.rows ?? this.pageSize;

            this.pageSize = rows;
            this.page = Math.floor(first / rows) + 1;

            if (event.sortField) {
                this.sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
            }

            this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';
        }

        const query: MenuFieldQuery = {
            search: this.searchText?.trim() || undefined,
            menuId: this.selectedMenuId,
            sortField: this.sortField,
            sortDirection: this.sortDirection,
            page: this.page,
            pageSize: this.pageSize
        };

        this.loading = true;

        this.menuFieldService.getPage(query).subscribe({
            next: (result) => {
                this.items = result.items;
                this.totalRecords = result.totalCount;
                this.loading = false;
            },
            error: (error) => {
                console.error(error);

                this.items = [];
                this.totalRecords = 0;
                this.loading = false;

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to load menu fields.'
                });
            }
        });
    }

    // =========================================================
    // Search / filter
    // =========================================================

    search(): void {
        this.page = 1;
        this.loadData();
    }

    clearSearch(): void {
        this.searchText = '';
        this.page = 1;
        this.loadData();
    }

    menuChanged(): void {
        this.page = 1;
        this.loadData();
    }

    refresh(): void {
        this.loadData();
    }

    // =========================================================
    // New
    // =========================================================

    openNew(): void {
        this.editingFieldId = null;
        this.submitted = false;

        this.form = this.createEmptyForm();

        if (this.selectedMenuId != null) {
            this.form.menuId = this.selectedMenuId;
        }

        this.dialogVisible = true;
    }

    // =========================================================
    // Edit
    // =========================================================

    edit(item: MenuField): void {
        this.editingFieldId = item.fieldId;
        this.submitted = false;

        this.form = {
            menuId: item.menuId,
            fieldCode: item.fieldCode,
            fieldName: item.fieldName,
            dataType: item.dataType ?? null,
            databaseField: item.databaseField ?? null,
            defaultLabel: item.defaultLabel ?? null,
            isAvailable: item.isAvailable
        };

        this.dialogVisible = true;
    }

    // =========================================================
    // Save
    // =========================================================

    save(): void {
        this.submitted = true;

        if (!this.form.menuId || !this.form.fieldCode?.trim() || !this.form.fieldName?.trim()) {
            return;
        }

        const request: CreateMenuFieldRequest = {
            menuId: this.form.menuId,
            fieldCode: this.form.fieldCode.trim(),
            fieldName: this.form.fieldName.trim(),
            dataType: this.normalizeNullable(this.form.dataType),
            databaseField: this.normalizeNullable(this.form.databaseField),
            defaultLabel: this.normalizeNullable(this.form.defaultLabel),
            isAvailable: this.form.isAvailable
        };

        this.saving = true;

        if (this.editingFieldId == null) {
            this.menuFieldService.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Menu field created successfully.'
                    });

                    this.loadData();
                },
                error: (error) => {
                    this.saving = false;
                    this.showApiError(error);
                }
            });

            return;
        }

        const updateRequest: UpdateMenuFieldRequest = {
            ...request
        };

        this.menuFieldService.update(this.editingFieldId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu field updated successfully.'
                });

                this.loadData();
            },
            error: (error) => {
                this.saving = false;
                this.showApiError(error);
            }
        });
    }

    // =========================================================
    // Delete
    // =========================================================

    confirmDelete(item: MenuField): void {
        this.confirmationService.confirm({
            message: `Delete field "${item.fieldName}" (${item.fieldCode})?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.delete(item);
            }
        });
    }

    private delete(item: MenuField): void {
        this.menuFieldService.delete(item.fieldId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu field deleted successfully.'
                });

                this.loadData();
            },
            error: (error) => {
                this.showApiError(error);
            }
        });
    }

    // =========================================================
    // Dialog
    // =========================================================

    hideDialog(): void {
        this.dialogVisible = false;
        this.submitted = false;
        this.saving = false;
    }

    // =========================================================
    // Helpers
    // =========================================================

    private createEmptyForm(): CreateMenuFieldRequest {
        return {
            menuId: 0,
            fieldCode: '',
            fieldName: '',
            dataType: 'string',
            databaseField: '',
            defaultLabel: '',
            isAvailable: true
        };
    }

    private normalizeNullable(value: string | null | undefined): string | null {
        const normalized = value?.trim();

        return normalized ? normalized : null;
    }

    private showApiError(error: any): void {
        console.error(error);

        const detail = error?.error?.message ?? error?.error?.detail ?? error?.message ?? 'An unexpected error occurred.';

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail
        });
    }
}
