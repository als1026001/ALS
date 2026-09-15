import { CommonModule } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';

import { CheckboxModule } from 'primeng/checkbox';

import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { DialogModule } from 'primeng/dialog';

import { InputTextModule } from 'primeng/inputtext';

import { InputNumberModule } from 'primeng/inputnumber';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { ToastModule } from 'primeng/toast';

import { ToolbarModule } from 'primeng/toolbar';

import { IndexMenu, CreateIndexMenuRequest, UpdateIndexMenuRequest } from '../../../core/models/index-menu.model';

import { IndexMenuService } from '../../../core/services/index-menu.service';

@Component({
    selector: 'app-index-menu',

    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputTextModule, InputNumberModule, TableModule, ToastModule, ToolbarModule],

    providers: [MessageService, ConfirmationService],

    templateUrl: './index-menu.html',

    styleUrl: './index-menu.css'
})
export class IndexMenuPage implements OnInit {
    private readonly service = inject(IndexMenuService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    items: IndexMenu[] = [];

    totalRecords = 0;

    loading = false;

    page = 1;

    pageSize = 20;

    search = '';

    sortField = 'seqNo';

    sortDirection: 'asc' | 'desc' = 'asc';

    dialogVisible = false;

    submitted = false;

    editingId: number | null = null;

    form = {
        menuNo: '',
        menuName: '',
        routerLink: '',
        icon: '',
        seqNo: 1,
        isVisible: true,
        isInactive: false,
        note: ''
    };

    ngOnInit(): void {
        this.loadData();
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
                    console.error('Unable to load Index Menu.', error);

                    this.items = [];

                    this.totalRecords = 0;

                    this.loading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Unable to load Index Menu.'
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

        this.sortField = 'seqNo';

        this.sortDirection = 'asc';

        this.loadData();
    }

    openNew(): void {
        this.editingId = null;

        this.submitted = false;

        this.form = {
            menuNo: '',
            menuName: '',
            routerLink: '',
            icon: '',
            seqNo: 1,
            isVisible: true,
            isInactive: false,
            note: ''
        };

        this.dialogVisible = true;
    }

    edit(item: IndexMenu): void {
        this.editingId = item.indexMenuId;

        this.submitted = false;

        this.form = {
            menuNo: item.menuNo ?? '',

            menuName: item.menuName ?? '',

            routerLink: item.routerLink ?? '',

            icon: item.icon ?? '',

            seqNo: item.seqNo ?? 1,

            isVisible: item.isVisible,

            isInactive: item.isInactive,

            note: item.note ?? ''
        };

        this.dialogVisible = true;
    }

    save(): void {
        this.submitted = true;

        if (!this.form.menuNo.trim() || !this.form.menuName.trim() || !this.form.routerLink.trim()) {
            return;
        }

        if (this.editingId == null) {
            const request: CreateIndexMenuRequest = {
                menuNo: this.form.menuNo,

                menuName: this.form.menuName,

                routerLink: this.form.routerLink,

                icon: this.normalizeNullable(this.form.icon),

                seqNo: this.form.seqNo || 1,

                isVisible: this.form.isVisible,

                isInactive: this.form.isInactive,

                note: this.normalizeNullable(this.form.note)
            };

            this.service.create(request).subscribe({
                next: () => {
                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Index Menu created.'
                    });

                    this.loadData();
                },

                error: (error) => {
                    this.handleSaveError(error);
                }
            });

            return;
        }

        const request: UpdateIndexMenuRequest = {
            menuNo: this.form.menuNo,

            menuName: this.form.menuName,

            routerLink: this.form.routerLink,

            icon: this.normalizeNullable(this.form.icon),

            seqNo: this.form.seqNo || 1,

            isVisible: this.form.isVisible,

            isInactive: this.form.isInactive,

            note: this.normalizeNullable(this.form.note)
        };

        this.service.update(this.editingId, request).subscribe({
            next: () => {
                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Index Menu updated.'
                });

                this.loadData();
            },

            error: (error) => {
                this.handleSaveError(error);
            }
        });
    }

    delete(item: IndexMenu): void {
        this.confirmationService.confirm({
            message: `Delete '${item.menuName}'?`,

            header: 'Confirm Delete',

            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.service.delete(item.indexMenuId).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Index Menu deleted.'
                        });

                        this.loadData();
                    },

                    error: (error) => {
                        console.error('Delete Index Menu failed.', error);

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to delete Index Menu.'
                        });
                    }
                });
            }
        });
    }

    private handleSaveError(error: any): void {
        console.error('Save Index Menu failed.', error);

        const detail = error?.status === 409 ? 'Menu No or Router Link already exists.' : 'Unable to save Index Menu.';

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
}
