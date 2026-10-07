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
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';

import { ListViewColumn, CreateListViewColumnRequest, UpdateListViewColumnRequest } from '../../../core/models/list-view-column.model';

import { ListViewColumnService } from '../../../core/services/list-view-column.service';

import { ListView } from '../../../core/models/list-view.model';
import { ListViewService } from '../../../core/services/list-view.service';

import { MenuField } from '../../../core/models/menu-field.model';
import { MenuFieldService } from '../../../core/services/menu-field.service';

@Component({
    selector: 'app-list-view-column',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, CheckboxModule, TooltipModule, SelectModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list-view-column.html',
    styleUrl: './list-view-column.css'
})
export class ListViewColumnComponent {
    private readonly service = inject(ListViewColumnService);
    private readonly listViewService = inject(ListViewService);
    private readonly menuFieldService = inject(MenuFieldService);

    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    constructor() {
        this.loadListViews();
    }

    items: ListViewColumn[] = [];

    listViews: ListView[] = [];
    fields: MenuField[] = [];

    loadingListViews = false;
    loadingFields = false;

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingViewColumnId: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'columnOrder';
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
                    this.showApiError(error, 'Unable to load list view columns.');
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
        this.editingViewColumnId = null;
        this.submitted = false;

        this.form = this.createEmptyForm();
        this.fields = [];

        if (this.listViews.length === 0) {
            this.loadListViews();
        }

        this.dialogVisible = true;
    }

    edit(item: ListViewColumn): void {
        this.editingViewColumnId = item.viewColumnId;
        this.submitted = false;

        this.form = {
            viewId: item.viewId,
            fieldId: item.fieldId,

            columnOrder: item.columnOrder ?? null,
            columnWidth: item.columnWidth ?? null,
            columnLabel: item.columnLabel ?? '',

            isVisible: item.isVisible ?? true,
            isSortable: item.isSortable ?? false,

            sortOrder: item.sortOrder ?? null,
            sortDirection: item.sortDirection ?? null,

            isFilterable: item.isFilterable ?? false,

            note: item.note ?? ''
        };

        const selectedView = this.listViews.find((x) => x.viewId === item.viewId);

        if (selectedView) {
            this.loadFieldsForMenu(selectedView.menuId, item.fieldId);
        } else {
            this.loadListViews(() => {
                const view = this.listViews.find((x) => x.viewId === item.viewId);

                if (view) {
                    this.loadFieldsForMenu(view.menuId, item.fieldId);
                }
            });
        }

        this.dialogVisible = true;
    }

    hideDialog(): void {
        if (this.saving) {
            return;
        }

        this.dialogVisible = false;
        this.submitted = false;
    }

    onViewChange(viewId: number | null): void {
        this.form.fieldId = null;
        this.fields = [];

        if (viewId == null || viewId <= 0) {
            return;
        }

        const selectedView = this.listViews.find((x) => x.viewId === viewId);

        if (!selectedView) {
            return;
        }

        this.loadFieldsForMenu(selectedView.menuId);
    }

    save(): void {
        this.submitted = true;

        if (this.form.viewId == null || this.form.viewId <= 0 || this.form.fieldId == null || this.form.fieldId <= 0) {
            return;
        }

        const request: CreateListViewColumnRequest = {
            viewId: this.form.viewId,
            fieldId: this.form.fieldId,

            columnOrder: this.form.columnOrder,
            columnWidth: this.form.columnWidth,

            columnLabel: this.normalizeNullable(this.form.columnLabel),

            isVisible: this.form.isVisible,
            isSortable: this.form.isSortable,

            sortOrder: this.form.sortOrder,
            sortDirection: this.form.sortDirection,

            isFilterable: this.form.isFilterable,

            note: this.normalizeNullable(this.form.note)
        };

        this.saving = true;

        if (this.editingViewColumnId == null) {
            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'List view column created successfully.'
                    });

                    this.page = 1;
                    this.loadData();
                },

                error: (error) => {
                    this.saving = false;

                    this.showApiError(error, 'Unable to create list view column.');
                }
            });

            return;
        }

        const updateRequest: UpdateListViewColumnRequest = {
            ...request
        };

        this.service.update(this.editingViewColumnId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'List view column updated successfully.'
                });

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.showApiError(error, 'Unable to update list view column.');
            }
        });
    }

    confirmDelete(item: ListViewColumn): void {
        const field = item.fieldName ?? item.fieldCode ?? item.fieldId.toString();

        this.confirmationService.confirm({
            message: `Are you sure you want to delete List View Column "${field}"?`,

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

    private delete(item: ListViewColumn): void {
        this.service.delete(item.viewColumnId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'List view column deleted successfully.'
                });

                if (this.items.length === 1 && this.page > 1) {
                    this.page--;
                }

                this.loadData();
            },

            error: (error) => {
                this.showApiError(error, 'Unable to delete list view column.');
            }
        });
    }

    loadListViews(completed?: () => void): void {
        this.loadingListViews = true;

        this.listViewService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'viewName',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.listViews = (result.items ?? []).filter((view) => view.isActive !== false);

                    this.loadingListViews = false;

                    completed?.();
                },

                error: (error) => {
                    this.loadingListViews = false;

                    this.showApiError(error, 'Unable to load list views.');
                }
            });
    }

    private loadFieldsForMenu(menuId: number, currentFieldId?: number | null): void {
        this.loadingFields = true;
        this.fields = [];

        this.menuFieldService
            .getPage({
                page: 1,
                pageSize: 200,
                menuId,
                sortField: 'fieldCode',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    const allFields = result.items ?? [];

                    this.fields = allFields.filter((field) => field.isAvailable || field.fieldId === currentFieldId);

                    this.loadingFields = false;
                },

                error: (error) => {
                    this.loadingFields = false;

                    this.showApiError(error, 'Unable to load menu fields.');
                }
            });
    }

    getViewDisplay(item: ListViewColumn): string {
        if (item.viewName && item.viewCode) {
            return `${item.viewName} (${item.viewCode})`;
        }

        return item.viewName ?? item.viewCode ?? item.viewId.toString();
    }

    getFieldDisplay(item: ListViewColumn): string {
        if (item.fieldName && item.fieldCode) {
            return `${item.fieldName} (${item.fieldCode})`;
        }

        return item.fieldName ?? item.fieldCode ?? item.fieldId.toString();
    }

    private createEmptyForm(): {
        viewId: number | null;
        fieldId: number | null;

        columnOrder: number | null;
        columnWidth: number | null;
        columnLabel: string;

        isVisible: boolean;
        isSortable: boolean;

        sortOrder: number | null;
        sortDirection: number | null;

        isFilterable: boolean;

        note: string;
    } {
        return {
            viewId: null,
            fieldId: null,

            columnOrder: null,
            columnWidth: null,
            columnLabel: '',

            isVisible: true,
            isSortable: false,

            sortOrder: null,
            sortDirection: null,

            isFilterable: false,

            note: ''
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
