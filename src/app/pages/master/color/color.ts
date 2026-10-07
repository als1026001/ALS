import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { TooltipModule } from 'primeng/tooltip';
import { ExcelExportButton } from '../../../shared/components/excel-export-button/excel-export-button';
import { ListView } from '../../../core/models/list-view.model';
import { ListViewService } from '../../../core/services/list-view.service';
import { ListViewColumn } from '../../../core/models/list-view-column.model';
import { ListViewColumnService } from '../../../core/services/list-view-column.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-color',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToolbarModule, ToastModule, ConfirmDialogModule, TooltipModule, ExcelExportButton],
    providers: [MessageService, ConfirmationService],
    templateUrl: './color.html'
})
export class ColorPage implements OnInit {
    private readonly colorService = inject(ColorService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly listViewService = inject(ListViewService);
    private readonly permissionService = inject(PermissionService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly listViewColumnService = inject(ListViewColumnService);
    private readonly cdr = inject(ChangeDetectorRef);

    readonly permissionRoute = '/color';

    colors: Color[] = [];
    defaultListView: ListView | null = null;
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

    listViewColumns: ListViewColumn[] = [];
    showColorNo = true;
    listViewReady = false;

    form: CreateColorRequest = this.emptyForm();
    editingColorId: number | null = null;

    ngOnInit(): void {
        this.permissionService.getRouteAccess(this.permissionRoute).subscribe({
            next: (access) => {
                this.access = access;

                // Permission đã load xong mới xử lý deep-link.
                this.openColorFromCenterSearch();
            },
            error: () => {
                this.showError('Unable to load Color permissions.');
            }
        });

        this.loadDefaultListView();
    }

    private openColorFromCenterSearch(): void {
        const idParam = this.route.snapshot.queryParamMap.get('id');

        if (!idParam) {
            return;
        }

        const colorId = Number(idParam);

        if (!Number.isInteger(colorId) || colorId <= 0) {
            return;
        }

        // Center Search có thể mở record chỉ khi user có Update permission.
        if (!this.access.canUpdate) {
            return;
        }

        this.colorService.getById(colorId).subscribe({
            next: (color) => {
                this.editColor(color);
                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                this.showError(this.getErrorMessage(error, 'Unable to load Color.'));
            }
        });
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        const first = event.first ?? 0;
        const rows = event.rows ?? this.pageSize;

        this.first = first;
        this.pageSize = rows;

        // Chỉ thay sort khi PrimeNG thực sự gửi sortField
        if (typeof event.sortField === 'string' && event.sortField) {
            this.sortField = event.sortField;

            if (event.sortOrder === -1) {
                this.sortDirection = 'desc';
            } else if (event.sortOrder === 1) {
                this.sortDirection = 'asc';
            }
        }

        // Không load ở đây trong lần khởi tạo.
        // Initial load đang được thực hiện sau khi List View config load xong.
        if (this.listViewReady) {
            this.loadPage();
        }
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

        this.clearCenterSearchId();
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

            this.colorService
                .update(this.editingColorId, request)
                .pipe(finalize(() => (this.saving = false)))
                .subscribe({
                    next: () => {
                        this.dialogVisible = false;
                        this.submitted = false;

                        this.clearCenterSearchId();

                        this.showSuccess('Color updated successfully.');
                        this.loadPage();
                    },
                    error: (error: HttpErrorResponse) => this.showError(this.getErrorMessage(error, 'Unable to update Color.'))
                });

            return;
        }

        const request: CreateColorRequest = { colorNo, colorName };

        this.colorService
            .create(request)
            .pipe(finalize(() => (this.saving = false)))
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

    private loadDefaultListView(): void {
        this.listViewService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'viewName',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.defaultListView = (result.items ?? []).find((view) => view.menuId === 13 && view.isDefault === true && view.isActive !== false) ?? null;

                    console.log('Color Default List View:', this.defaultListView);

                    if (this.defaultListView) {
                        this.loadListViewColumns(this.defaultListView.viewId, true);
                    } else {
                        this.listViewReady = true;
                        this.loadPage();
                    }
                },

                error: (error: HttpErrorResponse) => {
                    console.error('Unable to load Color default list view.', error);

                    // Không có List View vẫn phải cho Color hoạt động
                    this.defaultListView = null;
                    this.listViewColumns = [];
                    this.showColorNo = true;
                    this.listViewReady = true;

                    this.loadPage();
                }
            });
    }

    private loadPage(): void {
        this.loading = true;

        const page = Math.floor(this.first / this.pageSize) + 1;

        this.colorService
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
                    this.colors = result.items ?? [];
                    this.totalRecords = result.totalCount ?? 0;

                    this.cdr.detectChanges();

                    if (this.colors.length === 0 && this.first > 0 && this.totalRecords > 0) {
                        this.first = Math.max(0, this.first - this.pageSize);
                        this.loadPage();
                    }
                },

                error: (error: HttpErrorResponse) => {
                    setTimeout(() => {
                        this.showError(this.getErrorMessage(error, 'Unable to load Colors.'));
                    }, 0);
                }
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

    private loadListViewColumns(viewId: number, loadColorsAfter = false): void {
        this.listViewColumnService
            .getPage({
                page: 1,
                pageSize: 200,
                viewId,
                sortField: 'columnOrder',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    const columns = result.items ?? [];

                    const colorNoColumn = columns.find((x) => x.fieldCode?.toLowerCase() === 'colorno');

                    this.listViewColumns = columns;

                    this.showColorNo = colorNoColumn ? colorNoColumn.isVisible !== false : true;

                    this.cdr.detectChanges();

                    console.log('Color List View Columns:', this.listViewColumns);
                    console.log('showColorNo:', this.showColorNo);

                    if (loadColorsAfter) {
                        this.loadPage();
                    } else {
                        this.listViewReady = true;
                    }
                },

                error: (error: HttpErrorResponse) => {
                    this.listViewColumns = [];
                    this.showColorNo = true;
                    this.listViewReady = true;

                    this.showError(this.getErrorMessage(error, 'Unable to load List View Columns.'));

                    if (loadColorsAfter) {
                        this.loadPage();
                    }
                }
            });
    }

    getListViewColumn(fieldCode: string) {
        return this.listViewColumns.find((x) => x.fieldCode?.toLowerCase() === fieldCode.toLowerCase());
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
}
