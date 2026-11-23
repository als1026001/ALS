import {
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectorRef,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';

import { ActiveSessionService } from '../../../core/services/active-session.service';
import { ActiveSession } from '../../../core/models/active-session.model';

import { PermissionService } from '../../../core/services/permission.service';

@Component({
    selector: 'app-active-sessions',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TagModule,
        DialogModule
    ],
    templateUrl: './active-sessions.html'
})
export class ActiveSessionsComponent implements OnInit, OnDestroy {
    private readonly service = inject(ActiveSessionService);
    private readonly permissions = inject(PermissionService);
    private readonly cdr = inject(ChangeDetectorRef);

    items: ActiveSession[] = [];
    page = 1;
    pageSize = 20;
    totalCount = 0;
    loading = false;
    acting = false;
    errorMessage = '';

    canDeleteSessions = false;
    selected: ActiveSession | null = null;
    confirmVisible = false;

    private timerId?: ReturnType<typeof setInterval>;
    private pageRequest?: Subscription;
    private actionRequest?: Subscription;
    private permissionRequest?: Subscription;

    ngOnInit(): void {
        this.loadForceLogoutPermission();
        this.loadPage();

        // Refresh the administrator's table every 30 seconds.
        this.timerId = setInterval(() => this.loadPage(true), 30000);
    }

        private loadForceLogoutPermission(): void {
        this.canDeleteSessions = false;
        this.permissionRequest?.unsubscribe();
        this.permissionRequest = this.permissions.getRouteAccess('/activeSessions', true).subscribe({
            next: access => {
                this.canDeleteSessions = access.canDelete === true;
                this.cdr.markForCheck();
            },
            error: () => {
                this.canDeleteSessions = false;
                this.cdr.markForCheck();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId);
        }
        this.pageRequest?.unsubscribe();
        this.actionRequest?.unsubscribe();
        this.permissionRequest?.unsubscribe();
    }

    loadPage(silent = false): void {
        if (!silent) this.loading = true;

        this.pageRequest?.unsubscribe();
        this.pageRequest = this.service.getPage({
            page: this.page,
            pageSize: this.pageSize
        }).subscribe({
            next: result => {
                this.items = result.items ?? [];
                this.totalCount = result.totalCount ?? 0;
                this.errorMessage = '';
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                this.loading = false;
                this.errorMessage =
                    error.status === 403
                        ? 'Bạn không có quyền xem phiên đăng nhập.'
                        : error.status === 401
                        ? 'Phiên đăng nhập đã hết hiệu lực.'
                        : 'Không tải được danh sách phiên.';
                this.cdr.markForCheck();
            }
        });
    }

    previousPage(): void {
        if (this.page <= 1) return;
        this.page--;
        this.loadPage();
    }

    nextPage(): void {
        if (this.page * this.pageSize >= this.totalCount) return;
        this.page++;
        this.loadPage();
    }

    refresh(): void {
        this.loadPage();
    }

    deviceLabel(userAgent: string | null): string {
        if (!userAgent) return 'Không xác định';

        const os = /Windows/i.test(userAgent) ? 'Windows'
            : /Android/i.test(userAgent) ? 'Android'
            : /iPhone|iPad/i.test(userAgent) ? 'iOS/iPadOS'
            : /Mac OS X|Macintosh/i.test(userAgent) ? 'macOS'
            : /Linux/i.test(userAgent) ? 'Linux'
            : 'Thiết bị khác';

        const browser = /Edg\//i.test(userAgent) ? 'Edge'
            : /Firefox\//i.test(userAgent) ? 'Firefox'
            : /Chrome\//i.test(userAgent) ? 'Chrome'
            : /Safari\//i.test(userAgent) ? 'Safari'
            : 'Trình duyệt khác';

        return `${os} · ${browser}`;
    }

    onlineLabel(session: ActiveSession): string {
        return session.status ||
            (session.isOnline ? 'Online' : 'Offline');
    }

    onlineSeverity(
        session: ActiveSession
    ): 'success' | 'secondary' | 'danger' {
        if (session.revokedAtUtc) return 'danger';
        return session.isOnline ? 'success' : 'secondary';
    }

    canForceLogout(session: ActiveSession): boolean {
        const expiry = Date.parse(session.expiresAtUtc);

        return session.revokedAtUtc === null
            && Number.isFinite(expiry)
            && expiry > Date.now();
    }
    askForceLogout(session: ActiveSession): void {
        if (this.acting || !this.canDeleteSessions || !this.canForceLogout(session)) return;
        this.selected = session;
        this.confirmVisible = true;
    }

    cancelForceLogout(): void {
        if (this.acting) return;
        this.confirmVisible = false;
        this.selected = null;
    }

    confirmForceLogout(): void {
        if (!this.selected || this.acting || !this.canDeleteSessions || !this.canForceLogout(this.selected)) return;

        this.acting = true;
        this.errorMessage = '';

        this.actionRequest = this.service.forceLogout(
            this.selected
        ).subscribe({
            next: () => {
                this.acting = false;
                this.confirmVisible = false;
                this.selected = null;
                this.loadPage();
            },
            error: (error: HttpErrorResponse) => {
                this.acting = false;
                this.errorMessage = error.status === 403
                    ? 'Bạn không có quyền buộc đăng xuất phiên này.'
                    : 'Không thể buộc đăng xuất phiên.';
                this.confirmVisible = false;
                this.cdr.markForCheck();
            }
        });
    }
}