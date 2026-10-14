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

import { ListView, CreateListViewRequest, UpdateListViewRequest } from '../../../core/models/list-view.model';

import { ListViewService } from '../../../core/services/list-view.service';

import { MenuSetup } from '../../../core/models/menu-setup.model';
import { MenuSetupService } from '../../../core/services/menu-setup.service';

@Component({
    selector: 'app-list-view',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, CheckboxModule, TooltipModule, SelectModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './list-view.html',
    styleUrl: './list-view.css'
})
export class ListViewComponent implements OnInit {
    private readonly service = inject(ListViewService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly menuSetupService = inject(MenuSetupService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    constructor() {
        this.loadMenus();
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            const id = Number(params.get('id'));

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            this.openListViewFromCenterSearch(id);
        });
    }

    items: ListView[] = [];

    menus: MenuSetup[] = [];
    loadingMenus = false;

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingViewId: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'viewCode';
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

                    this.showApiError(error, 'Unable to load list views.');
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
        this.editingViewId = null;
        this.submitted = false;
        this.form = this.createEmptyForm();

        if (this.menus.length === 0) {
            this.loadMenus();
        }

        this.dialogVisible = true;
    }

    private openListViewFromCenterSearch(viewId: number): void {
        this.service.getById(viewId).subscribe({
            next: (item) => {
                if (!item) {
                    return;
                }

                this.edit(item);
            },

            error: (error) => {
                console.error('Unable to load List View from Center Search.', error);

                this.showApiError(error, 'Unable to load List View.');
            }
        });
    }

    edit(item: ListView): void {
        // Load menu list for dropdown if it has not been loaded yet
        if (this.menus.length === 0) {
            this.loadMenus();
        }

        this.editingViewId = item.viewId;
        this.submitted = false;

        this.form = {
            menuId: item.menuId,
            viewCode: item.viewCode ?? '',
            viewName: item.viewName ?? '',
            isDefault: item.isDefault ?? false,
            isSystem: item.isSystem ?? false,
            isPublic: item.isPublic ?? false,
            isActive: item.isActive ?? true,
            note: item.note ?? ''
        };

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

    save(): void {
        this.submitted = true;

        const viewCode = this.form.viewCode.trim();
        const viewName = this.form.viewName.trim();

        if (this.form.menuId == null || this.form.menuId <= 0 || !viewCode || !viewName) {
            return;
        }

        const request: CreateListViewRequest = {
            menuId: this.form.menuId,
            viewCode,
            viewName,
            isDefault: this.form.isDefault,
            isSystem: this.form.isSystem,
            isPublic: this.form.isPublic,
            isActive: this.form.isActive,
            note: this.normalizeNullable(this.form.note)
        };

        this.saving = true;

        if (this.editingViewId == null) {
            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'List view created successfully.'
                    });

                    this.page = 1;
                    this.loadData();
                },

                error: (error) => {
                    this.saving = false;

                    this.showApiError(error, 'Unable to create list view.');
                }
            });

            return;
        }

        const updateRequest: UpdateListViewRequest = {
            ...request
        };

        this.service.update(this.editingViewId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'List view updated successfully.'
                });

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.showApiError(error, 'Unable to update list view.');
            }
        });
    }

    confirmDelete(item: ListView): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete List View "${item.viewCode}"?`,

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

    private delete(item: ListView): void {
        this.service.delete(item.viewId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'List view deleted successfully.'
                });

                if (this.items.length === 1 && this.page > 1) {
                    this.page--;
                }

                this.loadData();
            },

            error: (error) => {
                this.showApiError(error, 'Unable to delete list view.');
            }
        });
    }

    private createEmptyForm(): {
        menuId: number | null;
        viewCode: string;
        viewName: string;
        isDefault: boolean;
        isSystem: boolean;
        isPublic: boolean;
        isActive: boolean;
        note: string;
    } {
        return {
            menuId: null,
            viewCode: '',
            viewName: '',
            isDefault: false,
            isSystem: false,
            isPublic: false,
            isActive: true,
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

    loadMenus(): void {
        this.loadingMenus = true;

        this.menuSetupService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'menuName',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.menus = (result.items ?? []).filter((menu) => !menu.isInactive);

                    this.loadingMenus = false;
                },

                error: (error) => {
                    this.loadingMenus = false;

                    this.showApiError(error, 'Unable to load menus.');
                }
            });
    }

    getMenuDisplay(menuId: number): string {
        const menu = this.menus.find((x) => x.menuId === menuId);

        if (!menu) {
            return menuId.toString();
        }

        return `${menu.menuName} (${menu.menuNo})`;
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
