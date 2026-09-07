import { Injectable } from '@angular/core';

export interface BusinessPartner {
    id: string;
    code: string;
    name: string;

    address: string;
    representative: string;

    taxCode: string;

    partnerType: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';

    defaultReceivableAccount: string;
    defaultPayableAccount: string;

    active: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BusinessPartnerService {
    private readonly storageKey = 'als-erp-business-partners';

    getPartners(): BusinessPartner[] {
        const data = localStorage.getItem(this.storageKey);

        if (data) {
            try {
                return JSON.parse(data) as BusinessPartner[];
            } catch {
                // Nếu dữ liệu lỗi thì khởi tạo lại dữ liệu mẫu.
            }
        }

        const sampleData: BusinessPartner[] = [
            {
                id: 'DT000001',
                code: 'KH000001',
                name: 'Công ty Minh An',
                address: 'Hà Nội',
                representative: 'Nguyễn Văn An',
                taxCode: '0101234567',
                partnerType: 'CUSTOMER',
                defaultReceivableAccount: '131',
                defaultPayableAccount: '',
                active: true
            },
            {
                id: 'DT000002',
                code: 'NCC000001',
                name: 'Nhà cung cấp Hòa Phát',
                address: 'TP. Hồ Chí Minh',
                representative: 'Trần Văn Bình',
                taxCode: '0312345678',
                partnerType: 'SUPPLIER',
                defaultReceivableAccount: '',
                defaultPayableAccount: '331',
                active: true
            }
        ];

        this.savePartners(sampleData);

        return sampleData;
    }

    getActivePartners(): BusinessPartner[] {
        return this.getPartners().filter((item) => item.active);
    }

    getPartnerById(id: string): BusinessPartner | null {
        return this.getPartners().find((item) => item.id === id) ?? null;
    }

    savePartners(partners: BusinessPartner[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(partners));
    }
}
