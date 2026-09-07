import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { finalize } from 'rxjs';

import { SaleChannel, CreateSaleChannelRequest, UpdateSaleChannelRequest } from '../../../core/models/sale-channel.model';

import { RouteAccess } from '../../../core/models/permission.model';
import { SaleChannelService } from '../../../core/services/sale-channel.service';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
    selector: 'app-sale-channel',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToolbarModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './sale-channel.html'
})
export class SaleChannelPage implements OnInit {
    private readonly saleChannelService = inject(SaleChannelService);

    private readonly permissionService = inject(PermissionService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    readonly permissionRoute = '/saleChannel';

    saleChannels: SaleChannel[] = [];

    totalRecords = 0;
    loading = false;
    saving = false;
    submitted = false;
    dialogVisible = false;
    editing = false;

    search = '';

    pageSize = 20;
    first = 0;

    sortField = 'saleChannelNo';

    sortDirection: 'asc' | 'desc' = 'asc';

    access: RouteAccess = {
        routerLink: this.permissionRoute,
        levelId: 0,
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false
    };

    form: CreateSaleChannelRequest = this.emptyForm();

    editingSaleChannelId: number | null = null;

    ngOnInit(): void {
        this.permissionService.getRouteAccess(this.permissionRoute).subscribe({
            next: (access) => (this.access = access),

            error: () => this.showError('Unable to load Sale Channel permissions.')
        });

        this.loadPage();
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = event.first ?? 0;
        const rows = event.rows ?? this.pageSize;

        this.first = first;
        this.pageSize = rows;

        if (typeof event.sortField === 'string' && event.sortField) {
            this.sortField = event.sortField;
        }

        if (event.sortOrder === -1) {
            this.sortDirection = 'desc';
        } else if (event.sortOrder === 1) {
            this.sortDirection = 'asc';
        }

        this.loadPage();
    }

    searchSaleChannels(): void {
        this.first = 0;
        this.loadPage();
    }

    clearSearch(): void {
        this.search = '';
        this.first = 0;
        this.loadPage();
    }

    refresh(): void {
        this.loadPage();
    }

    openNew(): void {
        if (!this.access.canCreate) {
            return;
        }

        this.editing = false;
        this.editingSaleChannelId = null;
        this.form = this.emptyForm();
        this.submitted = false;
        this.dialogVisible = true;
    }

    editSaleChannel(saleChannel: SaleChannel): void {
        if (!this.access.canUpdate) {
            return;
        }

        this.editing = true;

        this.editingSaleChannelId = saleChannel.saleChannelId;

        this.form = {
            saleChannelNo: saleChannel.saleChannelNo,

            saleChannelName: saleChannel.saleChannelName ?? '',

            note: saleChannel.note ?? ''
        };

        this.submitted = false;
        this.dialogVisible = true;
    }

    hideDialog(): void {
        if (this.saving) {
            return;
        }

        this.dialogVisible = false;
        this.submitted = false;
    }

    saveSaleChannel(): void {
        this.submitted = true;

        const saleChannelNo = this.form.saleChannelNo.trim();

        const saleChannelName = this.form.saleChannelName?.trim() || null;

        const note = this.form.note?.trim() || null;

        if (!saleChannelNo) {
            return;
        }

        if (saleChannelNo.length > 50 || (saleChannelName?.length ?? 0) > 150) {
            return;
        }

        this.saving = true;

        if (this.editing && this.editingSaleChannelId !== null) {
            const request: UpdateSaleChannelRequest = {
                saleChannelNo,
                saleChannelName,
                note
            };

            this.saleChannelService
                .update(this.editingSaleChannelId, request)
                .pipe(finalize(() => (this.saving = false)))
                .subscribe({
                    next: () => {
                        this.dialogVisible = false;

                        this.showSuccess('Sale Channel updated successfully.');

                        this.loadPage();
                    },

                    error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to update Sale Channel.'))
                });

            return;
        }

        const request: CreateSaleChannelRequest = {
            saleChannelNo,
            saleChannelName,
            note
        };

        this.saleChannelService
            .create(request)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe({
                next: () => {
                    this.dialogVisible = false;
                    this.first = 0;

                    this.showSuccess('Sale Channel created successfully.');

                    this.loadPage();
                },

                error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to create Sale Channel.'))
            });
    }

    deleteSaleChannel(saleChannel: SaleChannel): void {
        if (!this.access.canDelete) {
            return;
        }

        this.confirmationService.confirm({
            header: 'Delete Sale Channel',

            message: `Delete ${saleChannel.saleChannelNo}` + `${saleChannel.saleChannelName ? ` - ${saleChannel.saleChannelName}` : ''}?`,

            icon: 'pi pi-exclamation-triangle',

            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },

            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },

            accept: () => {
                this.saleChannelService.delete(saleChannel.saleChannelId).subscribe({
                    next: () => {
                        this.showSuccess('Sale Channel deleted successfully.');

                        this.loadPage();
                    },

                    error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to delete Sale Channel.'))
                });
            }
        });
    }

    private loadPage(): void {
        this.loading = true;

        const page = Math.floor(this.first / this.pageSize) + 1;

        this.saleChannelService
            .getPage({
                page,
                pageSize: this.pageSize,
                search: this.search,
                sortField: this.sortField,
                sortDirection: this.sortDirection
            })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (result) => {
                    this.saleChannels = result.items ?? [];

                    this.totalRecords = result.totalCount ?? 0;

                    if (this.saleChannels.length === 0 && this.first > 0 && this.totalRecords > 0) {
                        this.first = Math.max(0, this.first - this.pageSize);

                        this.loadPage();
                    }
                },

                error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to load Sale Channels.'))
            });
    }

    private emptyForm(): CreateSaleChannelRequest {
        return {
            saleChannelNo: '',
            saleChannelName: '',
            note: ''
        };
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

    private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
        const body = error.error as
            | {
                  detail?: string;
                  message?: string;
                  title?: string;
              }
            | string
            | null;

        if (typeof body === 'string' && body.trim()) {
            return body;
        }

        if (body && typeof body === 'object') {
            return body.detail || body.message || body.title || fallback;
        }

        if (error.status === 403) {
            return 'You do not have permission for this action.';
        }

        if (error.status === 409) {
            return 'Sale Channel No already exists.';
        }

        return fallback;
    }
}
