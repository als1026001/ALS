import { Injectable } from '@angular/core';

/**
 * Model dữ liệu Báo có.
 */
export interface BaoCo {
    checked: boolean;
    date: string;
    number: string;
    customer: string;
    description: string;
    account: string;
    amount: number;
    status: 'Đã ghi sổ' | 'Chưa ghi sổ';
}

/**
 * Model định khoản của chứng từ Báo có.
 *
 * Một chứng từ Báo có ở phiên bản hiện tại
 * gồm một cặp tài khoản Nợ / Có.
 */
export interface BaoCoAccounting {
    documentNumber: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class BaoCoService {
    /**
     * Key dùng để lưu dữ liệu Báo có trong localStorage.
     */
    private readonly STORAGE_KEY = 'als-erp-bao-co';
    /**
     * Key dùng để lưu định khoản Báo có.
     */
    private readonly ACCOUNTING_STORAGE_KEY = 'als-erp-bao-co-accounting';
    /**
     * Dữ liệu mẫu ban đầu.
     *
     * Chỉ được sử dụng khi localStorage chưa có dữ liệu.
     */
    private readonly defaultReceipts: BaoCo[] = [
        {
            checked: false,
            date: '18/08/2026',
            number: 'BC000001',
            customer: 'Công ty TNHH ABC',
            description: 'Khách hàng thanh toán tiền hàng',
            account: '1121',
            amount: 25000000,
            status: 'Đã ghi sổ'
        },
        {
            checked: false,
            date: '18/08/2026',
            number: 'BC000002',
            customer: 'Công ty XYZ',
            description: 'Thu tiền công nợ',
            account: '1121',
            amount: 15000000,
            status: 'Đã ghi sổ'
        },
        {
            checked: false,
            date: '17/08/2026',
            number: 'BC000003',
            customer: 'Nguyễn Văn A',
            description: 'Nộp tiền vào tài khoản ngân hàng',
            account: '1121',
            amount: 10000000,
            status: 'Chưa ghi sổ'
        }
    ];

    /**
     * Lấy danh sách Báo có.
     *
     * Nếu chưa có dữ liệu trong localStorage,
     * hệ thống sẽ sử dụng dữ liệu mẫu.
     */
    getReceipts(): BaoCo[] {
        const data = localStorage.getItem(this.STORAGE_KEY);

        if (!data) {
            const initialData = this.clone(this.defaultReceipts);

            this.saveReceipts(initialData);

            return initialData;
        }

        try {
            return JSON.parse(data) as BaoCo[];
        } catch {
            // Nếu dữ liệu localStorage bị lỗi,
            // quay về dữ liệu mẫu.
            const initialData = this.clone(this.defaultReceipts);

            this.saveReceipts(initialData);

            return initialData;
        }
    }

    /**
     * Lưu toàn bộ danh sách Báo có.
     */
    saveReceipts(receipts: BaoCo[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(receipts));
    }

    /**
     * Thêm một chứng từ mới.
     */
    addReceipt(receipt: BaoCo): void {
        const receipts = this.getReceipts();

        receipts.push(receipt);

        this.saveReceipts(receipts);
    }

    /**
     * Cập nhật một chứng từ.
     */
    updateReceipt(receipt: BaoCo): void {
        const receipts = this.getReceipts();

        const index = receipts.findIndex((item) => item.number === receipt.number);

        if (index === -1) {
            return;
        }

        receipts[index] = {
            ...receipt
        };

        this.saveReceipts(receipts);
    }

    /**
     * Xóa nhiều chứng từ.
     */
    deleteReceipts(numbers: string[]): void {
        // ----------------------------------------------------------
        // XÓA CHỨNG TỪ
        // ----------------------------------------------------------

        const receipts = this.getReceipts();

        const updatedReceipts = receipts.filter((item) => !numbers.includes(item.number));

        this.saveReceipts(updatedReceipts);

        // ----------------------------------------------------------
        // XÓA ĐỊNH KHOẢN LIÊN QUAN
        //
        // Tránh trường hợp chứng từ đã bị xóa nhưng
        // định khoản vẫn còn trong localStorage.
        // ----------------------------------------------------------

        const accountings = this.getAccountings();

        const updatedAccountings = accountings.filter((item) => !numbers.includes(item.documentNumber));

        localStorage.setItem(this.ACCOUNTING_STORAGE_KEY, JSON.stringify(updatedAccountings));
    }

    /**
     * Sinh số chứng từ tiếp theo.
     *
     * Ví dụ:
     *
     * BC000001
     * BC000002
     * BC000003
     *
     * => BC000004
     */
    generateNumber(): string {
        const receipts = this.getReceipts();

        const maxNumber = receipts.reduce((max, item) => {
            const number = Number(item.number.replace('BC', ''));

            return Math.max(max, number);
        }, 0);

        return `BC${String(maxNumber + 1).padStart(6, '0')}`;
    }

    /**
     * Ghi sổ các chứng từ.
     *
     * Chỉ những chứng từ đang "Chưa ghi sổ"
     * mới được chuyển sang "Đã ghi sổ".
     *
     * Sau khi cập nhật, dữ liệu được lưu vào localStorage.
     */
    postReceipts(numbers: string[]): void {
        const receipts = this.getReceipts();

        receipts.forEach((receipt) => {
            if (numbers.includes(receipt.number) && receipt.status === 'Chưa ghi sổ') {
                receipt.status = 'Đã ghi sổ';
            }
        });

        this.saveReceipts(receipts);
    }

    /**
     * Nhân bản một chứng từ.
     *
     * Chứng từ mới sẽ:
     * - Có số chứng từ mới.
     * - Giữ nguyên ngày, đối tượng, nội dung, tài khoản, số tiền.
     * - Mặc định chưa ghi sổ.
     * - Không được chọn.
     *
     * Dữ liệu sau khi nhân bản được lưu vào localStorage.
     */
    duplicateReceipt(receipt: BaoCo): BaoCo {
        const receipts = this.getReceipts();

        const newReceipt: BaoCo = {
            ...receipt,

            checked: false,

            number: this.generateNumber(),

            status: 'Chưa ghi sổ'
        };

        receipts.push(newReceipt);

        this.saveReceipts(receipts);

        return newReceipt;
    }

    /**
     * Lấy toàn bộ định khoản đã lưu.
     */
    getAccountings(): BaoCoAccounting[] {
        const data = localStorage.getItem(this.ACCOUNTING_STORAGE_KEY);

        if (!data) {
            return [];
        }

        try {
            return JSON.parse(data) as BaoCoAccounting[];
        } catch {
            return [];
        }
    }

    /**
     * Lấy định khoản của một chứng từ.
     */
    getAccounting(documentNumber: string): BaoCoAccounting | null {
        const accountings = this.getAccountings();

        return accountings.find((item) => item.documentNumber === documentNumber) ?? null;
    }

    /**
     * Lưu hoặc cập nhật định khoản.
     *
     * Nếu chứng từ đã có định khoản:
     *     cập nhật định khoản cũ.
     *
     * Nếu chưa có:
     *     thêm định khoản mới.
     */
    saveAccounting(accounting: BaoCoAccounting): void {
        const accountings = this.getAccountings();

        const index = accountings.findIndex((item) => item.documentNumber === accounting.documentNumber);

        if (index === -1) {
            accountings.push(accounting);
        } else {
            accountings[index] = accounting;
        }

        localStorage.setItem(this.ACCOUNTING_STORAGE_KEY, JSON.stringify(accountings));
    }

    /**
     * Tạo bản sao dữ liệu.
     *
     * Tránh việc component thao tác trực tiếp
     * lên dữ liệu mặc định.
     */
    private clone<T>(data: T): T {
        return JSON.parse(JSON.stringify(data));
    }
}
