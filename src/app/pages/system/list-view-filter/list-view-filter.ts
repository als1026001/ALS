import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

import { ListViewFilter, ListViewFilterTypeOption, CreateListViewFilterRequest, UpdateListViewFilterRequest } from '../../../core/models/list-view-filter.model';

import { ListViewFilterService } from '../../../core/services/list-view-filter.service';

import { ListView } from '../../../core/models/list-view.model';
import { ListViewService } from '../../../core/services/list-view.service';

import { MenuField } from '../../../core/models/menu-field.model';
import { MenuFieldService } from '../../../core/services/menu-field.service';

@Component({
    selector: 'app-list-view-filter',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, CheckboxModule, TooltipModule, SelectModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list-view-filter.html',
    styleUrl: './list-view-filter.css'
})
export class ListViewFilterComponent implements OnInit {
    private readonly service = inject(ListViewFilterService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly listViewService = inject(ListViewService);
    private readonly menuFieldService = inject(MenuFieldService);

    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    constructor() {
        this.loadListViews();
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            const id = Number(params.get('id'));

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            this.openListViewFilterFromCenterSearch(id);
        });
    }

    items: ListViewFilter[] = [];

    listViews: ListView[] = [];
    fields: MenuField[] = [];

    readonly filterTypes: ListViewFilterTypeOption[] = [
        { label: 'Text', value: 1 },
        { label: 'Number', value: 2 },
        { label: 'Date', value: 3 },
        { label: 'Date Time', value: 4 },
        { label: 'Boolean', value: 5 },
        { label: 'Select', value: 6 },
        { label: 'Multi Select', value: 7 }
    ];

    loadingListViews = false;
    loadingFields = false;

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingViewFilterId: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'filterOrder';
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
                    this.showApiError(error, 'Unable to load list view filters.');
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
        this.editingViewFilterId = null;
        this.submitted = false;

        this.form = this.createEmptyForm();
        this.fields = [];

        if (this.listViews.length === 0) {
            this.loadListViews();
        }

        this.dialogVisible = true;
    }

    private openListViewFilterFromCenterSearch(viewFilterId: number): void {
        this.service.getById(viewFilterId).subscribe({
            next: (item) => {
                if (!item) {
                    return;
                }

                this.edit(item);
            },

            error: (error) => {
                console.error('Unable to load List View Filter from Center Search.', error);

                this.showApiError(error, 'Unable to load List View Filter.');
            }
        });
    }

    edit(item: ListViewFilter): void {
        this.editingViewFilterId = item.viewFilterId;
        this.submitted = false;

        this.form = {
            viewId: item.viewId,
            fieldId: item.fieldId,

            filterOrder: item.filterOrder,
            filterType: item.filterType ?? null,

            defaultValue: item.defaultValue ?? '',

            isVisible: item.isVisible ?? true
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

        this.clearCenterSearchId();
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

        if (this.form.viewId == null || this.form.viewId <= 0 || this.form.fieldId == null || this.form.fieldId <= 0 || this.form.filterOrder == null || this.form.filterOrder <= 0) {
            return;
        }

        const request: CreateListViewFilterRequest = {
            viewId: this.form.viewId,
            fieldId: this.form.fieldId,

            filterOrder: this.form.filterOrder,
            filterType: this.form.filterType,

            defaultValue: this.normalizeNullable(this.form.defaultValue),

            isVisible: this.form.isVisible
        };

        this.saving = true;

        if (this.editingViewFilterId == null) {
            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'List view filter created successfully.'
                    });

                    this.page = 1;
                    this.loadData();
                },

                error: (error) => {
                    this.saving = false;

                    this.showApiError(error, 'Unable to create list view filter.');
                }
            });

            return;
        }

        const updateRequest: UpdateListViewFilterRequest = {
            ...request
        };

        this.service.update(this.editingViewFilterId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'List view filter updated successfully.'
                });

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.showApiError(error, 'Unable to update list view filter.');
            }
        });
    }

    confirmDelete(item: ListViewFilter): void {
        const field = item.fieldName ?? item.fieldCode ?? item.fieldId.toString();

        this.confirmationService.confirm({
            message: `Are you sure you want to delete List View Filter "${field}"?`,

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

    private delete(item: ListViewFilter): void {
        this.service.delete(item.viewFilterId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'List view filter deleted successfully.'
                });

                if (this.items.length === 1 && this.page > 1) {
                    this.page--;
                }

                this.loadData();
            },

            error: (error) => {
                this.showApiError(error, 'Unable to delete list view filter.');
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

    getViewDisplay(item: ListViewFilter): string {
        if (item.viewName && item.viewCode) {
            return `${item.viewName} (${item.viewCode})`;
        }

        return item.viewName ?? item.viewCode ?? item.viewId.toString();
    }

    getFieldDisplay(item: ListViewFilter): string {
        if (item.fieldName && item.fieldCode) {
            return `${item.fieldName} (${item.fieldCode})`;
        }

        return item.fieldName ?? item.fieldCode ?? item.fieldId.toString();
    }

    getFilterTypeDisplay(filterType?: number | null): string {
        if (filterType == null) {
            return '';
        }

        return this.filterTypes.find((x) => x.value === filterType)?.label ?? filterType.toString();
    }

    private createEmptyForm(): {
        viewId: number | null;
        fieldId: number | null;

        filterOrder: number | null;
        filterType: number | null;

        defaultValue: string;

        isVisible: boolean;
    } {
        return {
            viewId: null,
            fieldId: null,

            filterOrder: 1,
            filterType: 1,

            defaultValue: '',

            isVisible: true
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

    private clearCenterSearchId(): void {
        if (!this.route.snapshot.queryParamMap.has('id')) {
            return;
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
