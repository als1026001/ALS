import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-bao-co',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './bao-co.component.html',
    styleUrl: './bao-co.component.scss'
})
export class BaoCoComponent {
    fromDate = '';
    toDate = '';

    searchText = '';

    receipts = [
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

    get filteredReceipts() {
        if (!this.searchText) {
            return this.receipts;
        }

        const keyword = this.searchText.toLowerCase();

        return this.receipts.filter((item) => item.number.toLowerCase().includes(keyword) || item.customer.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword));
    }

    get totalAmount() {
        return this.filteredReceipts.reduce((total, item) => total + item.amount, 0);
    }

    addNew() {
        console.log('Thêm báo có');
    }

    edit() {
        console.log('Sửa báo có');
    }

    delete() {
        console.log('Xóa báo có');
    }

    print() {
        console.log('In báo có');
    }

    refresh() {
        console.log('Làm mới dữ liệu');
    }

    viewDetail(item: any) {
        console.log('Xem chi tiết:', item);
    }

    formatMoney(value: number) {
        return new Intl.NumberFormat('vi-VN').format(value);
    }
}
