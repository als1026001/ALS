import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { ConfirmationService, MessageService } from 'primeng/api';

import { CreateExpenseCategoryRequest, ExpenseCategory, FinancialAccountLookup, UpdateExpenseCategoryRequest } from '../../../core/models/expense-category.model';

import { ExpenseCategoryService } from '../../../core/services/expense-category.service';
import { PermissionService } from '../../../core/services/permission.service';

interface ExpenseCategoryForm {
    expenseNo: string;
    expenseName: string;
    accountId: number | null;
    note: string;
    isInactive: boolean;
}

@Component({
    selector: 'app-expense-category',

    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputTextModule, SelectModule, TableModule, ToastModule, ToolbarModule],

    providers: [MessageService, ConfirmationService],

    templateUrl: './expense-category.html'
})
export class ExpenseCategoryPage implements OnInit {
    private readonly service = inject(ExpenseCategoryService);

    private readonly permissionService = inject(PermissionService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    readonly permissionRoute = '/index';

    items: ExpenseCategory[] = [];

    accounts: FinancialAccountLookup[] = [];

    totalRecords = 0;

    loading = false;

    saving = false;

    dialogVisible = false;

    editMode = false;

    selectedExpenseId: number | null = null;

    search = '';

    first = 0;

    rows = 20;

    sortField = 'expenseNo';

    sortDirection: 'asc' | 'desc' = 'asc';

    canView = false;

    canCreate = false;

    canUpdate = false;

    canDelete = false;

    form: ExpenseCategoryForm = this.createEmptyForm();

    ngOnInit(): void {
        this.loadPermissions();
    }

    private loadPermissions(): void {
        this.permissionService.getRouteAccess(this.permissionRoute).subscribe({
            next: (access) => {
                this.canView = access.canView;

                this.canCreate = access.canCreate;

                this.canUpdate = access.canUpdate;

                this.canDelete = access.canDelete;

                if (this.canView) {
                    this.loadAccounts();

                    this.loadData();
                }
            },

            error: () => {
                this.showError('Unable to load permissions.');
            }
        });
    }

    loadData(): void {
        if (!this.canView) {
            return;
        }

        this.loading = true;

        const page = Math.floor(this.first / this.rows) + 1;

        this.service
            .getPage({
                page,
                pageSize: this.rows,
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

                error: () => {
                    this.loading = false;

                    this.showError('Unable to load Expense Category.');
                }
            });
    }

    loadAccounts(): void {
        this.service.getAccounts().subscribe({
            next: (result) => {
                this.accounts = result ?? [];
            },

            error: () => {
                this.accounts = [];
            }
        });
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        this.first = event.first ?? 0;

        this.rows = event.rows ?? 20;

        if (event.sortField) {
            this.sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
        }

        this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';

        this.loadData();
    }

    onSearch(): void {
        this.first = 0;

        this.loadData();
    }

    refresh(): void {
        this.search = '';

        this.first = 0;

        this.loadAccounts();

        this.loadData();
    }

    openNew(): void {
        if (!this.canCreate) {
            this.showError('You do not have permission to create.');

            return;
        }

        this.editMode = false;

        this.selectedExpenseId = null;

        this.form = this.createEmptyForm();

        this.dialogVisible = true;
    }

    openEdit(item: ExpenseCategory): void {
        if (!this.canUpdate) {
            this.showError('You do not have permission to update.');

            return;
        }

        this.editMode = true;

        this.selectedExpenseId = item.expenseId;

        this.form = {
            expenseNo: item.expenseNo ?? '',

            expenseName: item.expenseName ?? '',

            accountId: item.accountId ?? null,

            note: item.note ?? '',

            isInactive: item.isInactive ?? false
        };

        this.dialogVisible = true;
    }

    save(): void {
        const expenseNo = this.form.expenseNo.trim();

        const expenseName = this.form.expenseName.trim();

        if (!expenseNo) {
            this.showError('Expense No is required.');

            return;
        }

        if (!expenseName) {
            this.showError('Expense Name is required.');

            return;
        }

        const request = {
            expenseNo,
            expenseName,
            accountId: this.form.accountId,
            note: this.normalizeNullable(this.form.note),
            isInactive: this.form.isInactive
        };

        this.saving = true;

        if (this.editMode && this.selectedExpenseId != null) {
            this.update(this.selectedExpenseId, request);
        } else {
            this.create(request);
        }
    }

    private create(request: CreateExpenseCategoryRequest): void {
        this.service.create(request).subscribe({
            next: () => {
                this.saving = false;

                this.dialogVisible = false;

                this.showSuccess('Expense Category created.');

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.handleSaveError(error);
            }
        });
    }

    private update(expenseId: number, request: UpdateExpenseCategoryRequest): void {
        this.service.update(expenseId, request).subscribe({
            next: () => {
                this.saving = false;

                this.dialogVisible = false;

                this.showSuccess('Expense Category updated.');

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.handleSaveError(error);
            }
        });
    }

    confirmDelete(item: ExpenseCategory): void {
        if (!this.canDelete) {
            this.showError('You do not have permission to delete.');

            return;
        }

        this.confirmationService.confirm({
            header: 'Delete Expense Category',

            message: `Delete '${item.expenseNo}'?`,

            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.delete(item.expenseId);
            }
        });
    }

    private delete(expenseId: number): void {
        this.service.delete(expenseId).subscribe({
            next: () => {
                this.showSuccess('Expense Category deleted.');

                this.loadData();
            },

            error: () => {
                this.showError('Unable to delete Expense Category.');
            }
        });
    }

    getAccountDisplay(accountId?: number | null): string {
        if (accountId == null) {
            return '';
        }

        const account = this.accounts.find((x) => x.accountId === accountId);

        if (!account) {
            return String(accountId);
        }

        return `${account.accountNo} - ${account.accountName}`;
    }

    private createEmptyForm(): ExpenseCategoryForm {
        return {
            expenseNo: '',
            expenseName: '',
            accountId: null,
            note: '',
            isInactive: false
        };
    }

    private normalizeNullable(value: string): string | null {
        const result = value?.trim();

        return result ? result : null;
    }

    private handleSaveError(error: any): void {
        if (error?.status === 409) {
            this.showError(error?.error?.detail ?? 'Expense No already exists.');

            return;
        }

        if (error?.status === 403) {
            this.showError('Access denied.');

            return;
        }

        this.showError('Unable to save Expense Category.');
    }

    private showSuccess(detail: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail
        });
    }

    private showError(detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail
        });
    }
}
