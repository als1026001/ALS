import { Injectable } from '@angular/core';

export interface BaoNo {
    checked: boolean;
    date: string;
    number: string;

    customer: string;
    address: string;
    representative: string;

    description: string;
    note: string;
    attachmentNote: string;

    currencyCode: string;
    exchangeRate: number;

    account: string;
    amount: number;

    status: 'Đã ghi sổ' | 'Chưa ghi sổ';
}

export interface BaoNoAccounting {
    documentNumber: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class BaoNoService {
    private readonly storageKey = 'als-erp-bao-no';

    private readonly accountingStorageKey = 'als-erp-bao-no-accounting';

    getReceipts(): BaoNo[] {
        const data = localStorage.getItem(this.storageKey);

        if (data) {
            try {
                const receipts = JSON.parse(data) as Partial<BaoNo>[];

                return receipts.map((item) => ({
                    checked: item.checked ?? false,
                    date: item.date ?? '',
                    number: item.number ?? '',
                    customer: item.customer ?? '',
                    address: item.address ?? '',
                    representative: item.representative ?? '',
                    description: item.description ?? '',
                    note: item.note ?? '',
                    attachmentNote: item.attachmentNote ?? '',
                    currencyCode: item.currencyCode ?? 'VND',
                    exchangeRate: item.exchangeRate ?? 1,
                    account: item.account ?? '',
                    amount: item.amount ?? 0,
                    status: item.status ?? 'Chưa ghi sổ'
                }));
            } catch {
                // Nếu dữ liệu localStorage lỗi thì dùng dữ liệu mẫu.
            }
        }

        const sampleData: BaoNo[] = [
            {
                checked: false,
                date: '02/09/2026',
                number: 'BN000001',
                customer: 'Công ty Minh An',
                address: '123 Đường ABC, Quận XYZ',
                representative: 'Nguyễn Văn A',
                description: 'Thanh toán tiền hàng',
                note: '',
                attachmentNote: '',
                currencyCode: 'VND',
                exchangeRate: 1,
                account: '1121',
                amount: 12500000,
                status: 'Chưa ghi sổ'
            },
            {
                checked: false,
                date: '01/09/2026',
                number: 'BN000002',
                customer: 'Nhà cung cấp Hòa Phát',
                address: '456 Đường DEF, Quận UVW',
                representative: 'Trần Thị B',
                description: 'Thanh toán công nợ',
                note: '',
                attachmentNote: '',
                currencyCode: 'VND',
                exchangeRate: 1,
                account: '1121',
                amount: 8200000,
                status: 'Đã ghi sổ'
            }
        ];

        this.saveReceipts(sampleData);

        return sampleData;
    }

    saveReceipts(receipts: BaoNo[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(receipts));
    }

    postReceipts(receipts: BaoNo[]): BaoNo[] {
        this.saveReceipts(receipts);

        return receipts;
    }

    duplicateReceipt(receipt: BaoNo): BaoNo[] {
        const receipts = this.getReceipts();

        const maxNumber = receipts.reduce((max, item) => {
            const value = Number(item.number.replace('BN', ''));

            return Number.isNaN(value) ? max : Math.max(max, value);
        }, 0);

        const newReceipt: BaoNo = {
            ...receipt,
            checked: false,
            number: `BN${String(maxNumber + 1).padStart(6, '0')}`,
            status: 'Chưa ghi sổ'
        };

        const updatedReceipts = [newReceipt, ...receipts];

        this.saveReceipts(updatedReceipts);

        return updatedReceipts;
    }

    getAccountings(): BaoNoAccounting[] {
        const data = localStorage.getItem(this.accountingStorageKey);

        if (!data) {
            return [];
        }

        try {
            return JSON.parse(data) as BaoNoAccounting[];
        } catch {
            return [];
        }
    }

    getAccounting(documentNumber: string): BaoNoAccounting | null {
        const accountings = this.getAccountings();

        return accountings.find((item) => item.documentNumber === documentNumber) ?? null;
    }

    saveAccounting(accounting: BaoNoAccounting): void {
        const accountings = this.getAccountings();

        const index = accountings.findIndex((item) => item.documentNumber === accounting.documentNumber);

        if (index === -1) {
            accountings.push(accounting);
        } else {
            accountings[index] = accounting;
        }

        localStorage.setItem(this.accountingStorageKey, JSON.stringify(accountings));
    }

    addReceipt(receipt: BaoNo): BaoNo[] {
        const receipts = this.getReceipts();

        const updatedReceipts = [receipt, ...receipts];

        this.saveReceipts(updatedReceipts);

        return updatedReceipts;
    }

    generateReceiptNumber(): string {
        const receipts = this.getReceipts();

        const maxNumber = receipts.reduce((max, item) => {
            const value = Number(item.number.replace('BN', ''));

            return Number.isNaN(value) ? max : Math.max(max, value);
        }, 0);

        return `BN${String(maxNumber + 1).padStart(6, '0')}`;
    }

    updateReceipt(receipt: BaoNo): BaoNo[] {
        const receipts = this.getReceipts();

        const updatedReceipts = receipts.map((item) =>
            item.number === receipt.number
                ? {
                      ...receipt,
                      checked: false
                  }
                : item
        );

        this.saveReceipts(updatedReceipts);

        return updatedReceipts;
    }

    deleteReceipts(documentNumbers: string[]): BaoNo[] {
        if (documentNumbers.length === 0) {
            return this.getReceipts();
        }

        const numbersToDelete = new Set(documentNumbers);

        const receipts = this.getReceipts();

        const updatedReceipts = receipts.filter((item) => !numbersToDelete.has(item.number));

        this.saveReceipts(updatedReceipts);

        // Xóa luôn định khoản của các chứng từ bị xóa.
        const accountings = this.getAccountings();

        const updatedAccountings = accountings.filter((item) => !numbersToDelete.has(item.documentNumber));

        localStorage.setItem(this.accountingStorageKey, JSON.stringify(updatedAccountings));

        return updatedReceipts;
    }

    deleteAccounting(documentNumber: string): void {
        const accountings = this.getAccountings();

        const updatedAccountings = accountings.filter((item) => item.documentNumber !== documentNumber);

        localStorage.setItem(this.accountingStorageKey, JSON.stringify(updatedAccountings));
    }
}
