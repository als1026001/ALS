import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import {
    AuditLog,
    AuditLogQuery
} from '../../../core/models/audit-log.model';

import {
    AuditLogService
} from '../../../core/services/audit-log.service';

@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AutoCompleteModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TableModule
    ],
    templateUrl: './audit-log.html',
    styleUrl: './audit-log.scss'
})
export class AuditLogComponent implements OnInit {
    private readonly service = inject(AuditLogService);
    // 80U.49L.15H.2 - Synchronize UI after page loading
    private readonly cdr = inject(ChangeDetectorRef);

    items: AuditLog[] = [];
    selected: AuditLog | null = null;

    loading = false;
    detailLoading = false;
    detailVisible = false;

    errorMessage = '';
    detailError = '';

    totalRecords = 0;
    first = 0;
    // 80U.49L.15G.2 - Fixed page size
    rows = 10;

    userName = '';
    action = '';
    auditType = '';
    tableName = '';
    recordId = '';

    fromDate = '';
    toDate = '';
    successFilter = '';

    auditAdvancedOpen = false;

    readonly commonActions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGIN_FAILURE', 'LOGOUT'];
    readonly commonTypes = ['DATA', 'SECURITY'];

    // 80U.49L.15F.2C - AutoComplete
    filteredUsers: string[] = [];
    filteredActions: string[] = [];
    filteredTypes: string[] = [];
    filteredTables: string[] = [];

    private filterSuggestions(
        values: string[],
        query: string
    ): string[] {
        const search = (query ?? '').trim().toLowerCase();

        return values.filter(value =>
            value.toLowerCase().includes(search)
        );
    }

    completeUsers(query: string): void {
        this.filteredUsers = this.filterSuggestions(
            this.auditUserSuggestions,
            query
        );
    }

    completeActions(query: string): void {
        this.filteredActions = this.filterSuggestions(
            this.auditActionSuggestions,
            query
        );
    }

    completeTypes(query: string): void {
        this.filteredTypes = this.filterSuggestions(
            this.auditTypeSuggestions,
            query
        );
    }

    completeTables(query: string): void {
        this.filteredTables = this.filterSuggestions(
            this.auditTableSuggestions,
            query
        );
    }

    get auditUserSuggestions(): string[] {
        return this.suggestionValues(this.items.map(x => x.userName));
    }

    get auditActionSuggestions(): string[] {
        return this.suggestionValues([...this.commonActions, ...this.items.map(x => x.action)]);
    }

    get auditTypeSuggestions(): string[] {
        return this.suggestionValues([...this.commonTypes, ...this.items.map(x => x.auditType)]);
    }

    get auditTableSuggestions(): string[] {
        return this.suggestionValues(this.items.map(x => x.tableName));
    }

    private suggestionValues(values: (string | null | undefined)[]): string[] {
        return Array.from(new Set(values.map(x => (x ?? '').trim()).filter(x => x.length > 0)))
            .sort((a, b) => a.localeCompare(b));
    }

    get auditActiveFilterCount(): number {
        return [this.userName, this.action, this.auditType, this.tableName,
            this.recordId, this.fromDate, this.toDate, this.successFilter]
            .filter(x => x.trim().length > 0).length;
    }
    private requestVersion = 0;

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.first = 0;
        this.loadPage();
    }

    clearFilters(): void {
        this.userName = '';
        this.action = '';
        this.auditType = '';
        this.tableName = '';
        this.recordId = '';
        this.fromDate = '';
        this.toDate = '';
        this.successFilter = '';
        this.refresh();
    }

    onLazyLoad(event: TableLazyLoadEvent): void {
        this.first = event.first ?? 0;
        // 80U.49L.15G.3 - Respect selected page size
        this.rows = event.rows ?? this.rows;
        this.loadPage();
    }

    loadPage(): void {
        const version = ++this.requestVersion;

        const from = this.toUtcIso(this.fromDate);
        const to = this.toUtcIso(this.toDate);

        if (this.fromDate && !from) {
            this.errorMessage = 'Invalid start date.';
            return;
        }

        if (this.toDate && !to) {
            this.errorMessage = 'Invalid end date.';
            return;
        }

        if (from && to && from >= to) {
            this.errorMessage =
                'Start date must be earlier than end date.';
            return;
        }

        const query: AuditLogQuery = {
            page: Math.floor(this.first / this.rows) + 1,
            pageSize: this.rows,
            userName: this.userName.trim() || undefined,
            action: this.action.trim() || undefined,
            auditType: this.auditType.trim() || undefined,
            tableName: this.tableName.trim() || undefined,
            recordId: this.recordId.trim() || undefined,
            fromDate: from,
            toDate: to,
            isSuccess: this.successFilter === ''
                ? undefined
                : this.successFilter === 'true'
        };

        this.loading = true;
        this.errorMessage = '';

        this.service.getPage(query)
            .pipe(finalize(() => {
                if (version === this.requestVersion) {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            }))
            .subscribe({
                next: result => {
                    if (version !== this.requestVersion) return;

                    this.items = result.items;
                    this.totalRecords = result.totalCount;
                },
                error: (error: HttpErrorResponse) => {
                    if (version !== this.requestVersion) return;

                    this.items = [];
                    this.totalRecords = 0;
                    this.errorMessage = this.getErrorMessage(error);
                }
            });
    }

    openDetail(item: AuditLog): void {
        this.selected = null;
        this.detailError = '';
        this.detailVisible = true;
        this.detailLoading = true;

        this.service.getById(item.auditId)
            .pipe(finalize(() => {
                this.detailLoading = false;
            }))
            .subscribe({
                next: result => {
                    this.selected = result;
                },
                error: (error: HttpErrorResponse) => {
                    this.detailError = this.getErrorMessage(error);
                }
            });
    }

    getChangedFields(item: AuditLog): {
        field: string;
        oldValue: string;
        newValue: string;
    }[] {
        const oldData = this.parseObject(item.oldValues);
        const newData = this.parseObject(item.newValues);

        const keys = new Set([
            ...Object.keys(oldData),
            ...Object.keys(newData)
        ]);

        return Array.from(keys)
            .filter(key =>
                JSON.stringify(oldData[key]) !==
                JSON.stringify(newData[key])
            )
            .map(key => ({
                field: key,
                oldValue: this.displayValue(oldData[key]),
                newValue: this.displayValue(newData[key])
            }));
    }

    private parseObject(value: string | null): Record<string, unknown> {
        if (!value) return {};

        try {
            const parsed: unknown = JSON.parse(value);

            if (
                parsed !== null &&
                typeof parsed === 'object' &&
                !Array.isArray(parsed)
            ) {
                return parsed as Record<string, unknown>;
            }
        } catch {
            // Raw JSON remains available below.
        }

        return {};
    }

    private displayValue(value: unknown): string {
        if (value === undefined) return '(missing)';
        if (value === null) return 'null';
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    }
    formatJson(value: string | null): string {
        if (!value) return '-';

        try {
            return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
            return value;
        }
    }

    private toUtcIso(value: string): string | undefined {
        if (!value) return undefined;

        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? undefined
            : date.toISOString();
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.status === 401) {
            return 'Session expired or login required.';
        }

        if (error.status === 403) {
            return 'Access denied. Audit Log View permission is required.';
        }

        if (error.status === 0) {
            return 'Cannot connect to the ERP API.';
        }

        return `Request failed (HTTP ${error.status}).`;
    }
}
