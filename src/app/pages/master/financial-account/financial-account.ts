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
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { CreateFinancialAccountRequest, FinancialAccount, UpdateFinancialAccountRequest } from '../../../core/models/financial-account.model';

import { FinancialAccountService } from '../../../core/services/financial-account.service';

import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-financial-account',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputNumberModule, InputTextModule, SelectModule, TableModule, ToastModule, ToolbarModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './financial-account.html',
    styleUrl: './financial-account.scss'
})
export class FinancialAccountPage implements OnInit {
    private readonly service = inject(FinancialAccountService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: FinancialAccount[] = [];

    fatherAccounts: FinancialAccount[] = [];

    totalRecords = 0;

    loading = false;

    page = 1;

    pageSize = 20;

    search = '';

    sortField = 'accountNo';

    sortDirection: 'asc' | 'desc' = 'asc';

    dialogVisible = false;

    submitted = false;

    editingId: number | null = null;

    form = {
        accountNo: '',
        fatherAccountId: null as number | null,
        accountName: '',
        accountNameLegal: '',
        currencyId: null as number | null,
        accountTypeId: null as number | null,
        isDetail: true,
        isInactive: false,
        note: ''
    };

    ngOnInit(): void {
        this.loadData();
        this.loadFatherAccounts();
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
                    console.error('Unable to load Financial Account.', error);

                    this.items = [];
                    this.totalRecords = 0;
                    this.loading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Unable to load Financial Account.'
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
        this.sortField = 'accountNo';
        this.sortDirection = 'asc';
        this.loadData();
    }

    openNew(): void {
        this.editingId = null;
        this.submitted = false;

        this.form = {
            accountNo: '',
            fatherAccountId: null,
            accountName: '',
            accountNameLegal: '',
            currencyId: null,
            accountTypeId: null,
            isDetail: true,
            isInactive: false,
            note: ''
        };

        this.dialogVisible = true;
    }

    edit(item: FinancialAccount): void {
        this.editingId = item.accountId;

        this.submitted = false;

        this.form = {
            accountNo: item.accountNo ?? '',

            fatherAccountId: item.fatherAccountId ?? null,

            accountName: item.accountName ?? '',

            accountNameLegal: item.accountNameLegal ?? '',

            currencyId: item.currencyId ?? null,

            accountTypeId: item.accountTypeId ?? null,

            isDetail: item.isDetail,

            isInactive: item.isInactive,

            note: item.note ?? ''
        };

        this.dialogVisible = true;
    }

    save(): void {
        this.submitted = true;

        if (!this.form.accountNo.trim()) {
            return;
        }

        if (this.editingId == null) {
            const request: CreateFinancialAccountRequest = {
                accountNo: this.form.accountNo.trim(),

                fatherAccountId: this.form.fatherAccountId,

                accountName: this.normalizeNullable(this.form.accountName),

                accountNameLegal: this.normalizeNullable(this.form.accountNameLegal),

                currencyId: this.form.currencyId,

                accountTypeId: this.form.accountTypeId,

                isDetail: this.form.isDetail,

                isInactive: this.form.isInactive,

                note: this.normalizeNullable(this.form.note)
            };

            this.service.create(request).subscribe({
                next: () => {
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Financial Account created.'
                    });

                    this.loadData();
                    this.loadFatherAccounts();
                },

                error: (error) => {
                    this.handleSaveError(error);
                }
            });

            return;
        }

        const request: UpdateFinancialAccountRequest = {
            accountNo: this.form.accountNo.trim(),

            fatherAccountId: this.form.fatherAccountId,

            accountName: this.normalizeNullable(this.form.accountName),

            accountNameLegal: this.normalizeNullable(this.form.accountNameLegal),

            currencyId: this.form.currencyId,

            accountTypeId: this.form.accountTypeId,

            isDetail: this.form.isDetail,

            isInactive: this.form.isInactive,

            note: this.normalizeNullable(this.form.note)
        };

        this.service.update(this.editingId, request).subscribe({
            next: () => {
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Financial Account updated.'
                });

                this.loadData();
                this.loadFatherAccounts();
            },

            error: (error) => {
                this.handleSaveError(error);
            }
        });
    }

    delete(item: FinancialAccount): void {
        this.confirmationService.confirm({
            message: `Delete '${item.accountNo}'?`,

            header: 'Confirm Delete',

            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.service.delete(item.accountId).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Financial Account deleted.'
                        });

                        this.loadData();
                        this.loadFatherAccounts();
                    },

                    error: (error) => {
                        console.error('Delete Financial Account failed.', error);

                        const detail = error?.error?.detail ?? 'Unable to delete Financial Account.';

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Cannot Delete',
                            detail: detail
                        });
                    }
                });
            }
        });
    }

    private handleSaveError(error: any): void {
        console.error('Save Financial Account failed.', error);

        const detail = error?.error?.detail ?? 'Unable to save Financial Account.';

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

    loadFatherAccounts(): void {
        this.service.getLookup().subscribe({
            next: (result) => {
                this.fatherAccounts = result ?? [];
            },

            error: (error) => {
                console.error('Unable to load Father Accounts.', error);

                this.fatherAccounts = [];
            }
        });
    }

    get availableFatherAccounts(): FinancialAccount[] {
        if (this.editingId == null) {
            return this.fatherAccounts;
        }

        return this.fatherAccounts.filter((x) => x.accountId !== this.editingId);
    }

    getFatherAccountDisplay(fatherAccountId?: number | null): string {
        if (!fatherAccountId) {
            return '-';
        }

        const father = this.fatherAccounts.find((x) => x.accountId === fatherAccountId);

        if (!father) {
            return fatherAccountId.toString();
        }

        if (father.accountName?.trim()) {
            return `${father.accountNo} - ${father.accountName}`;
        }

        return father.accountNo;
    }
}
