import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { CreateMenuSetupRequest, MenuParentLookup, MenuSetup, UpdateMenuSetupRequest } from '../../../core/models/menu-setup.model';

import { MenuSetupService } from '../../../core/services/menu-setup.service';

@Component({
    selector: 'app-menu-setup',

    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputNumberModule, InputTextModule, SelectModule, TableModule, ToastModule],

    providers: [MessageService, ConfirmationService],

    templateUrl: './menu-setup.html',
    styleUrl: './menu-setup.css'
})
export class MenuSetupPage implements OnInit {
    private readonly service = inject(MenuSetupService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: MenuSetup[] = [];

    parentMenus: MenuParentLookup[] = [];

    totalRecords = 0;

    loading = false;

    parentLoading = false;

    page = 1;

    pageSize = 20;

    search = '';

    sortField = 'seqNo';

    sortDirection: 'asc' | 'desc' = 'asc';

    dialogVisible = false;

    submitted = false;

    editingId: number | null = null;

    form = this.createEmptyForm();

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        this.service
            .getPage({
                page: this.page,
                pageSize: this.pageSize,
                search: this.search,
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
                    console.error('Unable to load Menu Setup.', error);

                    this.items = [];

                    this.totalRecords = 0;

                    this.loading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Unable to load Menu Setup.'
                    });
                }
            });
    }

    loadParentMenus(excludeMenuId?: number | null): void {
        this.parentLoading = true;

        this.service.getParents(excludeMenuId).subscribe({
            next: (result) => {
                this.parentMenus = result ?? [];

                this.parentLoading = false;
            },

            error: (error) => {
                console.error('Unable to load Parent Menu.', error);

                this.parentMenus = [];

                this.parentLoading = false;

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to load Parent Menu.'
                });
            }
        });
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = event.first ?? 0;

        const rows = event.rows ?? this.pageSize;

        this.pageSize = rows;

        this.page = Math.floor(first / rows) + 1;

        if (event.sortField) {
            this.sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
        }

        if (event.sortOrder) {
            this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';
        }

        this.loadData();
    }

    searchData(): void {
        this.page = 1;

        this.loadData();
    }

    refresh(): void {
        this.search = '';

        this.page = 1;

        this.sortField = 'seqNo';

        this.sortDirection = 'asc';

        this.loadData();
    }

    openNew(): void {
        this.editingId = null;

        this.submitted = false;

        this.form = this.createEmptyForm();

        this.loadParentMenus();

        this.dialogVisible = true;
    }

    edit(item: MenuSetup): void {
        this.editingId = item.menuId;

        this.submitted = false;

        this.form = {
            menuNo: item.menuNo ?? '',

            menuName: item.menuName ?? '',

            parentMenuId: item.parentMenuId ?? null,

            seqNo: item.seqNo ?? 1,

            menuTypeId: item.menuTypeId ?? 1,

            icon: item.icon ?? '',

            routerLink: item.routerLink ?? '',

            menuUrl: item.menuUrl ?? '',

            isInactive: item.isInactive,

            isVisible: item.isVisible,

            isSecurity: item.isSecurity,

            isExternal: item.isExternal,

            target: item.target ?? '',

            permissionCode: item.permissionCode ?? '',

            note: item.note ?? ''
        };

        // Do not allow the menu itself
        // to appear as its own parent.
        this.loadParentMenus(item.menuId);

        this.dialogVisible = true;
    }

    save(): void {
        this.submitted = true;

        if (!this.form.menuNo.trim() || !this.form.menuName.trim()) {
            return;
        }

        const request = {
            menuNo: this.form.menuNo,

            menuName: this.form.menuName,

            parentMenuId: this.form.parentMenuId,

            seqNo: this.form.seqNo || 1,

            menuTypeId: this.form.menuTypeId || 1,

            icon: this.normalizeNullable(this.form.icon),

            routerLink: this.normalizeNullable(this.form.routerLink),

            menuUrl: this.normalizeNullable(this.form.menuUrl),

            isInactive: this.form.isInactive,

            isVisible: this.form.isVisible,

            isSecurity: this.form.isSecurity,

            isExternal: this.form.isExternal,

            target: this.normalizeNullable(this.form.target),

            permissionCode: this.normalizeNullable(this.form.permissionCode),

            note: this.normalizeNullable(this.form.note)
        };

        if (this.editingId == null) {
            this.create(request);

            return;
        }

        this.update(this.editingId, request);
    }

    delete(item: MenuSetup): void {
        this.confirmationService.confirm({
            message: `Delete '${item.menuName}'?`,

            header: 'Confirm Delete',

            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.service.delete(item.menuId).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Menu deleted.'
                        });

                        this.loadData();
                    },

                    error: (error) => {
                        console.error('Delete Menu failed.', error);

                        const detail = error?.error?.message ?? 'Unable to delete Menu.';

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail
                        });
                    }
                });
            }
        });
    }

    getParentName(item: MenuSetup): string {
        if (!item.parentMenuId) {
            return 'Root';
        }

        return item.parentMenuName ?? item.parentMenuNo ?? '-';
    }

    private create(request: CreateMenuSetupRequest): void {
        this.service.create(request).subscribe({
            next: () => {
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu created.'
                });

                this.loadData();
            },

            error: (error) => {
                this.handleSaveError(error);
            }
        });
    }

    private update(menuId: number, request: UpdateMenuSetupRequest): void {
        this.service.update(menuId, request).subscribe({
            next: () => {
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Menu updated.'
                });

                this.loadData();
            },

            error: (error) => {
                this.handleSaveError(error);
            }
        });
    }

    private createEmptyForm() {
        return {
            menuNo: '',
            menuName: '',

            parentMenuId: null as number | null,

            seqNo: 1,

            menuTypeId: 1,

            icon: '',

            routerLink: '',

            menuUrl: '',

            isInactive: false,

            isVisible: true,

            isSecurity: true,

            isExternal: false,

            target: '',

            permissionCode: '',

            note: ''
        };
    }

    private handleSaveError(error: any): void {
        console.error('Save Menu failed.', error);

        let detail = error?.error?.message ?? 'Unable to save Menu.';

        if (error?.status === 409) {
            detail = 'Menu No or Router Link already exists.';
        }

        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail
        });
    }

    private normalizeNullable(value: string): string | null {
        const result = value?.trim();

        return result ? result : null;
    }
}
