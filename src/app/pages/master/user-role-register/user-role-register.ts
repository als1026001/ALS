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

import { CreateUserRoleRegisterRequest, UpdateUserRoleRegisterRequest, UserRoleRegister } from '../../../core/models/user-role-register.model';

import { User } from '../../../core/models/user.model';
import { UserRole } from '../../../core/models/user-role.model';

import { UserRoleRegisterService } from '../../../core/services/user-role-register.service';
import { UserService } from '../../../core/services/user.service';
import { UserRoleService } from '../../../core/services/user-role.service';

@Component({
    selector: 'app-user-role-register',
    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputTextModule, SelectModule, TableModule, TextareaModule, ToastModule, TooltipModule],

    providers: [MessageService, ConfirmationService],

    templateUrl: './user-role-register.html',
    styleUrl: './user-role-register.css'
})
export class UserRoleRegisterComponent implements OnInit {
    private readonly service = inject(UserRoleRegisterService);

    private readonly userService = inject(UserService);

    private readonly userRoleService = inject(UserRoleService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: UserRoleRegister[] = [];

    users: User[] = [];
    roles: UserRole[] = [];

    loading = false;
    saving = false;

    userLoading = false;
    roleLoading = false;

    totalRecords = 0;

    rows = 20;
    first = 0;

    searchText = '';

    filterUserId: number | null = null;
    filterRoleId: number | null = null;

    sortField = 'userName';
    sortOrder = 1;

    dialogVisible = false;
    submitted = false;

    editingUserRoleId: number | null = null;

    form = this.createEmptyForm();

    ngOnInit(): void {
        this.loadUserLookup();
        this.loadRoleLookup();
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

                userId: this.filterUserId,
                roleId: this.filterRoleId,

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

                    this.showError(this.getErrorMessage(error, 'Unable to load user role registers.'));
                }
            });
    }

    search(): void {
        this.first = 0;
        this.loadData();
    }

    clearSearch(): void {
        this.searchText = '';

        this.filterUserId = null;
        this.filterRoleId = null;

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

        this.editingUserRoleId = null;

        this.form = this.createEmptyForm();

        this.dialogVisible = true;
    }

    edit(item: UserRoleRegister): void {
        this.submitted = false;

        this.editingUserRoleId = item.userRoleId;

        this.form = {
            userId: item.userId,
            roleId: item.roleId,

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

        if (!this.form.userId || !this.form.roleId) {
            return;
        }

        this.saving = true;

        if (this.editingUserRoleId === null) {
            const request: CreateUserRoleRegisterRequest = {
                userId: this.form.userId,
                roleId: this.form.roleId,

                note: this.normalizeString(this.form.note),

                isInactive: this.form.isInactive
            };

            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;

                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User Role Register created successfully.'
                    });

                    this.first = 0;

                    this.loadData();
                },

                error: (error) => {
                    this.saving = false;

                    this.showError(this.getErrorMessage(error, 'Unable to create user role register.'));
                }
            });

            return;
        }

        const request: UpdateUserRoleRegisterRequest = {
            userId: this.form.userId,
            roleId: this.form.roleId,

            note: this.normalizeString(this.form.note),

            isInactive: this.form.isInactive
        };

        this.service.update(this.editingUserRoleId, request).subscribe({
            next: () => {
                this.saving = false;

                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role Register updated successfully.'
                });

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.showError(this.getErrorMessage(error, 'Unable to update user role register.'));
            }
        });
    }

    confirmDelete(item: UserRoleRegister): void {
        const user = item.userName ?? item.userId.toString();

        const role = item.roleNo ?? item.roleId.toString();

        this.confirmationService.confirm({
            header: 'Delete User Role Register',

            icon: 'pi pi-exclamation-triangle',

            message: `Are you sure you want to delete role "${role}" from user "${user}"?`,

            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',

            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.deleteRegister(item);
            }
        });
    }

    private deleteRegister(item: UserRoleRegister): void {
        this.service.delete(item.userRoleId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role Register deleted successfully.'
                });

                if (this.items.length === 1 && this.first > 0) {
                    this.first = Math.max(0, this.first - this.rows);
                }

                this.loadData();
            },

            error: (error) => {
                this.showError(this.getErrorMessage(error, 'Unable to delete user role register.'));
            }
        });
    }

    private loadUserLookup(): void {
        this.userLoading = true;

        this.userService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'userName',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.users = (result.items ?? []).filter((x) => !x.isInactive);

                    this.userLoading = false;
                },

                error: (error) => {
                    this.userLoading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load users.'));
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

    private createEmptyForm() {
        return {
            userId: null as number | null,

            roleId: null as number | null,

            note: '',

            isInactive: false
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
