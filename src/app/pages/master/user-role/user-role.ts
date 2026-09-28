import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';

import { ConfirmationService, MessageService } from 'primeng/api';

import { UserRole, CreateUserRoleRequest, UpdateUserRoleRequest } from '../../../core/models/user-role.model';

import { UserRoleService } from '../../../core/services/user-role.service';

@Component({
    selector: 'app-user-role',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ConfirmDialogModule, DialogModule, InputTextModule, TableModule, TextareaModule, ToastModule, CheckboxModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './user-role.html',
    styleUrl: './user-role.css'
})
export class UserRoleComponent implements OnInit {
    private readonly userRoleService = inject(UserRoleService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    roles: UserRole[] = [];

    loading = false;
    saving = false;

    totalRecords = 0;
    rows = 20;
    first = 0;

    searchText = '';

    sortField = 'roleNo';
    sortOrder = 1;

    dialogVisible = false;
    submitted = false;

    editingRoleId: number | null = null;

    form = this.createEmptyForm();

    ngOnInit(): void {
        // p-table lazy event will load the data.
    }

    loadRoles(event?: TableLazyLoadEvent): void {
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

        this.userRoleService
            .getPage({
                page,
                pageSize: this.rows,
                search: this.searchText.trim() || undefined,
                sortField: this.sortField,
                sortDirection: this.sortOrder === -1 ? 'desc' : 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.roles = result.items;
                    this.totalRecords = result.totalCount;

                    this.loading = false;
                },

                error: (error) => {
                    this.loading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load user roles.'));
                }
            });
    }

    search(): void {
        this.first = 0;
        this.loadRoles();
    }

    clearSearch(): void {
        if (!this.searchText) {
            return;
        }

        this.searchText = '';
        this.first = 0;

        this.loadRoles();
    }

    refresh(): void {
        this.loadRoles();
    }

    openNew(): void {
        this.submitted = false;
        this.editingRoleId = null;
        this.form = this.createEmptyForm();

        this.dialogVisible = true;
    }

    editRole(role: UserRole): void {
        this.submitted = false;
        this.editingRoleId = role.roleId;

        this.form = {
            roleNo: role.roleNo ?? '',
            roleName: role.roleName ?? '',

            roleTypeId: role.roleTypeId ?? null,

            isSingleSignOnOnly: role.isSingleSignOnOnly ?? false,

            isWebServiceRoleOnly: role.isWebServiceRoleOnly ?? false,

            isRestrictRoleByDeviceId: role.isRestrictRoleByDeviceId ?? false,

            isRestrictRoleByIpAddress: role.isRestrictRoleByIpAddress ?? false,

            twoFactorAuthenticationModeId: role.twoFactorAuthenticationModeId ?? null,

            durationOfTrustedDeviceModeId: role.durationOfTrustedDeviceModeId ?? null,

            isInactive: role.isInactive ?? false,

            note: role.note ?? ''
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

        const roleNo = this.form.roleNo.trim();

        const roleName = this.form.roleName.trim();

        if (!roleNo || !roleName) {
            return;
        }

        this.saving = true;

        if (this.editingRoleId === null) {
            const request: CreateUserRoleRequest = {
                roleNo,
                roleName,

                roleTypeId: this.form.roleTypeId,

                isSingleSignOnOnly: this.form.isSingleSignOnOnly,

                isWebServiceRoleOnly: this.form.isWebServiceRoleOnly,

                isRestrictRoleByDeviceId: this.form.isRestrictRoleByDeviceId,

                isRestrictRoleByIpAddress: this.form.isRestrictRoleByIpAddress,

                twoFactorAuthenticationModeId: this.form.twoFactorAuthenticationModeId,

                durationOfTrustedDeviceModeId: this.form.durationOfTrustedDeviceModeId,

                isInactive: this.form.isInactive,

                note: this.normalizeString(this.form.note)
            };

            this.userRoleService.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User Role created successfully.'
                    });

                    this.first = 0;
                    this.loadRoles();
                },

                error: (error) => {
                    this.saving = false;

                    this.showError(this.getErrorMessage(error, 'Unable to create user role.'));
                }
            });

            return;
        }

        const request: UpdateUserRoleRequest = {
            roleNo,
            roleName,

            roleTypeId: this.form.roleTypeId,

            isSingleSignOnOnly: this.form.isSingleSignOnOnly,

            isWebServiceRoleOnly: this.form.isWebServiceRoleOnly,

            isRestrictRoleByDeviceId: this.form.isRestrictRoleByDeviceId,

            isRestrictRoleByIpAddress: this.form.isRestrictRoleByIpAddress,

            twoFactorAuthenticationModeId: this.form.twoFactorAuthenticationModeId,

            durationOfTrustedDeviceModeId: this.form.durationOfTrustedDeviceModeId,

            isInactive: this.form.isInactive,

            note: this.normalizeString(this.form.note)
        };

        this.userRoleService.update(this.editingRoleId, request).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role updated successfully.'
                });

                this.loadRoles();
            },

            error: (error) => {
                this.saving = false;

                this.showError(this.getErrorMessage(error, 'Unable to update user role.'));
            }
        });
    }

    confirmDelete(role: UserRole): void {
        this.confirmationService.confirm({
            header: 'Delete User Role',
            icon: 'pi pi-exclamation-triangle',

            message: `Are you sure you want to delete role "${role.roleNo}"?`,

            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',

            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.deleteRole(role);
            }
        });
    }

    private deleteRole(role: UserRole): void {
        this.userRoleService.delete(role.roleId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role deleted successfully.'
                });

                if (this.roles.length === 1 && this.first > 0) {
                    this.first = Math.max(0, this.first - this.rows);
                }

                this.loadRoles();
            },

            error: (error) => {
                this.showError(this.getErrorMessage(error, 'Unable to delete user role.'));
            }
        });
    }

    private createEmptyForm() {
        return {
            roleNo: '',
            roleName: '',

            roleTypeId: 1 as number | null,

            isSingleSignOnOnly: false,
            isWebServiceRoleOnly: false,

            isRestrictRoleByDeviceId: false,
            isRestrictRoleByIpAddress: false,

            twoFactorAuthenticationModeId: null as number | null,

            durationOfTrustedDeviceModeId: null as number | null,

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
