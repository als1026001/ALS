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

import { User, CreateUserRequest, UpdateUserRequest } from '../../../core/models/user.model';

import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, ConfirmDialogModule, DialogModule, InputTextModule, TableModule, TextareaModule, ToastModule, CheckboxModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './user.html',
    styleUrl: './user.css'
})
export class UserComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    users: User[] = [];

    loading = false;
    saving = false;

    totalRecords = 0;
    rows = 20;
    first = 0;

    searchText = '';

    sortField = 'userName';
    sortOrder = 1;

    dialogVisible = false;
    submitted = false;

    editingUserId: number | null = null;

    form = this.createEmptyForm();

    ngOnInit(): void {
        // p-table lazy event will load the data.
    }

    loadUsers(event?: TableLazyLoadEvent): void {
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

        this.userService
            .getPage({
                page,
                pageSize: this.rows,
                search: this.searchText.trim() || undefined,
                sortField: this.sortField,
                sortDirection: this.sortOrder === -1 ? 'desc' : 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.users = result.items;
                    this.totalRecords = result.totalCount;
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.showError(this.getErrorMessage(error, 'Unable to load users.'));
                }
            });
    }

    search(): void {
        this.first = 0;
        this.loadUsers();
    }

    clearSearch(): void {
        if (!this.searchText) {
            return;
        }

        this.searchText = '';
        this.first = 0;
        this.loadUsers();
    }

    refresh(): void {
        this.loadUsers();
    }

    openNew(): void {
        this.submitted = false;
        this.editingUserId = null;
        this.form = this.createEmptyForm();
        this.dialogVisible = true;
    }

    editUser(user: User): void {
        this.submitted = false;
        this.editingUserId = user.userId;

        this.form = {
            userName: user.userName ?? '',
            displayName: user.displayName ?? '',

            // Never populate an existing password/hash.
            password: '',

            userGroupId: user.userGroupId ?? null,
            manageByUserId: user.manageByUserId ?? null,

            isInactive: user.isInactive ?? false,
            isAllowAccess: user.isAllowAccess ?? true,
            isInheritIpRule: user.isInheritIpRule ?? false,

            isPasswordRenewByDayInterval: user.isPasswordRenewByDayInterval ?? false,

            passwordRenewDayInterval: user.passwordRenewDayInterval ?? null,

            isSendAccessNotificationEmail: user.isSendAccessNotificationEmail ?? false,

            note: user.note ?? ''
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

        const userName = this.form.userName.trim();

        if (!userName) {
            return;
        }

        if (this.editingUserId === null && !this.form.password.trim()) {
            return;
        }

        this.saving = true;

        if (this.editingUserId === null) {
            const request: CreateUserRequest = {
                userName,
                displayName: this.normalizeString(this.form.displayName),

                password: this.form.password,

                userGroupId: this.form.userGroupId,
                manageByUserId: this.form.manageByUserId,

                isInactive: this.form.isInactive,
                isAllowAccess: this.form.isAllowAccess,
                isInheritIpRule: this.form.isInheritIpRule,

                isPasswordRenewByDayInterval: this.form.isPasswordRenewByDayInterval,

                passwordRenewDayInterval: this.form.isPasswordRenewByDayInterval ? this.form.passwordRenewDayInterval : null,

                isSendAccessNotificationEmail: this.form.isSendAccessNotificationEmail,

                note: this.normalizeString(this.form.note)
            };

            this.userService.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User created successfully.'
                    });

                    this.first = 0;
                    this.loadUsers();
                },
                error: (error) => {
                    this.saving = false;

                    this.showError(this.getErrorMessage(error, 'Unable to create user.'));
                }
            });

            return;
        }

        const request: UpdateUserRequest = {
            userName,
            displayName: this.normalizeString(this.form.displayName),

            // Blank means preserve current password.
            password: this.form.password.trim() ? this.form.password : '',

            userGroupId: this.form.userGroupId,
            manageByUserId: this.form.manageByUserId,

            isInactive: this.form.isInactive,
            isAllowAccess: this.form.isAllowAccess,
            isInheritIpRule: this.form.isInheritIpRule,

            isPasswordRenewByDayInterval: this.form.isPasswordRenewByDayInterval,

            passwordRenewDayInterval: this.form.isPasswordRenewByDayInterval ? this.form.passwordRenewDayInterval : null,

            isSendAccessNotificationEmail: this.form.isSendAccessNotificationEmail,

            note: this.normalizeString(this.form.note)
        };

        this.userService.update(this.editingUserId, request).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User updated successfully.'
                });

                this.loadUsers();
            },
            error: (error) => {
                this.saving = false;

                this.showError(this.getErrorMessage(error, 'Unable to update user.'));
            }
        });
    }

    confirmDelete(user: User): void {
        this.confirmationService.confirm({
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            message: `Are you sure you want to delete user "${user.userName}"?`,
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.deleteUser(user);
            }
        });
    }

    private deleteUser(user: User): void {
        this.userService.delete(user.userId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User deleted successfully.'
                });

                if (this.users.length === 1 && this.first > 0) {
                    this.first = Math.max(0, this.first - this.rows);
                }

                this.loadUsers();
            },
            error: (error) => {
                this.showError(this.getErrorMessage(error, 'Unable to delete user.'));
            }
        });
    }

    private createEmptyForm() {
        return {
            userName: '',
            displayName: '',
            password: '',

            userGroupId: null as number | null,
            manageByUserId: null as number | null,

            isInactive: false,
            isAllowAccess: false,
            isInheritIpRule: false,

            isPasswordRenewByDayInterval: false,
            passwordRenewDayInterval: null as number | null,

            isSendAccessNotificationEmail: false,

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
