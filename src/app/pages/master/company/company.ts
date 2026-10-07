import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TooltipModule } from 'primeng/tooltip';

import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../../../core/models/company.model';

import { CompanyService } from '../../../core/services/company.service';

@Component({
    selector: 'app-company',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, InputNumberModule, CheckboxModule, TooltipModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './company.html',
    styleUrl: './company.css'
})
export class CompanyComponent implements OnInit {
    private readonly service = inject(CompanyService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: Company[] = [];

    totalRecords = 0;

    loading = false;
    saving = false;

    dialogVisible = false;
    submitted = false;

    editingCompanyId: number | null = null;

    searchText = '';

    page = 1;
    pageSize = 20;

    sortField = 'companyNo';
    sortDirection: 'asc' | 'desc' = 'asc';

    form = this.createEmptyForm();

    ngOnInit(): void {
        this.openCompanyFromCenterSearch();
    }

    private openCompanyFromCenterSearch(): void {
        const idParam = this.route.snapshot.queryParamMap.get('id');

        if (!idParam) {
            return;
        }

        const companyId = Number(idParam);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return;
        }

        this.service.getById(companyId).subscribe({
            next: (company) => {
                this.edit(company);
            },
            error: (error) => {
                this.showApiError(error, 'Unable to load company.');
            }
        });
    }

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

                    this.showApiError(error, 'Unable to load companies.');
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
        this.editingCompanyId = null;
        this.submitted = false;
        this.form = this.createEmptyForm();
        this.dialogVisible = true;
    }

    edit(item: Company): void {
        this.editingCompanyId = item.companyId;
        this.submitted = false;

        this.form = {
            companyNo: item.companyNo ?? '',
            accountId: item.accountId ?? null,
            companyName: item.companyName ?? '',
            taxCode: item.taxCode ?? '',
            legalName: item.legalName ?? '',

            website: item.website ?? '',

            address: item.address ?? '',
            addressShipping: item.addressShipping ?? '',
            addressReturn: item.addressReturn ?? '',

            countryId: item.countryId ?? null,
            timeZoneId: item.timeZoneId ?? null,
            currencyId: item.currencyId ?? null,

            firstFiscalMonth: item.firstFiscalMonth ?? '',
            emailReturnAddress: item.emailReturnAddress ?? '',

            primaryDataCenterId: item.primaryDataCenterId ?? '',

            recoveryDataCenterId: item.recoveryDataCenterId ?? '',

            allowIpAddress: item.allowIpAddress ?? '',

            companyLoginUrl: item.companyLoginUrl ?? '',
            companyUiUrl: item.companyUiUrl ?? '',
            restWebServiceUrl: item.restWebServiceUrl ?? '',
            restletsUrl: item.restletsUrl ?? '',

            note: item.note ?? '',

            isActive: item.isActive ?? true
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

    private clearCenterSearchId(): void {
        if (!this.route.snapshot.queryParamMap.has('id')) {
            return;
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                id: null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    save(): void {
        this.submitted = true;

        if (!this.form.companyNo.trim()) {
            return;
        }

        const request: CreateCompanyRequest = {
            companyNo: this.normalizeNullable(this.form.companyNo),

            accountId: this.form.accountId,

            companyName: this.normalizeNullable(this.form.companyName),

            taxCode: this.normalizeNullable(this.form.taxCode),

            legalName: this.normalizeNullable(this.form.legalName),

            website: this.normalizeNullable(this.form.website),

            address: this.normalizeNullable(this.form.address),

            addressShipping: this.normalizeNullable(this.form.addressShipping),

            addressReturn: this.normalizeNullable(this.form.addressReturn),

            countryId: this.form.countryId,
            timeZoneId: this.form.timeZoneId,
            currencyId: this.form.currencyId,

            firstFiscalMonth: this.normalizeNullable(this.form.firstFiscalMonth),

            emailReturnAddress: this.normalizeNullable(this.form.emailReturnAddress),

            primaryDataCenterId: this.normalizeNullable(this.form.primaryDataCenterId),

            recoveryDataCenterId: this.normalizeNullable(this.form.recoveryDataCenterId),

            allowIpAddress: this.normalizeNullable(this.form.allowIpAddress),

            companyLoginUrl: this.normalizeNullable(this.form.companyLoginUrl),

            companyUiUrl: this.normalizeNullable(this.form.companyUiUrl),

            restWebServiceUrl: this.normalizeNullable(this.form.restWebServiceUrl),

            restletsUrl: this.normalizeNullable(this.form.restletsUrl),

            note: this.normalizeNullable(this.form.note),

            isActive: this.form.isActive
        };

        this.saving = true;

        if (this.editingCompanyId == null) {
            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Company created successfully.'
                    });

                    this.page = 1;
                    this.loadData();
                },
                error: (error) => {
                    this.saving = false;

                    this.showApiError(error, 'Unable to create company.');
                }
            });

            return;
        }

        const updateRequest: UpdateCompanyRequest = {
            ...request
        };

        this.service.update(this.editingCompanyId, updateRequest).subscribe({
            next: () => {
                this.saving = false;
                this.dialogVisible = false;
                this.submitted = false;

                this.clearCenterSearchId();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Company updated successfully.'
                });

                this.loadData();
            },
            error: (error) => {
                this.saving = false;

                this.showApiError(error, 'Unable to update company.');
            }
        });
    }

    confirmDelete(item: Company): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Company "${item.companyNo ?? item.companyName ?? item.companyId}"?`,

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

    private delete(item: Company): void {
        this.service.delete(item.companyId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Company deleted successfully.'
                });

                if (this.items.length === 1 && this.page > 1) {
                    this.page--;
                }

                this.loadData();
            },
            error: (error) => {
                this.showApiError(error, 'Unable to delete company.');
            }
        });
    }

    private createEmptyForm(): {
        companyNo: string;
        accountId: number | null;
        companyName: string;
        taxCode: string;
        legalName: string;

        website: string;

        address: string;
        addressShipping: string;
        addressReturn: string;

        countryId: number | null;
        timeZoneId: number | null;
        currencyId: number | null;

        firstFiscalMonth: string;
        emailReturnAddress: string;

        primaryDataCenterId: string;
        recoveryDataCenterId: string;

        allowIpAddress: string;

        companyLoginUrl: string;
        companyUiUrl: string;
        restWebServiceUrl: string;
        restletsUrl: string;

        note: string;

        isActive: boolean;
    } {
        return {
            companyNo: '',
            accountId: null,
            companyName: '',
            taxCode: '',
            legalName: '',

            website: '',

            address: '',
            addressShipping: '',
            addressReturn: '',

            countryId: null,
            timeZoneId: null,
            currencyId: null,

            firstFiscalMonth: '',
            emailReturnAddress: '',

            primaryDataCenterId: '',
            recoveryDataCenterId: '',

            allowIpAddress: '',

            companyLoginUrl: '',
            companyUiUrl: '',
            restWebServiceUrl: '',
            restletsUrl: '',

            note: '',

            isActive: true
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
