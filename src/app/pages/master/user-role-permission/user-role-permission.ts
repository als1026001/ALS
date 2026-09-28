import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { CreateUserRolePermissionRequest, UpdateUserRolePermissionRequest, UserRolePermission } from '../../../core/models/user-role-permission.model';

import { UserRole } from '../../../core/models/user-role.model';
import { MenuSetup } from '../../../core/models/menu-setup.model';

import { UserRolePermissionService } from '../../../core/services/user-role-permission.service';
import { UserRoleService } from '../../../core/services/user-role.service';
import { MenuSetupService } from '../../../core/services/menu-setup.service';

@Component({
    selector: 'app-user-role-permission',
    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputTextModule, SelectModule, TableModule, TextareaModule, ToastModule, TooltipModule],

    providers: [MessageService, ConfirmationService],

    templateUrl: './user-role-permission.html',
    styleUrl: './user-role-permission.css'
})
export class UserRolePermissionComponent implements OnInit {
    private readonly service = inject(UserRolePermissionService);

    private readonly userRoleService = inject(UserRoleService);

    private readonly menuSetupService = inject(MenuSetupService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: UserRolePermission[] = [];

    roles: UserRole[] = [];
    menus: MenuSetup[] = [];

    loading = false;
    saving = false;

    roleLoading = false;
    menuLoading = false;

    totalRecords = 0;

    rows = 20;
    first = 0;

    searchText = '';

    filterRoleId: number | null = null;
    filterMenuId: number | null = null;

    sortField = 'roleNo';
    sortOrder = 1;

    dialogVisible = false;
    submitted = false;

    editingPermissionId: number | null = null;

    form = this.createEmptyForm();

    readonly permissionLevels = [
        {
            value: 1,
            label: '1 - View'
        },
        {
            value: 2,
            label: '2 - View + Create'
        },
        {
            value: 3,
            label: '3 - View + Create + Update'
        },
        {
            value: 4,
            label: '4 - Full Access'
        },
        {
            value: 9,
            label: '9 - Full Access (Administrator)'
        }
    ];

    ngOnInit(): void {
        this.loadRoleLookup();
        this.loadMenuLookup();
    }

    loadData(event?: TableLazyLoadEvent): void {
        this.loading = true;

        if (event) {
            this.first = event.first ?? 0;
            this.rows = event.rows ?? 20;

            if (typeof event.sortField === 'string') {
                this.sortField = event.sortField;
            }

            if (event.sortOrder === 1 || event.sortOrder === -1) {
                this.sortOrder = event.sortOrder;
            }
        }

        const page = Math.floor(this.first / this.rows) + 1;

        this.service
            .getPage({
                page,
                pageSize: this.rows,

                search: this.searchText.trim() || undefined,

                roleId: this.filterRoleId,

                menuId: this.filterMenuId,

                sortField: this.sortField,

                sortDirection: this.sortOrder === -1 ? 'desc' : 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.items = result.items ?? [];

                    this.totalRecords = result.totalCount ?? 0;

                    this.loading = false;
                },

                error: (error) => {
                    this.loading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load user role permissions.'));
                }
            });
    }

    search(): void {
        this.first = 0;
        this.loadData();
    }

    clearSearch(): void {
        this.searchText = '';
        this.filterRoleId = null;
        this.filterMenuId = null;
        this.first = 0;

        this.loadData();
    }

    refresh(): void {
        this.loadData();
    }

    onFilterChange(): void {
        this.first = 0;
        this.loadData();
    }

    openNew(): void {
        this.submitted = false;

        this.editingPermissionId = null;

        this.form = this.createEmptyForm();

        this.dialogVisible = true;
    }

    edit(item: UserRolePermission): void {
        this.submitted = false;

        this.editingPermissionId = item.permissionId;

        this.form = {
            roleId: item.roleId,

            menuId: item.menuId,

            levelId: item.levelId ?? 1,

            isInactive: item.isInactive ?? false,

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
    }

    save(): void {
        this.submitted = true;

        if (!this.form.roleId || !this.form.menuId || !this.form.levelId) {
            return;
        }

        this.saving = true;

        if (this.editingPermissionId === null) {
            const request: CreateUserRolePermissionRequest = {
                roleId: this.form.roleId,

                menuId: this.form.menuId,

                levelId: this.form.levelId,

                isInactive: this.form.isInactive,

                note: this.normalizeString(this.form.note)
            };

            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;

                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User Role Permission created successfully.'
                    });

                    this.first = 0;

                    this.loadData();
                },

                error: (error) => {
                    this.saving = false;

                    this.showError(this.getErrorMessage(error, 'Unable to create user role permission.'));
                }
            });

            return;
        }

        const request: UpdateUserRolePermissionRequest = {
            roleId: this.form.roleId,

            menuId: this.form.menuId,

            levelId: this.form.levelId,

            isInactive: this.form.isInactive,

            note: this.normalizeString(this.form.note)
        };

        this.service.update(this.editingPermissionId, request).subscribe({
            next: () => {
                this.saving = false;

                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role Permission updated successfully.'
                });

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.showError(this.getErrorMessage(error, 'Unable to update user role permission.'));
            }
        });
    }

    confirmDelete(item: UserRolePermission): void {
        const role = item.roleNo ?? item.roleId.toString();

        const menu = item.menuName ?? item.menuNo ?? item.menuId.toString();

        this.confirmationService.confirm({
            header: 'Delete User Role Permission',

            icon: 'pi pi-exclamation-triangle',

            message: `Are you sure you want to delete permission "${role} - ${menu}"?`,

            acceptLabel: 'Delete',

            rejectLabel: 'Cancel',

            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.deletePermission(item);
            }
        });
    }

    getPermissionLevelLabel(levelId: number | null | undefined): string {
        if (levelId == null) {
            return '-';
        }

        const option = this.permissionLevels.find((x) => x.value === levelId);

        if (option) {
            return option.label;
        }

        if (levelId >= 4) {
            return `${levelId} - Full Access`;
        }

        return levelId.toString();
    }

    private deletePermission(item: UserRolePermission): void {
        this.service.delete(item.permissionId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role Permission deleted successfully.'
                });

                if (this.items.length === 1 && this.first > 0) {
                    this.first = Math.max(0, this.first - this.rows);
                }

                this.loadData();
            },

            error: (error) => {
                this.showError(this.getErrorMessage(error, 'Unable to delete user role permission.'));
            }
        });
    }

    private loadRoleLookup(): void {
        this.roleLoading = true;

        this.userRoleService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'roleNo',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.roles = (result.items ?? []).filter((x) => !x.isInactive);

                    this.roleLoading = false;
                },

                error: (error) => {
                    this.roleLoading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load roles.'));
                }
            });
    }

    private loadMenuLookup(): void {
        this.menuLoading = true;

        this.menuSetupService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'menuName',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.menus = (result.items ?? []).filter((x) => !x.isInactive);

                    this.menuLoading = false;
                },

                error: (error) => {
                    this.menuLoading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load menus.'));
                }
            });
    }

    private createEmptyForm() {
        return {
            roleId: null as number | null,

            menuId: null as number | null,

            levelId: 1 as number | null,

            isInactive: false,

            note: ''
        };
    }

    private normalizeString(value: string | null | undefined): string | null {
        const normalized = value?.trim() ?? '';

        return normalized ? normalized : null;
    }

    private showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message
        });
    }

    private getErrorMessage(error: any, fallback: string): string {
        return error?.error?.message || error?.error?.detail || error?.message || fallback;
    }
}
