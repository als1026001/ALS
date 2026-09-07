import { Component, OnInit } from '@angular/core';

import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';

import { formatMoney } from '../../../../../shared/utils/number.utils';

import { BaoNo, BaoNoAccounting, BaoNoService } from './bao-no.service';

import { FormsModule } from '@angular/forms';

import { toInputDate } from '../../../../../shared/utils/date.utils';

interface AccountingForm {
    debitAccount: string;
    creditAccount: string;
    amount: number | null;
    description: string;
}

interface BaoNoForm {
    date: string;
    number: string;

    customer: string;
    address: string;
    representative: string;

    description: string;
    note: string;
    attachmentNote: string;

    currencyCode: string;
    exchangeRate: number | null;

    account: string;
    amount: number | null;
}

@Component({
    selector: 'app-bao-no',
    standalone: true,
    imports: [FormsModule, EmptyStateComponent, StatusBadgeComponent],
    templateUrl: './bao-no.component.html',
    styleUrl: './bao-no.component.scss'
})
export class BaoNoComponent implements OnInit {
    receipts: BaoNo[] = [];

    filteredReceipts: BaoNo[] = [];

    fromDate = '';
    toDate = '';
    searchText = '';

    constructor(private readonly baoNoService: BaoNoService) {}

    ngOnInit(): void {
        this.loadReceipts();
    }

    private loadReceipts(): void {
        this.receipts = this.baoNoService
            .getReceipts()
            .map((item) => ({
                ...item,
                checked: false
            }))
            .sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));

        this.filteredReceipts = [...this.receipts];
    }

    formatMoney(value: number | null | undefined): string {
        return formatMoney(value);
    }

    get selectedReceipts(): BaoNo[] {
        return this.receipts.filter((item) => item.checked);
    }

    get selectedCount(): number {
        return this.selectedReceipts.length;
    }

    get totalAmount(): number {
        return this.filteredReceipts.reduce((total, item) => total + item.amount, 0);
    }

    get allChecked(): boolean {
        return this.filteredReceipts.length > 0 && this.filteredReceipts.every((item) => item.checked);
    }

    toggleAll(checked: boolean): void {
        const visibleNumbers = new Set(this.filteredReceipts.map((item) => item.number));

        this.receipts.forEach((item) => {
            if (visibleNumbers.has(item.number)) {
                item.checked = checked;
            }
        });

        this.filteredReceipts.forEach((item) => {
            item.checked = checked;
        });
    }

    toggleReceipt(item: BaoNo, checked: boolean): void {
        item.checked = checked;
    }

    filter(): void {
        this.receipts.forEach((item) => {
            item.checked = false;
        });

        const keyword = this.searchText.trim().toLowerCase();

        this.filteredReceipts = this.receipts.filter((item) => {
            const itemDate = this.toComparableDate(item.date);

            const matchesFromDate = !this.fromDate || itemDate >= this.fromDate;

            const matchesToDate = !this.toDate || itemDate <= this.toDate;

            const matchesKeyword = !keyword || item.number.toLowerCase().includes(keyword) || item.customer.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword) || item.account.toLowerCase().includes(keyword);

            return matchesFromDate && matchesToDate && matchesKeyword;
        });
    }

    clearFilter(): void {
        this.fromDate = '';
        this.toDate = '';
        this.searchText = '';

        this.receipts.forEach((item) => {
            item.checked = false;
        });

        this.filteredReceipts = [...this.receipts];
    }

    private toComparableDate(value: string): string {
        const [day, month, year] = value.split('/');

        if (!day || !month || !year) {
            return value;
        }

        return `${year}-${month}-${day}`;
    }

    addNew(): void {
        this.formMode = 'add';
        this.editingReceiptNumber = null;

        this.baoNoForm = {
            date: '',
            number: this.baoNoService.generateReceiptNumber(),

            customer: '',
            address: '',
            representative: '',

            description: '',
            note: '',
            attachmentNote: '',

            currencyCode: 'VND',
            exchangeRate: 1,

            account: '1121',
            amount: null
        };

        this.showForm = true;
    }

    edit(): void {
        const selected = this.selectedReceipt;

        if (!selected) {
            return;
        }

        this.formMode = 'edit';
        this.editingReceiptNumber = selected.number;

        this.baoNoForm = {
            date: this.toInputDate(selected.date),
            number: selected.number,

            customer: selected.customer,
            address: selected.address,
            representative: selected.representative,

            description: selected.description,
            note: selected.note,
            attachmentNote: selected.attachmentNote,

            currencyCode: selected.currencyCode,
            exchangeRate: selected.exchangeRate,

            account: selected.account,
            amount: selected.amount
        };

        this.showForm = true;
    }

    delete(): void {
        const selected = this.selectedReceipts;

        if (selected.length === 0) {
            return;
        }

        const message = selected.length === 1 ? `Bạn có chắc muốn xóa chứng từ ${selected[0].number}?` : `Bạn có chắc muốn xóa ${selected.length} chứng từ đã chọn?`;

        if (!confirm(message)) {
            return;
        }

        const documentNumbers = selected.map((item) => item.number);

        this.baoNoService.deleteReceipts(documentNumbers);

        this.loadReceipts();
        this.clearFilter();
    }

    print(): void {
        window.print();
    }

    refresh(): void {
        this.loadReceipts();
        this.clearFilter();
    }

    post(): void {
        const receiptsToPost = this.selectedReceipts.filter((item) => item.status === 'Chưa ghi sổ');

        if (receiptsToPost.length === 0) {
            alert('Các chứng từ đã chọn đều đã được ghi sổ.');
            return;
        }

        const selectedNumbers = new Set(receiptsToPost.map((item) => item.number));

        const receiptsToSave = this.receipts.map((item) => {
            if (!selectedNumbers.has(item.number)) {
                return item;
            }

            return {
                ...item,
                status: 'Đã ghi sổ' as const
            };
        });

        this.receipts = this.baoNoService.postReceipts(receiptsToSave);

        this.filteredReceipts = [...this.receipts];
    }

    get selectedReceipt(): BaoNo | null {
        return this.selectedReceipts.length === 1 ? this.selectedReceipts[0] : null;
    }

    duplicate(): void {
        const selected = this.selectedReceipt;

        if (!selected) {
            return;
        }

        this.baoNoService.duplicateReceipt(selected);

        this.loadReceipts();
        this.clearFilter();
    }

    showAccountingForm = false;

    accountingReceipt: BaoNo | null = null;

    accountingForm: AccountingForm = this.createEmptyAccountingForm();

    currentAccounting: BaoNoAccounting | null = null;

    accounting(): void {
        const selected = this.selectedReceipt;

        if (!selected) {
            return;
        }

        this.accountingReceipt = selected;

        const existingAccounting = this.baoNoService.getAccounting(selected.number);

        if (existingAccounting) {
            this.currentAccounting = existingAccounting;

            this.accountingForm = {
                debitAccount: existingAccounting.debitAccount,
                creditAccount: existingAccounting.creditAccount,
                amount: existingAccounting.amount,
                description: existingAccounting.description
            };
        } else {
            this.currentAccounting = null;

            this.accountingForm = {
                debitAccount: selected.account,
                creditAccount: '',
                amount: selected.amount,
                description: selected.description
            };
        }

        this.showAccountingForm = true;
    }

    closeAccountingForm(): void {
        this.showAccountingForm = false;
        this.accountingReceipt = null;
        this.currentAccounting = null;
        this.accountingForm = this.createEmptyAccountingForm();
    }

    saveAccounting(): void {
        if (!this.accountingReceipt) {
            alert('Không xác định được chứng từ cần định khoản.');
            return;
        }

        const debitAccount = this.accountingForm.debitAccount.trim();

        const creditAccount = this.accountingForm.creditAccount.trim();

        const description = this.accountingForm.description.trim();

        if (!debitAccount) {
            alert('Vui lòng nhập tài khoản Nợ.');
            return;
        }

        if (!creditAccount) {
            alert('Vui lòng nhập tài khoản Có.');
            return;
        }

        if (debitAccount === creditAccount) {
            alert('Tài khoản Nợ và tài khoản Có không được giống nhau.');
            return;
        }

        if (this.accountingForm.amount === null || this.accountingForm.amount <= 0) {
            alert('Vui lòng nhập số tiền lớn hơn 0.');
            return;
        }

        if (this.accountingForm.amount !== this.accountingReceipt.amount) {
            alert(`Số tiền định khoản phải bằng số tiền chứng từ (${this.formatMoney(this.accountingReceipt.amount)}).`);
            return;
        }

        const accounting: BaoNoAccounting = {
            documentNumber: this.accountingReceipt.number,

            debitAccount,

            creditAccount,

            amount: this.accountingForm.amount,

            description
        };

        this.baoNoService.saveAccounting(accounting);

        this.currentAccounting = accounting;

        this.closeAccountingForm();

        alert(`Đã lưu định khoản chứng từ ${accounting.documentNumber}.`);
    }

    private createEmptyAccountingForm(): AccountingForm {
        return {
            debitAccount: '',
            creditAccount: '',
            amount: null,
            description: ''
        };
    }

    showDetail = false;

    detailReceipt: BaoNo | null = null;

    viewDetail(item: BaoNo): void {
        this.detailReceipt = item;
        this.showDetail = true;
    }

    closeDetail(): void {
        this.showDetail = false;
        this.detailReceipt = null;
    }

    toggleRow(item: BaoNo): void {
        item.checked = !item.checked;
    }

    showForm = false;

    baoNoForm: BaoNoForm = this.createEmptyForm();

    formMode: 'add' | 'edit' = 'add';

    editingReceiptNumber: string | null = null;

    closeForm(): void {
        this.showForm = false;

        this.formMode = 'add';
        this.editingReceiptNumber = null;

        this.baoNoForm = this.createEmptyForm();
    }

    saveForm(): void {
        const date = this.baoNoForm.date.trim();
        const customer = this.baoNoForm.customer.trim();
        const address = this.baoNoForm.address.trim();
        const representative = this.baoNoForm.representative.trim();
        const description = this.baoNoForm.description.trim();
        const note = this.baoNoForm.note.trim();
        const attachmentNote = this.baoNoForm.attachmentNote.trim();
        const currencyCode = this.baoNoForm.currencyCode.trim().toUpperCase();
        const account = this.baoNoForm.account.trim();

        if (!date) {
            alert('Vui lòng chọn ngày chứng từ.');
            return;
        }

        if (!customer) {
            alert('Vui lòng nhập đối tượng.');
            return;
        }

        if (!description) {
            alert('Vui lòng nhập nội dung.');
            return;
        }

        if (!currencyCode) {
            alert('Vui lòng nhập loại ngoại tệ.');
            return;
        }

        if (this.baoNoForm.exchangeRate === null || this.baoNoForm.exchangeRate <= 0) {
            alert('Tỷ giá phải lớn hơn 0.');
            return;
        }

        if (!account) {
            alert('Vui lòng nhập tài khoản.');
            return;
        }

        if (this.baoNoForm.amount === null || this.baoNoForm.amount <= 0) {
            alert('Vui lòng nhập số tiền lớn hơn 0.');
            return;
        }

        const [year, month, day] = date.split('-');

        const existingReceipt = this.formMode === 'edit' && this.editingReceiptNumber ? this.receipts.find((item) => item.number === this.editingReceiptNumber) : null;

        const receipt: BaoNo = {
            checked: false,
            date: `${day}/${month}/${year}`,
            number: this.baoNoForm.number,

            customer,
            address,
            representative,

            description,
            note,
            attachmentNote,

            currencyCode,
            exchangeRate: this.baoNoForm.exchangeRate,

            account,
            amount: this.baoNoForm.amount,
            status: existingReceipt?.status ?? 'Chưa ghi sổ'
        };

        if (this.formMode === 'add') {
            this.baoNoService.addReceipt(receipt);
        } else {
            if (!this.editingReceiptNumber) {
                return;
            }

            const existingReceipt = this.receipts.find((item) => item.number === this.editingReceiptNumber);

            const amountChanged = existingReceipt !== undefined && existingReceipt.amount !== receipt.amount;

            this.baoNoService.updateReceipt({
                ...receipt,
                number: this.editingReceiptNumber
            });

            if (amountChanged) {
                this.baoNoService.deleteAccounting(this.editingReceiptNumber);
            }
        }

        this.closeForm();
        this.loadReceipts();
        this.clearFilter();
    }

    private createEmptyForm(): BaoNoForm {
        return {
            date: '',
            number: '',

            customer: '',
            address: '',
            representative: '',

            description: '',
            note: '',
            attachmentNote: '',

            currencyCode: 'VND',
            exchangeRate: 1,

            account: '',
            amount: null
        };
    }

    private toInputDate(value: string): string {
        return toInputDate(value);
    }
}
