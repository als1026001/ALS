import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaoCo, BaoCoService, BaoCoAccounting } from './bao-co.service';

/**
 * Model dữ liệu Báo có.
 */

interface BaoCoForm {
    date: string;
    customer: string;
    description: string;
    account: string;
    amount: number | null;
}

/**
 * Dữ liệu form định khoản.
 */
interface AccountingForm {
    debitAccount: string;
    creditAccount: string;
    amount: number | null;
    description: string;
}

@Component({
    selector: 'app-bao-co',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './bao-co.component.html',
    styleUrl: './bao-co.component.scss'
})
export class BaoCoComponent implements OnInit {
    constructor(private readonly baoCoService: BaoCoService) {}
    // ============================================================
    // FILTER
    // ============================================================

    fromDate = '';
    toDate = '';
    searchText = '';

    // ============================================================
    // FORM
    // ============================================================

    /**
     * Điều khiển trạng thái hiển thị form.
     */
    showForm = false;

    /**
     * Tiêu đề của form.
     *
     * Hiện tại dùng cho chức năng Thêm.
     * Sau này chức năng Sửa sẽ tái sử dụng form này.
     */
    formTitle = 'Thêm báo có';

    /**
     * Dữ liệu đang nhập trên form.
     */
    formData: BaoCoForm = this.createEmptyForm();

    /**
     * Chứng từ đang được chỉnh sửa.
     *
     * null = đang thêm mới.
     * Có giá trị = đang sửa chứng từ đó.
     */
    editingReceipt: BaoCo | null = null;

    // ============================================================
    // ACCOUNTING FORM
    // ============================================================

    /**
     * Điều khiển hiển thị form định khoản.
     */
    showAccountingForm = false;

    /**
     * Chứng từ đang được định khoản.
     */
    accountingReceipt: BaoCo | null = null;

    /**
     * Dữ liệu đang nhập trên form định khoản.
     */
    accountingForm: AccountingForm = this.createEmptyAccountingForm();

    /**
     * Định khoản hiện tại của chứng từ.
     *
     * null = chứng từ chưa có định khoản.
     */
    currentAccounting: BaoCoAccounting | null = null;

    // ============================================================
    // DETAIL
    // ============================================================

    /**
     * Điều khiển modal xem chi tiết.
     */
    showDetail = false;

    /**
     * Chứng từ đang được xem chi tiết.
     */
    detailReceipt: BaoCo | null = null;

    // ============================================================
    // DATA
    // ============================================================

    /**
     * Danh sách chứng từ Báo có.
     *
     * Dữ liệu được lấy từ BaoCoService.
     */
    receipts: BaoCo[] = [];

    /**
     * Khi component được khởi tạo,
     * lấy dữ liệu từ Service/localStorage.
     */
    ngOnInit(): void {
        this.loadReceipts();
    }

    /**
     * Load danh sách chứng từ từ Service.
     *
     * checked chỉ là trạng thái giao diện,
     * không phải dữ liệu nghiệp vụ.
     *
     * Vì vậy mỗi lần load lại trang phải reset checked = false.
     */
    private loadReceipts(): void {
        this.receipts = this.baoCoService.getReceipts().map((item) => ({
            ...item,
            checked: false
        }));
    }

    // ============================================================
    // SELECTION
    // ============================================================

    selectedReceipt: BaoCo | null = null;

    selectedReceipts: BaoCo[] = [];

    // ============================================================
    // FILTERED DATA
    // ============================================================

    /**
     * Danh sách chứng từ sau khi áp dụng bộ lọc.
     *
     * Quan trọng:
     * Không sử dụng Date để so sánh ngày chứng từ.
     *
     * Tất cả ngày được chuẩn hóa về:
     *
     *     YYYY-MM-DD
     *
     * Ví dụ:
     *
     *     18/08/2026 -> 2026-08-18
     *
     * Input type="date" cũng trả về:
     *
     *     2026-08-18
     *
     * Vì vậy có thể so sánh trực tiếp bằng chuỗi.
     *
     * Cách này tránh lỗi timezone khiến ngày 18/08
     * có thể bị lệch thành ngày 17/08.
     */
    get filteredReceipts(): BaoCo[] {
        const keyword = this.searchText.trim().toLowerCase();

        return this.receipts.filter((item) => {
            // ----------------------------------------------------
            // CHUẨN HÓA NGÀY CHỨNG TỪ
            // ----------------------------------------------------

            const itemDate = this.toInputDate(item.date);

            // ----------------------------------------------------
            // LỌC TỪ NGÀY
            // ----------------------------------------------------

            const matchFrom = !this.fromDate || itemDate >= this.fromDate;

            // ----------------------------------------------------
            // LỌC ĐẾN NGÀY
            // ----------------------------------------------------

            const matchTo = !this.toDate || itemDate <= this.toDate;

            // ----------------------------------------------------
            // LỌC TỪ KHÓA
            // ----------------------------------------------------

            const matchKeyword = !keyword || item.number.toLowerCase().includes(keyword) || item.customer.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword) || item.account.toLowerCase().includes(keyword);

            return matchFrom && matchTo && matchKeyword;
        });
    }

    // ============================================================
    // TOTAL
    // ============================================================

    /**
     * Tổng tiền của các chứng từ sau khi lọc.
     */
    get totalAmount(): number {
        return this.filteredReceipts.reduce((total, item) => total + item.amount, 0);
    }

    // ============================================================
    // ADD
    // ============================================================

    addNew(): void {
        // Không phải chế độ sửa.
        this.editingReceipt = null;

        // Tạo form mới.
        this.formData = this.createEmptyForm();

        // Tiêu đề form.
        this.formTitle = 'Thêm báo có';

        // Hiển thị form.
        this.showForm = true;
    }

    // ============================================================
    // SAVE FORM
    // ============================================================

    /**
     * Lưu dữ liệu từ form.
     *
     * Hiện tại đây là chức năng thêm mới.
     * Sau này khi làm Sửa, hàm này sẽ được mở rộng để
     * xử lý cả thêm và cập nhật.
     */
    saveForm(): void {
        // ==========================================================
        // VALIDATE
        // ==========================================================

        if (!this.formData.date) {
            alert('Vui lòng chọn ngày.');
            return;
        }

        if (!this.formData.customer.trim()) {
            alert('Vui lòng nhập đối tượng.');
            return;
        }

        if (!this.formData.description.trim()) {
            alert('Vui lòng nhập nội dung.');
            return;
        }

        if (!this.formData.account.trim()) {
            alert('Vui lòng nhập tài khoản.');
            return;
        }

        if (this.formData.amount === null || this.formData.amount <= 0) {
            alert('Vui lòng nhập số tiền lớn hơn 0.');
            return;
        }

        // ==========================================================
        // EDIT
        // ==========================================================

        if (this.editingReceipt) {
            const receipt = this.editingReceipt;

            /**
             * Cập nhật đúng chứng từ đang sửa.
             *
             * Không tạo số chứng từ mới.
             * Không thay đổi trạng thái ghi sổ.
             */
            const updatedReceipt: BaoCo = {
                ...receipt,

                date: this.formatDisplayDate(this.formData.date),

                customer: this.formData.customer.trim(),

                description: this.formData.description.trim(),

                account: this.formData.account.trim(),

                amount: this.formData.amount
            };

            this.baoCoService.updateReceipt(updatedReceipt);

            this.loadReceipts();

            // Đóng form.
            this.closeForm();

            alert(`Đã cập nhật chứng từ ${updatedReceipt.number}.`);

            return;
        }

        // ==========================================================
        // ADD
        // ==========================================================

        const newReceipt: BaoCo = {
            checked: false,

            date: this.formatDisplayDate(this.formData.date),

            number: this.baoCoService.generateNumber(),

            customer: this.formData.customer.trim(),

            description: this.formData.description.trim(),

            account: this.formData.account.trim(),

            amount: this.formData.amount,

            // Chứng từ mới mặc định chưa ghi sổ.
            status: 'Chưa ghi sổ'
        };

        // Thêm chứng từ vào danh sách.
        this.baoCoService.addReceipt(newReceipt);

        this.loadReceipts();

        // Đóng form.
        this.closeForm();

        alert(`Đã thêm chứng từ ${newReceipt.number}.`);
    }

    // ============================================================
    // CLOSE FORM
    // ============================================================

    /**
     * Đóng form thêm/sửa.
     */
    closeForm(): void {
        this.showForm = false;

        // Xóa trạng thái đang sửa.
        this.editingReceipt = null;
    }

    // ============================================================
    // CREATE EMPTY FORM
    // ============================================================

    /**
     * Tạo dữ liệu mặc định cho form.
     */
    private createEmptyForm(): BaoCoForm {
        return {
            date: this.getToday(),
            customer: '',
            description: '',
            account: '1121',
            amount: null
        };
    }

    // ============================================================
    // GET TODAY
    // ============================================================

    /**
     * Lấy ngày hiện tại theo format YYYY-MM-DD.
     *
     * Format này phù hợp với:
     *
     * <input type="date">
     *
     * Không sử dụng toISOString() để tránh vấn đề timezone.
     */
    private getToday(): string {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');

        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // ============================================================
    // EDIT
    // ============================================================

    edit(): void {
        // ----------------------------------------------------------
        // PHẢI CHỌN ĐÚNG 1 CHỨNG TỪ
        // ----------------------------------------------------------

        if (this.selectedReceipts.length === 0) {
            alert('Vui lòng chọn một chứng từ để sửa.');
            return;
        }

        if (this.selectedReceipts.length > 1) {
            alert('Chỉ được chọn một chứng từ để sửa.');
            return;
        }

        const receipt = this.selectedReceipts[0];

        // ----------------------------------------------------------
        // LƯU CHỨNG TỪ ĐANG SỬA
        // ----------------------------------------------------------

        this.editingReceipt = receipt;

        // ----------------------------------------------------------
        // ĐƯA DỮ LIỆU VÀO FORM
        // ----------------------------------------------------------

        this.formData = {
            date: this.toInputDate(receipt.date),

            customer: receipt.customer,

            description: receipt.description,

            account: receipt.account,

            amount: receipt.amount
        };

        // ----------------------------------------------------------
        // HIỂN THỊ FORM
        // ----------------------------------------------------------

        this.formTitle = 'Sửa báo có';

        this.showForm = true;
    }

    // ============================================================
    // DELETE
    // ============================================================

    delete(): void {
        if (this.selectedReceipts.length === 0) {
            alert('Vui lòng chọn chứng từ cần xóa.');
            return;
        }

        const confirmed = confirm(`Bạn có chắc muốn xóa ${this.selectedReceipts.length} chứng từ?`);

        if (!confirmed) {
            return;
        }

        const numbers = this.selectedReceipts.map((item) => item.number);

        this.baoCoService.deleteReceipts(numbers);

        this.loadReceipts();

        this.clearSelection();

        alert('Đã xóa chứng từ.');
    }

    // ============================================================
    // PRINT
    // ============================================================

    /**
     * In danh sách Báo có.
     *
     * Chỉ cần gọi window.print().
     *
     * Phần nào được in / không được in
     * sẽ được xử lý bằng CSS @media print
     * trong file bao-co.component.scss.
     */
    print(): void {
        window.print();
    }

    // ============================================================
    // REFRESH
    // ============================================================

    refresh(): void {
        // ----------------------------------------------------------
        // LOAD LẠI DỮ LIỆU TỪ SERVICE / LOCALSTORAGE
        // ----------------------------------------------------------

        this.loadReceipts();

        // ----------------------------------------------------------
        // RESET BỘ LỌC
        // ----------------------------------------------------------

        this.clearFilter();

        // ----------------------------------------------------------
        // RESET LỰA CHỌN
        // ----------------------------------------------------------

        this.clearSelection();

        alert('Đã làm mới dữ liệu.');
    }

    // ============================================================
    // FILTER
    // ============================================================

    /**
     * Thực hiện lọc.
     *
     * filteredReceipts là getter nên Angular sẽ tự động
     * cập nhật danh sách khi fromDate, toDate hoặc searchText
     * thay đổi.
     */
    filter(): void {
        console.log('Bộ lọc:', {
            fromDate: this.fromDate,
            toDate: this.toDate,
            searchText: this.searchText
        });
    }

    // ============================================================
    // CLEAR FILTER
    // ============================================================

    /**
     * Xóa toàn bộ điều kiện lọc.
     */
    clearFilter(): void {
        this.fromDate = '';
        this.toDate = '';
        this.searchText = '';
    }

    // ============================================================
    // SELECT ROW
    // ============================================================

    /**
     * Chọn một chứng từ.
     *
     * Khi click vào dòng:
     * - Bỏ chọn các chứng từ khác.
     * - Chọn chứng từ hiện tại.
     * - Đồng bộ checkbox.
     *
     * Cách này giúp:
     * - Dòng được chọn
     * - Checkbox được tick
     * - Nút Sửa/Xóa/Nhân bản/Định khoản
     * luôn hoạt động đúng.
     */
    selectReceipt(item: BaoCo): void {
        // Bỏ chọn tất cả chứng từ trước đó.
        this.receipts.forEach((receipt) => {
            receipt.checked = false;
        });

        // Chọn chứng từ hiện tại.
        item.checked = true;

        // Đồng bộ selection.
        this.updateSelection();
    }

    // ============================================================
    // UPDATE CHECKBOX SELECTION
    // ============================================================

    /**
     * Đồng bộ danh sách chứng từ đang được chọn.
     *
     * selectedReceipts:
     * - Dùng cho Xóa.
     * - Dùng cho Ghi sổ.
     *
     * selectedReceipt:
     * - Chứng từ đầu tiên đang được chọn.
     * - Dùng cho Sửa, Nhân bản, Định khoản.
     */
    updateSelection(): void {
        this.selectedReceipts = this.receipts.filter((item) => item.checked);

        this.selectedReceipt = this.selectedReceipts[0] ?? null;
    }

    // ============================================================
    // SELECT ALL
    // ============================================================

    /**
     * Kiểm tra toàn bộ chứng từ đang hiển thị đã được chọn chưa.
     */
    isAllSelected(): boolean {
        const list = this.filteredReceipts;

        return list.length > 0 && list.every((item) => item.checked);
    }

    /**
     * Chọn hoặc bỏ chọn toàn bộ chứng từ đang hiển thị.
     */
    toggleAll(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        this.filteredReceipts.forEach((item) => {
            item.checked = checked;
        });

        this.updateSelection();
    }

    // ============================================================
    // POST / GHI SỔ
    // ============================================================

    /**
     * Ghi sổ các chứng từ đang được chọn.
     *
     * Việc cập nhật dữ liệu được thực hiện thông qua Service
     * để trạng thái được lưu vào localStorage.
     */
    post(): void {
        // ----------------------------------------------------------
        // KIỂM TRA CHỌN CHỨNG TỪ
        // ----------------------------------------------------------

        if (this.selectedReceipts.length === 0) {
            alert('Vui lòng chọn chứng từ cần ghi sổ.');
            return;
        }

        // ----------------------------------------------------------
        // CHỈ GHI SỔ CHỨNG TỪ CHƯA GHI SỔ
        // ----------------------------------------------------------

        const unpostedReceipts = this.selectedReceipts.filter((item) => item.status === 'Chưa ghi sổ');

        if (unpostedReceipts.length === 0) {
            alert('Các chứng từ đã chọn đều đã ghi sổ.');
            return;
        }

        // ----------------------------------------------------------
        // XÁC NHẬN
        // ----------------------------------------------------------

        const confirmed = confirm(`Bạn có chắc muốn ghi sổ ${unpostedReceipts.length} chứng từ?`);

        if (!confirmed) {
            return;
        }

        // ----------------------------------------------------------
        // LẤY SỐ CHỨNG TỪ
        // ----------------------------------------------------------

        const numbers = unpostedReceipts.map((item) => item.number);

        // ----------------------------------------------------------
        // LƯU THAY ĐỔI
        // ----------------------------------------------------------

        this.baoCoService.postReceipts(numbers);

        // ----------------------------------------------------------
        // LOAD LẠI DỮ LIỆU
        // ----------------------------------------------------------

        this.loadReceipts();

        // ----------------------------------------------------------
        // BỎ CHỌN
        // ----------------------------------------------------------

        this.clearSelection();

        // ----------------------------------------------------------
        // THÔNG BÁO
        // ----------------------------------------------------------

        alert(`Đã ghi sổ ${unpostedReceipts.length} chứng từ.`);
    }

    // ============================================================
    // DUPLICATE
    // ============================================================

    /**
     * Nhân bản chứng từ đang chọn.
     *
     * Việc tạo và lưu chứng từ mới được giao cho Service
     * để dữ liệu được lưu vào localStorage.
     */
    duplicate(): void {
        // ----------------------------------------------------------
        // KIỂM TRA CHỌN CHỨNG TỪ
        // ----------------------------------------------------------

        if (!this.selectedReceipt) {
            alert('Vui lòng chọn chứng từ cần nhân bản.');
            return;
        }

        // ----------------------------------------------------------
        // NHÂN BẢN VÀ LƯU DỮ LIỆU
        // ----------------------------------------------------------

        const newReceipt = this.baoCoService.duplicateReceipt(this.selectedReceipt);

        // ----------------------------------------------------------
        // LOAD LẠI DỮ LIỆU TỪ SERVICE
        // ----------------------------------------------------------

        this.loadReceipts();

        // ----------------------------------------------------------
        // BỎ CHỌN CHỨNG TỪ
        // ----------------------------------------------------------

        this.clearSelection();

        // ----------------------------------------------------------
        // THÔNG BÁO
        // ----------------------------------------------------------

        alert(`Đã nhân bản thành chứng từ ${newReceipt.number}.`);
    }

    // ============================================================
    // ACCOUNTING
    // ============================================================

    /**
     * Mở form định khoản cho chứng từ đang chọn.
     */
    accounting(): void {
        if (!this.selectedReceipt) {
            alert('Vui lòng chọn chứng từ.');
            return;
        }

        // Lưu chứng từ đang định khoản.
        this.accountingReceipt = this.selectedReceipt;

        // Lấy định khoản đã lưu trước đó.
        const existingAccounting = this.baoCoService.getAccounting(this.selectedReceipt.number);

        if (existingAccounting) {
            // Nếu đã có định khoản thì hiển thị lại dữ liệu cũ.
            this.currentAccounting = existingAccounting;

            this.accountingForm = {
                debitAccount: existingAccounting.debitAccount,
                creditAccount: existingAccounting.creditAccount,
                amount: existingAccounting.amount,
                description: existingAccounting.description
            };
        } else {
            // Nếu chưa có định khoản thì tạo form mới.
            this.currentAccounting = null;

            this.accountingForm = {
                debitAccount: '',
                creditAccount: this.selectedReceipt.account,
                amount: this.selectedReceipt.amount,
                description: this.selectedReceipt.description
            };
        }

        this.showAccountingForm = true;
    }

    /**
     * Tạo form định khoản mặc định.
     */
    private createEmptyAccountingForm(): AccountingForm {
        return {
            debitAccount: '',
            creditAccount: '',
            amount: null,
            description: ''
        };
    }

    /**
     * Lưu định khoản.
     */
    saveAccounting(): void {
        // ----------------------------------------------------------
        // KIỂM TRA CHỨNG TỪ
        // ----------------------------------------------------------

        if (!this.accountingReceipt) {
            alert('Không xác định được chứng từ cần định khoản.');
            return;
        }

        // ----------------------------------------------------------
        // CHUẨN HÓA DỮ LIỆU NHẬP
        // ----------------------------------------------------------

        const debitAccount = this.accountingForm.debitAccount.trim();
        const creditAccount = this.accountingForm.creditAccount.trim();
        const description = this.accountingForm.description.trim();

        // ----------------------------------------------------------
        // VALIDATE TÀI KHOẢN NỢ
        // ----------------------------------------------------------

        if (!debitAccount) {
            alert('Vui lòng nhập tài khoản Nợ.');
            return;
        }

        // ----------------------------------------------------------
        // VALIDATE TÀI KHOẢN CÓ
        // ----------------------------------------------------------

        if (!creditAccount) {
            alert('Vui lòng nhập tài khoản Có.');
            return;
        }

        // ----------------------------------------------------------
        // KHÔNG CHO NỢ = CÓ
        // ----------------------------------------------------------

        if (debitAccount === creditAccount) {
            alert('Tài khoản Nợ và tài khoản Có không được giống nhau.');
            return;
        }

        // ----------------------------------------------------------
        // VALIDATE SỐ TIỀN
        // ----------------------------------------------------------

        if (this.accountingForm.amount === null || this.accountingForm.amount <= 0) {
            alert('Vui lòng nhập số tiền lớn hơn 0.');
            return;
        }

        // ----------------------------------------------------------
        // SỐ TIỀN ĐỊNH KHOẢN PHẢI BẰNG CHỨNG TỪ
        // ----------------------------------------------------------

        if (this.accountingForm.amount !== this.accountingReceipt.amount) {
            alert(`Số tiền định khoản phải bằng số tiền chứng từ (${this.formatMoney(this.accountingReceipt.amount)}).`);
            return;
        }

        // ----------------------------------------------------------
        // TẠO ĐỊNH KHOẢN
        // ----------------------------------------------------------

        const accounting: BaoCoAccounting = {
            documentNumber: this.accountingReceipt.number,

            debitAccount,

            creditAccount,

            amount: this.accountingForm.amount,

            description
        };

        // ----------------------------------------------------------
        // LƯU LOCALSTORAGE
        // ----------------------------------------------------------

        this.baoCoService.saveAccounting(accounting);

        // Cập nhật trạng thái hiện tại.
        this.currentAccounting = accounting;

        // ----------------------------------------------------------
        // ĐÓNG FORM
        // ----------------------------------------------------------

        this.closeAccountingForm();

        alert(`Đã lưu định khoản chứng từ ${accounting.documentNumber}.`);
    }

    /**
     * Đóng form định khoản.
     */
    closeAccountingForm(): void {
        this.showAccountingForm = false;

        this.accountingReceipt = null;

        this.currentAccounting = null;

        this.accountingForm = this.createEmptyAccountingForm();
    }

    // ============================================================
    // VIEW DETAIL
    // ============================================================

    /**
     * Mở modal xem chi tiết chứng từ.
     *
     * Đây là màn hình chỉ đọc.
     * Không cho phép chỉnh sửa trực tiếp tại đây.
     */
    viewDetail(item: BaoCo): void {
        this.detailReceipt = item;
        this.showDetail = true;
    }

    /**
     * Đóng modal xem chi tiết.
     */
    closeDetail(): void {
        this.showDetail = false;
        this.detailReceipt = null;
    }

    // ============================================================
    // FORMAT MONEY
    // ============================================================

    /**
     * Format số tiền theo định dạng Việt Nam.
     *
     * Ví dụ:
     *
     * 25000000 -> 25.000.000
     */
    formatMoney(value: number): string {
        return new Intl.NumberFormat('vi-VN').format(value);
    }

    // ============================================================
    // PRINT DATE
    // ============================================================

    /**
     * Lấy ngày hiện tại để hiển thị trên báo cáo in.
     *
     * Format:
     * DD/MM/YYYY
     */
    getPrintDate(): string {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        return `${day}/${month}/${year}`;
    }

    // ============================================================
    // DATE CONVERSION
    // ============================================================

    /**
     * Chuyển ngày hiển thị:
     *
     *     DD/MM/YYYY
     *
     * thành:
     *
     *     YYYY-MM-DD
     *
     * Đây chính là format mà input type="date" sử dụng.
     *
     * Ví dụ:
     *
     *     18/08/2026
     *
     * thành:
     *
     *     2026-08-18
     */
    private toInputDate(value: string): string {
        const [day, month, year] = value.split('/');

        return `${year}-${month}-${day}`;
    }

    /**
     * Chuyển ngày từ:
     *
     * YYYY-MM-DD
     *
     * sang:
     *
     * DD/MM/YYYY
     */
    formatDisplayDate(value: string): string {
        if (!value) {
            return '';
        }

        const [year, month, day] = value.split('-');

        return `${day}/${month}/${year}`;
    }

    // ============================================================
    // CLEAR SELECTION
    // ============================================================

    /**
     * Bỏ toàn bộ lựa chọn hiện tại.
     */
    private clearSelection(): void {
        this.receipts.forEach((item) => (item.checked = false));

        this.selectedReceipts = [];
        this.selectedReceipt = null;
    }
}
