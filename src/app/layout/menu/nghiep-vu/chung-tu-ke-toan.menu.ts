import { AppMenuItem } from '../menu.types';

export const CHUNG_TU_KE_TOAN_MENU: AppMenuItem =
    // =====================================================
    // CHỨNG TỪ KẾ TOÁN
    // =====================================================
    {
        label: 'Chứng từ kế toán',
        icon: 'pi pi-fw pi-file-edit',
        path: '/pages/nghiep-vu/chung-tu-ke-toan',

        items: [
            {
                label: 'Chứng từ kế toán',
                icon: 'pi pi-fw pi-file',
                path: '/pages/nghiep-vu/chung-tu-ke-toan/chung-tu',

                items: [
                    {
                        label: 'Phiếu kế toán',
                        icon: 'pi pi-fw pi-file-edit',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/phieu-ke-toan']
                    },
                    {
                        label: 'Chứng từ bù trừ',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/chung-tu-bu-tru']
                    },
                    {
                        label: 'Tổng hợp phiếu kế toán',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/tong-hop-phieu']
                    },
                    {
                        label: 'Sổ chứng từ gốc',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-chung-tu-goc']
                    }
                ]
            },

            {
                label: 'Điều chỉnh / Định khoản',
                icon: 'pi pi-fw pi-calculator',
                path: '/pages/nghiep-vu/chung-tu-ke-toan/dinh-khoan',

                items: [
                    {
                        label: 'Bút toán điều chỉnh',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/but-toan-dieu-chinh']
                    },
                    {
                        label: 'Bút toán chuyển',
                        icon: 'pi pi-fw pi-arrow-right',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/but-toan-chuyen']
                    },
                    {
                        label: 'Bút toán khóa sổ',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/but-toan-khoa-so']
                    },
                    {
                        label: 'Chênh lệch tỷ giá',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/chenh-lech-ty-gia']
                    }
                ]
            },

            {
                label: 'Tiền lương',
                icon: 'pi pi-fw pi-users',
                path: '/pages/nghiep-vu/chung-tu-ke-toan/tien-luong',

                items: [
                    {
                        label: 'Nhận số liệu lương',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/nhan-so-lieu-luong']
                    },
                    {
                        label: 'Nhận số liệu lương T13',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/nhan-so-lieu-luong-t13']
                    },
                    {
                        label: 'Bút toán lương',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/but-toan-luong']
                    },
                    {
                        label: 'Bút toán khấu hao',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/but-toan-khau-hao']
                    }
                ]
            },

            {
                label: 'Phân bổ / Kết chuyển',
                icon: 'pi pi-fw pi-sync',
                path: '/pages/nghiep-vu/chung-tu-ke-toan/phan-bo',

                items: [
                    {
                        label: 'Bút toán phân bổ',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/but-toan-phan-bo']
                    }
                ]
            },

            {
                label: 'Sổ / Báo cáo kế toán',
                icon: 'pi pi-fw pi-chart-bar',
                path: '/pages/nghiep-vu/chung-tu-ke-toan/bao-cao',

                items: [
                    {
                        label: 'Sổ quỹ tiền mặt',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-quy']
                    },
                    {
                        label: 'Sổ tiền gửi ngân hàng',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-tien-gui']
                    },
                    {
                        label: 'Sổ chi tiết tài khoản',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-chi-tiet']
                    },
                    {
                        label: 'Sổ tổng hợp tài khoản',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-tong-hop']
                    },
                    {
                        label: 'Sổ tổng hợp tạm ứng',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-tam-ung']
                    },
                    {
                        label: 'Sổ cái tài khoản',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-cai']
                    },
                    {
                        label: 'Nhật ký chung',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/nhat-ky-chung']
                    },
                    {
                        label: 'Bảng kê thuế đầu vào',
                        icon: 'pi pi-fw pi-arrow-down',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/thue-dau-vao']
                    },
                    {
                        label: 'Bảng kê thuế đầu ra',
                        icon: 'pi pi-fw pi-arrow-up',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/thue-dau-ra']
                    },
                    {
                        label: 'Báo cáo tài chính',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/bao-cao-tai-chinh']
                    },
                    {
                        label: 'Cân đối phát sinh',
                        icon: 'pi pi-fw pi-chart-pie',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/can-doi-phat-sinh']
                    },
                    {
                        label: 'Báo cáo quản trị',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/bao-cao-quan-tri']
                    },
                    {
                        label: 'Công nợ phải thu tổng hợp',
                        icon: 'pi pi-fw pi-arrow-down',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/cong-no-phai-thu']
                    },
                    {
                        label: 'Công nợ phải trả tổng hợp',
                        icon: 'pi pi-fw pi-arrow-up',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/cong-no-phai-tra']
                    },
                    {
                        label: 'Sổ tổng hợp TK theo đối tượng',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-tk-theo-doi-tuong']
                    },
                    {
                        label: 'Sổ chi tiết chi phí',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-chi-tiet-chi-phi']
                    },
                    {
                        label: 'Sổ chi tiết doanh thu',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/pages/nghiep-vu/chung-tu-ke-toan/so-chi-tiet-doanh-thu']
                    }
                ]
            }
        ]
    };
