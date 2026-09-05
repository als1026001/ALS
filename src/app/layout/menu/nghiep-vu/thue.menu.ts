import { AppMenuItem } from '../menu.types';

export const THUE_MENU: AppMenuItem =
    // =====================================================
    // THUẾ
    // =====================================================
    {
        label: 'Thuế',
        icon: 'pi pi-fw pi-file',
        path: '/pages/nghiep-vu/thue',

        items: [
            {
                label: 'Kê khai / Thuế GTGT',
                icon: 'pi pi-fw pi-file-edit',
                path: '/pages/nghiep-vu/thue/ke-khai',

                items: [
                    {
                        label: 'Duyệt số liệu thuế',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/pages/nghiep-vu/thue/duyet-so-lieu']
                    },
                    {
                        label: 'So sánh chứng từ thuế',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['/pages/nghiep-vu/thue/so-sanh-chung-tu']
                    },
                    {
                        label: 'So sánh kho thuế',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/thue/so-sanh-kho']
                    }
                ]
            },

            {
                label: 'Hóa đơn',
                icon: 'pi pi-fw pi-file',
                path: '/pages/nghiep-vu/thue/hoa-don',

                items: [
                    {
                        label: 'Hóa đơn bán hàng',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/pages/nghiep-vu/thue/hoa-don-ban-hang']
                    },
                    {
                        label: 'Hóa đơn xuất trả',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/thue/hoa-don-xuat-tra']
                    },
                    {
                        label: 'Hóa đơn thay thế',
                        icon: 'pi pi-fw pi-refresh',
                        routerLink: ['/pages/nghiep-vu/thue/hoa-don-thay-the']
                    },
                    {
                        label: 'Hóa đơn điều chỉnh',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/nghiep-vu/thue/hoa-don-dieu-chinh']
                    },
                    {
                        label: 'Hóa đơn tổng',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/thue/hoa-don-tong']
                    },
                    {
                        label: 'Hóa đơn đơn vị lý',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/nghiep-vu/thue/hoa-don-don-vi-ly']
                    },
                    {
                        label: 'In HĐ đã phát hành',
                        icon: 'pi pi-fw pi-print',
                        routerLink: ['/pages/nghiep-vu/thue/in-hoa-don']
                    }
                ]
            },

            {
                label: 'Bảng kê thuế',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/thue/bang-ke',

                items: [
                    {
                        label: 'Bảng kê thuế đầu vào',
                        icon: 'pi pi-fw pi-arrow-down',
                        routerLink: ['/pages/nghiep-vu/thue/bang-ke-dau-vao']
                    },
                    {
                        label: 'Bảng kê thuế đầu ra',
                        icon: 'pi pi-fw pi-arrow-up',
                        routerLink: ['/pages/nghiep-vu/thue/bang-ke-dau-ra']
                    }
                ]
            },

            {
                label: 'Báo cáo thuế',
                icon: 'pi pi-fw pi-chart-bar',
                path: '/pages/nghiep-vu/thue/bao-cao',

                items: [
                    {
                        label: 'Báo cáo hóa đơn chi tiết',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/nghiep-vu/thue/bao-cao-hoa-don']
                    },
                    {
                        label: 'Báo cáo tồn kho thuế',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/thue/ton-kho-thue']
                    },
                    {
                        label: 'Báo cáo NXT kho thuế',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/thue/nxt-kho-thue']
                    },
                    {
                        label: 'Báo cáo thẻ kho thuế',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['/pages/nghiep-vu/thue/the-kho-thue']
                    }
                ]
            },

            {
                label: 'Danh mục',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/thue/danh-muc',

                items: [
                    {
                        label: 'Danh mục tài khoản',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/thue/danh-muc-tai-khoan']
                    },
                    {
                        label: 'Danh mục đối tượng',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/nghiep-vu/thue/danh-muc-doi-tuong']
                    },
                    {
                        label: 'Danh mục hàng hóa dịch vụ',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/thue/danh-muc-hang-hoa']
                    }
                ]
            }
        ]
    };
