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
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { MenuSetupService } from '../../../core/services/menu-setup.service';

import { ActivatedRoute, Router } from '@angular/router';

import { CreateMenuSetupRequest, MenuParentLookup, MenuSetup, MenuTranslation, UpdateMenuSetupRequest } from '../../../core/models/menu-setup.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language.service';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription, switchMap } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-menu-setup',

    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputNumberModule, InputTextModule, SelectModule, TableModule, ToastModule, TranslocoPipe],

    providers: [MessageService, ConfirmationService],

    templateUrl: './menu-setup.html',
    styleUrl: './menu-setup.css'
})
export class MenuSetupPage implements OnInit {
    private readonly service = inject(MenuSetupService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);

    private readonly languageService = inject(LanguageService);

    private readonly translocoService = inject(TranslocoService);

    private deleteConfirmSubscription?: Subscription;

    private readonly destroyRef = inject(DestroyRef);

    items: MenuSetup[] = [];

    parentMenus: MenuParentLookup[] = [];

    totalRecords = 0;

    loading = false;

    parentLoading = false;

    page = 1;

    pageSize = 10;

    search = '';

    sortField = 'seqNo';

    sortDirection: 'asc' | 'desc' = 'asc';

    dialogVisible = false;

    submitted = false;

    editingId: number | null = null;

    form = this.createEmptyForm();

    ngOnInit(): void {
        this.loadData();

        this.translocoService.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.refreshParentMenuLanguage();
        });

        this.route.queryParamMap.subscribe((params) => {
            const id = Number(params.get('id'));

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            this.openMenuFromCenterSearch(id);
        });
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
                    console.error('Unable to load Menu Setup.', error);

                    this.items = [];

                    this.totalRecords = 0;

                    this.loading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: this.translocoService.translate('common.error'),
                        detail: this.translocoService.translate('menuSetup.loadError')
                    });
                }
            });
    }

    loadParentMenus(excludeMenuId?: number | null): void {
        this.parentLoading = true;

        this.service.getParents(excludeMenuId).subscribe({
            next: (result) => {
                this.parentMenus = (result ?? []).map((item) => ({
                    ...item,
                    displayName: this.getParentOptionName(item)
                }));

                this.parentLoading = false;
            },

            error: (error) => {
                console.error('Unable to load Parent Menu.', error);

                this.parentMenus = [];

                this.parentLoading = false;

                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('common.error'),
                    detail: this.translocoService.translate('menuSetup.parentLoadError')
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

        this.form = this.createEmptyForm();

        this.loadParentMenus();

        this.dialogVisible = true;
    }

    private openMenuFromCenterSearch(menuId: number): void {
        this.service.getById(menuId).subscribe({
            next: (item) => {
                if (!item) {
                    return;
                }

                this.edit(item);
            },
            error: (error) => {
                console.error('Unable to load Menu Setup from Center Search.', error);

                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('common.error'),
                    detail: this.translocoService.translate('menuSetup.loadError')
                });
            }
        });
    }

    edit(item: MenuSetup): void {
        this.editingId = item.menuId;

        this.submitted = false;

        this.form = {
            menuNo: item.menuNo ?? '',
            menuName: item.menuName ?? '',

            menuNameVi: item.menuNameVi ?? '',
            menuNameEn: item.menuNameEn ?? '',
            menuNameCn: item.menuNameCn ?? '',

            parentMenuId: item.parentMenuId ?? null,

            seqNo: item.seqNo ?? 1,

            menuTypeId: item.menuTypeId ?? 1,

            icon: item.icon ?? '',

            routerLink: item.routerLink ?? '',

            menuUrl: item.menuUrl ?? '',

            isInactive: item.isInactive,

            isVisible: item.isVisible,

            isSecurity: item.isSecurity,

            isExternal: item.isExternal,

            target: item.target ?? '',

            permissionCode: item.permissionCode ?? '',

            note: item.note ?? ''
        };

        // Do not allow the menu itself
        // to appear as its own parent.
        this.loadParentMenus(item.menuId);

        this.dialogVisible = true;
    }

    save(): void {
        this.submitted = true;

        if (!this.form.menuNo.trim() || !this.form.menuName.trim()) {
            return;
        }

        const translations: MenuTranslation[] = [
            { langCode: 'vi', menuName: this.form.menuNameVi.trim() },
            { langCode: 'en', menuName: this.form.menuNameEn.trim() },
            { langCode: 'cn', menuName: this.form.menuNameCn.trim() }
        ];

        const validTranslations = translations.filter((x) => x.menuName.length > 0);

        const request = {
            menuNo: this.form.menuNo,
            menuName: this.form.menuName,
            translations: validTranslations,

            parentMenuId: this.form.parentMenuId,

            seqNo: this.form.seqNo || 1,

            menuTypeId: this.form.menuTypeId || 1,

            icon: this.normalizeNullable(this.form.icon),

            routerLink: this.normalizeNullable(this.form.routerLink),

            menuUrl: this.normalizeNullable(this.form.menuUrl),

            isInactive: this.form.isInactive,

            isVisible: this.form.isVisible,

            isSecurity: this.form.isSecurity,

            isExternal: this.form.isExternal,

            target: this.normalizeNullable(this.form.target),

            permissionCode: this.normalizeNullable(this.form.permissionCode),

            note: this.normalizeNullable(this.form.note)
        };

        if (this.editingId == null) {
            this.create(request);

            return;
        }

        this.update(this.editingId, request);
    }

    delete(item: MenuSetup): void {
        this.deleteConfirmSubscription?.unsubscribe();

        const updateConfirmation = () => {
            const lang = this.languageService.selectedLanguage();

            const menuName = (lang === 'vi' ? item.menuNameVi : lang === 'cn' ? item.menuNameCn : item.menuNameEn) || item.menuName;

            this.confirmationService.confirm({
                header: this.translocoService.translate('menuSetup.confirmDeleteTitle'),
                message: this.translocoService.translate('menuSetup.confirmDeleteMessage', { name: menuName }),
                acceptLabel: this.translocoService.translate('common.yes'),
                rejectLabel: this.translocoService.translate('common.no'),
                icon: 'pi pi-exclamation-triangle',

                accept: () => {
                    this.deleteConfirmSubscription?.unsubscribe();

                    this.service.delete(item.menuId).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: this.translocoService.translate('common.success'),
                                detail: this.translocoService.translate('menuSetup.deletedSuccess')
                            });

                            this.loadData();
                        },
                        error: (error) => {
                            console.error('Delete Menu failed.', error);

                            const errorCode = error?.error?.code;

                            const backendMessage = String(error?.error?.detail ?? error?.error?.message ?? '');

                            const detail = errorCode === 'MENU_HAS_CHILDREN' ? this.translocoService.translate('menuSetup.hasChildrenError') : backendMessage || this.translocoService.translate('menuSetup.deleteError');

                            this.messageService.add({
                                severity: 'error',
                                summary: this.translocoService.translate('common.error'),
                                detail
                            });
                        }
                    });
                },

                reject: () => {
                    this.deleteConfirmSubscription?.unsubscribe();
                }
            });
        };

        updateConfirmation();

        this.deleteConfirmSubscription = this.translocoService.langChanges$.pipe(switchMap((lang) => this.translocoService.load(lang))).subscribe(() => {
            updateConfirmation();
        });
    }

    getParentName(item: MenuSetup): string {
        if (!item.parentMenuId) {
            return '';
        }

        const lang = this.languageService.selectedLanguage();

        switch (lang) {
            case 'vi':
                return item.parentMenuNameVi || item.parentMenuName || item.parentMenuNo || '-';

            case 'cn':
                return item.parentMenuNameCn || item.parentMenuName || item.parentMenuNo || '-';

            case 'en':
            default:
                return item.parentMenuNameEn || item.parentMenuName || item.parentMenuNo || '-';
        }
    }

    getParentOptionName(item: MenuParentLookup): string {
        const lang = this.languageService.selectedLanguage();

        switch (lang) {
            case 'vi':
                return item.menuNameVi || item.menuName;

            case 'cn':
                return item.menuNameCn || item.menuName;

            case 'en':
            default:
                return item.menuNameEn || item.menuName;
        }
    }

    private refreshParentMenuLanguage(): void {
        this.parentMenus = this.parentMenus.map((item) => ({
            ...item,
            displayName: this.getParentOptionName(item)
        }));
    }

    private create(request: CreateMenuSetupRequest): void {
        this.service.create(request).subscribe({
            next: () => {
                this.dialogVisible = false;

                this.clearCenterSearchId();

                this.messageService.add({
                    severity: 'success',
                    summary: this.translocoService.translate('common.success'),
                    detail: this.translocoService.translate('menuSetup.createdSuccess')
                });

                this.loadData();
            },

            error: (error) => {
                this.handleSaveError(error);
            }
        });
    }

    private update(menuId: number, request: UpdateMenuSetupRequest): void {
        this.service.update(menuId, request).subscribe({
            next: () => {
                this.dialogVisible = false;

                this.clearCenterSearchId();

                this.messageService.add({
                    severity: 'success',
                    summary: this.translocoService.translate('common.success'),
                    detail: this.translocoService.translate('menuSetup.updatedSuccess')
                });

                this.loadData();
            },

            error: (error) => {
                this.handleSaveError(error);
            }
        });
    }

    private createEmptyForm() {
        return {
            menuNo: '',
            menuName: '',
            menuNameVi: '',
            menuNameEn: '',
            menuNameCn: '',

            parentMenuId: null as number | null,

            seqNo: 1,

            menuTypeId: 1,

            icon: '',

            routerLink: '',

            menuUrl: '',

            isInactive: false,

            isVisible: true,

            isSecurity: true,

            isExternal: false,

            target: '',

            permissionCode: '',

            note: ''
        };
    }

    private handleSaveError(error: any): void {
        console.error('Save Menu failed.', error);

        const detail = error?.status === 409 ? this.translocoService.translate('menuSetup.duplicateError') : error?.error?.detail || error?.error?.message || this.translocoService.translate('menuSetup.saveError');

        this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('common.error'),
            detail
        });
    }

    private normalizeNullable(value: string): string | null {
        const result = value?.trim();

        return result ? result : null;
    }

    private clearCenterSearchId(): void {
        if (!this.route.snapshot.queryParamMap.has('id')) {
            return;
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    onDialogHide(): void {
        this.clearCenterSearchId();
    }
}
