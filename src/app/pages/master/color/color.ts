import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { finalize } from 'rxjs';
import { Color, CreateColorRequest, UpdateColorRequest } from '../../../core/models/color.model';
import { RouteAccess } from '../../../core/models/permission.model';
import { ColorService } from '../../../core/services/color.service';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
    selector: 'app-color',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './color.html'
})
export class ColorPage implements OnInit {
    private readonly colorService = inject(ColorService);
    private readonly permissionService = inject(PermissionService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    readonly permissionRoute = '/color';

    colors: Color[] = [];
    totalRecords = 0;
    loading = false;
    saving = false;
    submitted = false;
    dialogVisible = false;
    editing = false;

    search = '';
    pageSize = 20;
    first = 0;
    sortField = 'colorNo';
    sortDirection: 'asc' | 'desc' = 'asc';

    access: RouteAccess = {
        routerLink: this.permissionRoute,
        levelId: 0,
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false
    };

    form: CreateColorRequest = this.emptyForm();
    editingColorId: number | null = null;

    ngOnInit(): void {
        this.permissionService.getRouteAccess(this.permissionRoute).subscribe({
            next: (access) => this.access = access,
            error: () => this.showError('Unable to load Color permissions.')
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

    searchColors(): void {
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
        if (!this.access.canCreate) return;

        this.editing = false;
        this.editingColorId = null;
        this.form = this.emptyForm();
        this.submitted = false;
        this.dialogVisible = true;
    }

    editColor(color: Color): void {
        if (!this.access.canUpdate) return;

        this.editing = true;
        this.editingColorId = color.colorId;
        this.form = {
            colorNo: color.colorNo,
            colorName: color.colorName ?? ''
        };
        this.submitted = false;
        this.dialogVisible = true;
    }

    hideDialog(): void {
        if (this.saving) return;
        this.dialogVisible = false;
        this.submitted = false;
    }

    saveColor(): void {
        this.submitted = true;

        const colorNo = this.form.colorNo.trim();
        const colorName = this.form.colorName?.trim() || null;

        if (!colorNo) return;
        if (colorNo.length > 50 || (colorName?.length ?? 0) > 250) return;

        this.saving = true;

        if (this.editing && this.editingColorId !== null) {
            const request: UpdateColorRequest = { colorNo, colorName };

            this.colorService.update(this.editingColorId, request)
                .pipe(finalize(() => this.saving = false))
                .subscribe({
                    next: () => {
                        this.dialogVisible = false;
                        this.showSuccess('Color updated successfully.');
                        this.loadPage();
                    },
                    error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to update Color.'))
                });

            return;
        }

        const request: CreateColorRequest = { colorNo, colorName };

        this.colorService.create(request)
            .pipe(finalize(() => this.saving = false))
            .subscribe({
                next: () => {
                    this.dialogVisible = false;
                    this.first = 0;
                    this.showSuccess('Color created successfully.');
                    this.loadPage();
                },
                error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to create Color.'))
            });
    }

    deleteColor(color: Color): void {
        if (!this.access.canDelete) return;

        this.confirmationService.confirm({
            header: 'Delete Color',
            message: `Delete ${color.colorNo}${color.colorName ? ` - ${color.colorName}` : ''}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: { label: 'Delete', severity: 'danger' },
            rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
            accept: () => {
                this.colorService.delete(color.colorId).subscribe({
                    next: () => {
                        this.showSuccess('Color deleted successfully.');
                        this.loadPage();
                    },
                    error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to delete Color.'))
                });
            }
        });
    }

    private loadPage(): void {
        this.loading = true;

        const page = Math.floor(this.first / this.pageSize) + 1;

        this.colorService.getPage({
            page,
            pageSize: this.pageSize,
            search: this.search,
            sortField: this.sortField,
            sortDirection: this.sortDirection
        })
        .pipe(finalize(() => this.loading = false))
        .subscribe({
            next: (result) => {
                this.colors = result.items ?? [];
                this.totalRecords = result.totalCount ?? 0;

                if (this.colors.length === 0 && this.first > 0 && this.totalRecords > 0) {
                    this.first = Math.max(0, this.first - this.pageSize);
                    this.loadPage();
                }
            },
            error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to load Colors.'))
        });
    }

    private emptyForm(): CreateColorRequest {
        return { colorNo: '', colorName: '' };
    }

    private showSuccess(detail: string): void {
        this.messageService.add({ severity: 'success', summary: 'Success', detail });
    }

    private showError(detail: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
    }

    private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
        const body = error.error as { detail?: string; message?: string; title?: string } | string | null;

        if (typeof body === 'string' && body.trim()) return body;
        if (body && typeof body === 'object') return body.detail || body.message || body.title || fallback;
        if (error.status === 403) return 'You do not have permission for this action.';
        if (error.status === 409) return 'Color No already exists.';
        return fallback;
    }
}
