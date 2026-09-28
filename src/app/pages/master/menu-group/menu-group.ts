import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';

import { CreateMenuGroupRequest, MenuGroup, MenuGroupQuery, UpdateMenuGroupRequest } from '../../../core/models/menu-group.model';

import { MenuGroupService } from '../../../core/services/menu-group.service';

@Component({
    selector: 'app-menu-group',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, CheckboxModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './menu-group.html',
    styleUrl: './menu-group.css'
})
export class MenuGroupComponent implements OnInit {
    private readonly menuGroupService = inject(MenuGroupService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: MenuGroup[] = [];

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingMenuGroupId: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'menuGroupNo';
    sortDirection: 'asc' | 'desc' = 'asc';

    form: CreateMenuGroupRequest = this.createEmptyForm();

    ngOnInit(): void {
        // p-table lazy event performs the initial load.
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

        const query: MenuGroupQuery = {
            search: this.searchText?.trim() || undefined,

            sortField: this.sortField,

            sortDirection: this.sortDirection,

            page: this.page,

            pageSize: this.pageSize
        };

        this.loading = true;

        this.menuGroupService.getPage(query).subscribe({
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
                    detail: 'Unable to load menu groups.'
                });
            }
        });
    }

    // =========================================================
    // Search
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

    refresh(): void {
        this.loadData();
    }

    // =========================================================
    // New
    // =========================================================

    openNew(): void {
        this.editingMenuGroupId = null;
        this.submitted = false;

        this.form = this.createEmptyForm();

        this.dialogVisible = true;
    }

    // =========================================================
    // Edit
    // =========================================================

    edit(item: MenuGroup): void {
        this.editingMenuGroupId = item.menuGroupId;

        this.submitted = false;

        this.form = {
            menuGroupNo: item.menuGroupNo,

            menuGroupName: item.menuGroupName,

            note: item.note ?? null,

            isInactive: item.isInactive
        };

        this.dialogVisible = true;
    }

    // =========================================================
    // Save
    // =========================================================

    save(): void {
        this.submitted = true;

        if (!this.form.menuGroupNo?.trim() || !this.form.menuGroupName?.trim()) {
            return;
        }

        const request: CreateMenuGroupRequest = {
            menuGroupNo: this.form.menuGroupNo.trim(),

            menuGroupName: this.form.menuGroupName.trim(),

            note: this.normalizeNullable(this.form.note),

            isInactive: this.form.isInactive
        };

        this.saving = true;

        if (this.editingMenuGroupId == null) {
            this.menuGroupService.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Menu group created successfully.'
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

        const updateRequest: UpdateMenuGroupRequest = {
            ...request
        };

        this.menuGroupService.update(this.editingMenuGroupId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu group updated successfully.'
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

    confirmDelete(item: MenuGroup): void {
        this.confirmationService.confirm({
            message: `Delete menu group "${item.menuGroupName}" (${item.menuGroupNo})?`,

            header: 'Confirm Delete',

            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.delete(item);
            }
        });
    }

    private delete(item: MenuGroup): void {
        this.menuGroupService.delete(item.menuGroupId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu group deleted successfully.'
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

    private createEmptyForm(): CreateMenuGroupRequest {
        return {
            menuGroupNo: '',
            menuGroupName: '',
            note: '',
            isInactive: false
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
