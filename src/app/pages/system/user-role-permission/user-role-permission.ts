import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { CreateUserRolePermissionRequest, UpdateUserRolePermissionRequest, UserRolePermission } from '../../../core/models/user-role-permission.model';

import { UserRole } from '../../../core/models/user-role.model';
import { MenuSetup } from '../../../core/models/menu-setup.model';

import { UserRolePermissionService } from '../../../core/services/user-role-permission.service';
import { UserRoleService } from '../../../core/services/user-role.service';
import { MenuSetupService } from '../../../core/services/menu-setup.service';
import { firstValueFrom } from 'rxjs';

interface BulkPermissionRow {
    menuId: number;
    menuNo: string;
    menuName: string;
    routerLink: string;
    selected: boolean;
    levelId: number;
}

@Component({
    selector: 'app-user-role-permission',
    standalone: true,

    imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DialogModule, InputTextModule, SelectModule, TableModule, TextareaModule, ToastModule, TooltipModule],

    providers: [MessageService, ConfirmationService],

    templateUrl: './user-role-permission.html',
    styleUrl: './user-role-permission.css'
})
export class UserRolePermissionComponent implements OnInit {
    private readonly service = inject(UserRolePermissionService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private readonly userRoleService = inject(UserRoleService);

    private readonly menuSetupService = inject(MenuSetupService);

    private readonly messageService = inject(MessageService);

    private readonly confirmationService = inject(ConfirmationService);
    private readonly cdr = inject(ChangeDetectorRef);

    items: UserRolePermission[] = [];

    roles: UserRole[] = [];
    menus: MenuSetup[] = [];

    loading = false;
    saving = false;

    roleLoading = false;
    menuLoading = false;

    totalRecords = 0;

    rows = 20;
    first = 0;

    searchText = '';

    filterRoleId: number | null = null;
    filterMenuId: number | null = null;

    sortField = 'roleNo';
    sortOrder = 1;

    dialogVisible = false;
    submitted = false;

    editingPermissionId: number | null = null;

    bulkDialogVisible = false;
    bulkRoleId: number | null = null;
    bulkPermissionLoading = false;
    bulkSaving = false;

    private bulkSaveConfirmed = false;

    bulkMenuLoading = false;
    bulkMenuLoadError = false;
    bulkPermissionLoadError = false;
    bulkSearchText = '';

    private bulkMenuRequestId = 0;
    private bulkPermissionRequestId = 0;
    private bulkLoadedRoleId: number | null = null;
    private bulkMenusLoaded = false;

    bulkRows: BulkPermissionRow[] = [];

    readonly bulkPermissionLevels = [
        { label: '1 - View', value: 1 },
        { label: '2 - View + Create', value: 2 },
        { label: '3 - View + Create + Update', value: 3 },
        { label: '4 - Full Access', value: 4 }
    ];

    form = this.createEmptyForm();

    readonly permissionLevels = [
        {
            value: 1,
            label: '1 - View'
        },
        {
            value: 2,
            label: '2 - View + Create'
        },
        {
            value: 3,
            label: '3 - View + Create + Update'
        },
        {
            value: 4,
            label: '4 - Full Access'
        },
        {
            value: 9,
            label: '9 - Full Access (Administrator)'
        }
    ];

    ngOnInit(): void {
        this.loadRoleLookup();
        this.loadMenuLookup();

        this.route.queryParamMap.subscribe((params) => {
            const id = Number(params.get('id'));

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            this.openPermissionFromCenterSearch(id);
        });
    }

    loadData(event?: TableLazyLoadEvent): void {
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

        this.service
            .getPage({
                page,
                pageSize: this.rows,

                search: this.searchText.trim() || undefined,

                roleId: this.filterRoleId,

                menuId: this.filterMenuId,

                sortField: this.sortField,

                sortDirection: this.sortOrder === -1 ? 'desc' : 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.items = result.items ?? [];

                    this.totalRecords = result.totalCount ?? 0;

                    this.loading = false;

                    this.cdr.detectChanges();
                },

                error: (error) => {
                    this.loading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load user role permissions.'));
                }
            });
    }

    search(): void {
        this.first = 0;
        this.loadData();
    }

    clearSearch(): void {
        this.searchText = '';
        this.filterRoleId = null;
        this.filterMenuId = null;
        this.first = 0;

        this.loadData();
    }

    refresh(): void {
        this.loadData();
    }

    onFilterChange(): void {
        this.first = 0;
        this.loadData();
    }

    openNew(): void {
        this.submitted = false;

        this.editingPermissionId = null;

        this.form = this.createEmptyForm();

        this.dialogVisible = true;
    }

    private openPermissionFromCenterSearch(permissionId: number): void {
        this.service.getById(permissionId).subscribe({
            next: (item) => {
                if (!item) {
                    return;
                }

                this.edit(item);
            },
            error: (error) => {
                console.error('Unable to load User Role Permission from Center Search.', error);

                this.showError(this.getErrorMessage(error, 'Unable to load User Role Permission.'));
            }
        });
    }

    edit(item: UserRolePermission): void {
        this.submitted = false;

        this.editingPermissionId = item.permissionId;

        this.form = {
            roleId: item.roleId,

            menuId: item.menuId,

            levelId: item.levelId ?? 1,

            isInactive: item.isInactive ?? false,

            note: item.note ?? ''
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

    save(): void {
        this.submitted = true;

        if (!this.form.roleId || !this.form.menuId || !this.form.levelId) {
            return;
        }

        this.saving = true;

        if (this.editingPermissionId === null) {
            const request: CreateUserRolePermissionRequest = {
                roleId: this.form.roleId,

                menuId: this.form.menuId,

                levelId: this.form.levelId,

                isInactive: this.form.isInactive,

                note: this.normalizeString(this.form.note)
            };

            this.service.create(request).subscribe({
                next: () => {
                    this.saving = false;

                    this.dialogVisible = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User Role Permission created successfully.'
                    });

                    this.first = 0;

                    this.loadData();
                },

                error: (error) => {
                    this.saving = false;

                    this.showError(this.getErrorMessage(error, 'Unable to create user role permission.'));
                }
            });

            return;
        }

        const request: UpdateUserRolePermissionRequest = {
            roleId: this.form.roleId,

            menuId: this.form.menuId,

            levelId: this.form.levelId,

            isInactive: this.form.isInactive,

            note: this.normalizeString(this.form.note)
        };

        this.service.update(this.editingPermissionId, request).subscribe({
            next: () => {
                this.saving = false;

                this.dialogVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role Permission updated successfully.'
                });

                this.loadData();
            },

            error: (error) => {
                this.saving = false;

                this.showError(this.getErrorMessage(error, 'Unable to update user role permission.'));
            }
        });
    }

    confirmDelete(item: UserRolePermission): void {
        const role = item.roleNo ?? item.roleId.toString();

        const menu = item.menuName ?? item.menuNo ?? item.menuId.toString();

        this.confirmationService.confirm({
            header: 'Delete User Role Permission',

            icon: 'pi pi-exclamation-triangle',

            message: `Are you sure you want to delete permission "${role} - ${menu}"?`,

            acceptLabel: 'Delete',

            rejectLabel: 'Cancel',

            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.deletePermission(item);
            }
        });
    }

    getPermissionLevelLabel(levelId: number | null | undefined): string {
        if (levelId == null) {
            return '-';
        }

        const option = this.permissionLevels.find((x) => x.value === levelId);

        if (option) {
            return option.label;
        }

        if (levelId >= 4) {
            return `${levelId} - Full Access`;
        }

        return levelId.toString();
    }

    private deletePermission(item: UserRolePermission): void {
        this.service.delete(item.permissionId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Role Permission deleted successfully.'
                });

                if (this.items.length === 1 && this.first > 0) {
                    this.first = Math.max(0, this.first - this.rows);
                }

                this.loadData();
            },

            error: (error) => {
                this.showError(this.getErrorMessage(error, 'Unable to delete user role permission.'));
            }
        });
    }

    private loadRoleLookup(): void {
        this.roleLoading = true;

        this.userRoleService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'roleNo',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.roles = (result.items ?? []).filter((x) => !x.isInactive);

                    this.roleLoading = false;
                },

                error: (error) => {
                    this.roleLoading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load roles.'));
                }
            });
    }

    private loadMenuLookup(): void {
        this.menuLoading = true;

        this.menuSetupService
            .getPage({
                page: 1,
                pageSize: 200,
                sortField: 'menuName',
                sortDirection: 'asc'
            })
            .subscribe({
                next: (result) => {
                    this.menus = (result.items ?? []).filter((x) => !x.isInactive);

                    this.menuLoading = false;
                },

                error: (error) => {
                    this.menuLoading = false;

                    this.showError(this.getErrorMessage(error, 'Unable to load menus.'));
                }
            });
    }

    private createEmptyForm() {
        return {
            roleId: null as number | null,

            menuId: null as number | null,

            levelId: 1 as number | null,

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

    private async loadAllBulkMenus(): Promise<void> {
        const requestId = ++this.bulkMenuRequestId;

        this.bulkMenusLoaded = false;
        this.bulkMenuLoading = true;
        this.bulkMenuLoadError = false;

        try {
            const pageSize = 200;
            let page = 1;
            let totalPages = 1;
            let expectedTotalCount: number | null = null;

            const allMenus: MenuSetup[] = [];

            do {
                const result = await firstValueFrom(
                    this.menuSetupService.getPage({
                        page,
                        pageSize,
                        sortField: 'menuName',
                        sortDirection: 'asc'
                    })
                );

                // Request cũ hoặc Dialog đã đóng
                if (requestId !== this.bulkMenuRequestId || !this.bulkDialogVisible) {
                    return;
                }

                const pageItems = result.items;

                if (!Array.isArray(pageItems)) {
                    throw new Error('Invalid menu page response.');
                }

                const totalCount = result.totalCount;
                const reportedTotalPages = result.totalPages;

                if (typeof totalCount !== 'number' || !Number.isInteger(totalCount) || totalCount < 0 || typeof reportedTotalPages !== 'number' || !Number.isInteger(reportedTotalPages) || reportedTotalPages < 1) {
                    throw new Error('Invalid menu pagination metadata.');
                }

                if (expectedTotalCount === null) {
                    expectedTotalCount = totalCount;
                } else if (expectedTotalCount !== totalCount) {
                    throw new Error('Menu total count changed during loading.');
                }

                if (reportedTotalPages !== Math.max(1, Math.ceil(totalCount / pageSize))) {
                    throw new Error('Inconsistent menu page count.');
                }

                if (pageItems.length !== Math.min(pageSize, Math.max(0, totalCount - (page - 1) * pageSize))) {
                    throw new Error('Incomplete menu page.');
                }

                allMenus.push(...pageItems);

                totalPages = reportedTotalPages;
                page++;
            } while (page <= totalPages);

            const menuIds = new Set<number>();

            for (const menu of allMenus) {
                if (!Number.isInteger(menu.menuId) || menu.menuId <= 0 || menuIds.has(menu.menuId)) {
                    throw new Error('Invalid or duplicate menu ID.');
                }

                menuIds.add(menu.menuId);
            }

            if (allMenus.length !== expectedTotalCount) {
                throw new Error('Incomplete menu list.');
            }

            const activeMenus = allMenus.filter((menu) => !menu.isInactive);

            // Chỉ cập nhật khi request còn hợp lệ
            if (requestId !== this.bulkMenuRequestId || !this.bulkDialogVisible) {
                return;
            }

            this.menus = activeMenus;
            this.bulkMenuLoadError = false;

            this.bulkRows = activeMenus.map((menu) => ({
                menuId: menu.menuId,
                menuNo: menu.menuNo ?? '',
                menuName: menu.menuName ?? '',
                routerLink: menu.routerLink ?? '',
                selected: false,
                levelId: 1
            }));

            // Chỉ đánh dấu thành công sau khi tải và tạo đủ danh sách Menu
            this.bulkMenusLoaded = true;
        } catch (error) {
            if (requestId !== this.bulkMenuRequestId || !this.bulkDialogVisible) {
                return;
            }

            console.error('Failed to load bulk menus:', error);

            this.bulkMenusLoaded = false;
            this.bulkMenuLoadError = true;
            this.bulkRows = [];

            this.showError('Unable to load menu list.');
        } finally {
            if (requestId === this.bulkMenuRequestId) {
                this.bulkMenuLoading = false;
                this.cdr.detectChanges();
            }
        }
    }

    openBulkPermission(): void {
        // Vô hiệu hóa request Permission cũ
        ++this.bulkPermissionRequestId;

        // Reset dữ liệu
        this.bulkRoleId = null;
        this.bulkLoadedRoleId = null;
        this.bulkMenusLoaded = false;
        this.bulkSearchText = '';
        this.bulkRows = [];

        // Reset Loading
        this.bulkPermissionLoading = false;

        // Reset lỗi API
        this.bulkMenuLoadError = false;
        this.bulkPermissionLoadError = false;

        // Mở Dialog
        this.bulkDialogVisible = true;

        // Tải Menu mới nhất
        void this.loadAllBulkMenus();
    }

    closeBulkPermission(): void {
        // Không cho đóng Dialog khi đang lưu dữ liệu
        if (this.bulkSaving) {
            return;
        }

        // Vô hiệu hóa các request cũ
        ++this.bulkMenuRequestId;
        ++this.bulkPermissionRequestId;

        // Reset Loading
        this.bulkMenuLoading = false;
        this.bulkPermissionLoading = false;

        // Reset lỗi API
        this.bulkMenuLoadError = false;
        this.bulkPermissionLoadError = false;

        // Đóng Dialog
        this.bulkLoadedRoleId = null;
        this.bulkMenusLoaded = false;
        this.bulkDialogVisible = false;
    }

    get filteredBulkRows(): BulkPermissionRow[] {
        const keyword = this.bulkSearchText.trim().toLowerCase();

        if (!keyword) {
            return this.bulkRows;
        }

        return this.bulkRows.filter((row) => row.menuNo.toLowerCase().includes(keyword) || row.menuName.toLowerCase().includes(keyword) || row.routerLink.toLowerCase().includes(keyword));
    }

    get bulkSelectedCount(): number {
        return this.bulkRows.filter((row) => row.selected).length;
    }

    get canSaveBulkPermissions(): boolean {
        // Dialog phải đang mở
        if (!this.bulkDialogVisible) {
            return false;
        }

        // Phải tải hoàn tất toàn bộ danh sách Menu
        if (!this.bulkMenusLoaded) {
            return false;
        }

        // Phải chọn Role hợp lệ
        if (this.bulkRoleId === null || !Number.isInteger(this.bulkRoleId) || this.bulkRoleId <= 0 || this.bulkRoleId === 1) {
            return false;
        }

        // Permission phải được tải thành công cho đúng Role đang chọn
        if (this.bulkLoadedRoleId !== this.bulkRoleId) {
            return false;
        }

        // Không được đang tải dữ liệu
        if (this.bulkMenuLoading || this.bulkPermissionLoading) {
            return false;
        }

        // Không được có lỗi API
        if (this.bulkMenuLoadError || this.bulkPermissionLoadError) {
            return false;
        }

        // Phải có danh sách Menu
        if (this.bulkRows.length === 0) {
            return false;
        }

        // Tất cả Menu được chọn phải có Permission Level hợp lệ
        return this.bulkRows.filter((row) => row.selected).every((row) => [1, 2, 3, 4].includes(row.levelId));
    }

    private buildBulkPermissionItems(): {
        menuId: number;
        levelId: number;
        isInactive: boolean;
        note: string | null;
    }[] {
        if (!this.canSaveBulkPermissions) {
            return [];
        }

        return this.bulkRows.map((row) => ({
            menuId: row.menuId,
            levelId: row.levelId,
            isInactive: !row.selected,
            note: null
        }));
    }

    confirmBulkSave(): void {
        if (this.bulkSaving || !this.canSaveBulkPermissions) {
            return;
        }

        const roleId = this.bulkRoleId;

        if (roleId === null || roleId === 1) {
            return;
        }

        const role = this.roles.find((x) => x.roleId === roleId);

        const roleName = role?.roleName ?? `Role ID ${roleId}`;

        const selectedCount = this.bulkRows.filter((row) => row.selected).length;

        const unselectedCount = this.bulkRows.length - selectedCount;

        // Snapshot toàn bộ dữ liệu tại thời điểm xác nhận
        const permissionSnapshot = JSON.stringify(
            this.bulkRows
                .map((row) => ({
                    menuId: row.menuId,
                    selected: row.selected,
                    levelId: row.levelId
                }))
                .sort((a, b) => a.menuId - b.menuId)
        );

        const warning = selectedCount === 0 ? 'WARNING: All existing permissions for active menus in this role will be deactivated.' : 'Unselected menus will have their existing permissions deactivated.';

        this.confirmationService.confirm({
            key: 'bulkPermissionConfirm',

            header: 'Confirm Bulk Permission Synchronization',

            icon: 'pi pi-exclamation-triangle',

            message: `Role: ${roleName}\n` + `Selected menus: ${selectedCount}\n` + `Unselected menus: ${unselectedCount}\n\n` + warning,

            acceptLabel: 'Confirm Save',

            rejectLabel: 'Cancel',

            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                // Prevent saving if the Role or selection changed
                // while the confirmation dialog was open.
                if (this.bulkRoleId !== roleId || !this.canSaveBulkPermissions || this.bulkSaving) {
                    return;
                }

                // Kiểm tra dữ liệu có thay đổi sau khi mở ConfirmDialog không
                const currentSnapshot = JSON.stringify(
                    this.bulkRows
                        .map((row) => ({
                            menuId: row.menuId,
                            selected: row.selected,
                            levelId: row.levelId
                        }))
                        .sort((a, b) => a.menuId - b.menuId)
                );

                if (currentSnapshot !== permissionSnapshot) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Permission Changed',
                        detail: 'Permission data has changed. Please review and confirm again.'
                    });

                    return;
                }

                this.bulkSaveConfirmed = true;
                this.saveBulkPermissions();
            }
        });
    }

    private saveBulkPermissions(): void {
        if (!this.bulkSaveConfirmed) {
            return;
        }

        // Xác nhận chỉ được sử dụng một lần.
        this.bulkSaveConfirmed = false;

        if (this.bulkSaving || !this.canSaveBulkPermissions) {
            return;
        }

        const roleId = this.bulkRoleId;

        if (roleId === null || roleId === 1) {
            return;
        }

        const permissions = this.buildBulkPermissionItems();

        if (permissions.length === 0) {
            return;
        }

        this.bulkSaving = true;

        this.service.bulkSave(roleId, { permissions }).subscribe({
            next: () => {
                this.bulkSaving = false;

                // Refresh main permission table
                this.loadData();

                // Refresh Bulk Dialog only if the same Role is still selected
                if (this.bulkDialogVisible && this.bulkRoleId === roleId) {
                    this.onBulkRoleChange();
                }

                this.cdr.detectChanges();

                // Display success notification after initiating refresh
                console.log('[Bulk Save] Before Toast');

                this.messageService.add({
                    severity: 'success',
                    summary: 'Bulk Save Success',
                    detail: `${permissions.length} permissions synchronized successfully.`,
                    life: 10000
                });

                console.log('[Bulk Save] After Toast');

                this.cdr.detectChanges();
            },

            error: (error) => {
                this.bulkSaving = false;

                let detail = 'Unable to save bulk permissions.';

                if (error.status === 403) {
                    detail = 'You do not have permission to manage role permissions.';
                } else if (error.status === 400) {
                    detail = error.error?.detail || error.error?.message || 'Invalid permission data.';
                } else if (error.status === 409) {
                    detail = 'Permission data conflict. Please refresh and try again.';
                } else if (error.status === 0) {
                    detail = 'Cannot connect to the server.';
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Bulk Save Failed',
                    detail
                });

                this.cdr.detectChanges();
            }
        });
    }

    selectAllBulkMenus(): void {
        this.filteredBulkRows.forEach((row) => {
            row.selected = true;
        });
    }

    clearBulkSelection(): void {
        this.filteredBulkRows.forEach((row) => {
            row.selected = false;
        });
    }

    onBulkRoleChange(): void {
        // Không xử lý thay đổi Role trong khi Bulk Save
        if (this.bulkSaving) {
            return;
        }

        const requestId = ++this.bulkPermissionRequestId;
        const roleId = this.bulkRoleId;

        this.bulkLoadedRoleId = null;
        this.bulkPermissionLoadError = false;

        // Reset quyền khi chuyển Role
        this.bulkRows.forEach((row) => {
            row.selected = false;
            row.levelId = 1;
        });

        // Xác định trạng thái Loading một lần
        const shouldLoad = roleId !== null && !this.bulkMenuLoading && this.bulkDialogVisible;

        this.bulkPermissionLoading = shouldLoad;

        if (!shouldLoad || roleId === null) {
            return;
        }

        this.service.getByRole(roleId).subscribe({
            next: (permissions: UserRolePermission[]) => {
                if (requestId !== this.bulkPermissionRequestId || this.bulkRoleId !== roleId || !this.bulkDialogVisible) {
                    return;
                }

                const permissionMap = new Map<number, UserRolePermission>(permissions.filter((p) => p.isInactive !== true).map((p): [number, UserRolePermission] => [p.menuId, p]));

                this.bulkRows.forEach((row) => {
                    const permission = permissionMap.get(row.menuId);

                    if (permission) {
                        row.selected = true;
                        row.levelId = permission.levelId ?? 1;
                    }
                });

                // Xác nhận Permission đã tải thành công cho Role hiện tại
                this.bulkLoadedRoleId = roleId;

                this.bulkPermissionLoadError = false;
                this.bulkPermissionLoading = false;
                this.cdr.detectChanges();
            },

            error: (error: unknown) => {
                if (requestId !== this.bulkPermissionRequestId || this.bulkRoleId !== roleId || !this.bulkDialogVisible) {
                    return;
                }

                console.error('Failed to load role permissions:', error);

                this.bulkLoadedRoleId = null;
                this.bulkPermissionLoadError = true;
                this.bulkPermissionLoading = false;
                this.cdr.detectChanges();

                this.showError('Unable to load existing role permissions.');
            }
        });
    }
}
