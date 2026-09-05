import { AppMenuItem } from '../menu.types';

export const BAN_HANG_MENU: AppMenuItem =
    // =====================================================
    // BÁN HÀNG
    // =====================================================
    {
        label: 'Bán hàng',
        icon: 'pi pi-fw pi-shopping-bag',
        path: '/pages/nghiep-vu/ban-hang',

        items: [
            {
                label: 'Nghiệp vụ',
                icon: 'pi pi-fw pi-file-edit',
                path: '/pages/nghiep-vu/ban-hang',

                items: [
                    {
                        label: 'Đặt cọc',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/ban-hang/dat-coc']
                    },
                    {
                        label: 'Phiếu bán hàng',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/pages/nghiep-vu/ban-hang/phieu-ban-hang']
                    },
                    {
                        label: 'Nhập trả hàng bán',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/ban-hang/nhap-tra-hang']
                    },
                    {
                        label: 'Thu tiền công nợ',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/ban-hang/thu-tien-cong-no']
                    },
                    {
                        label: 'Bảng tổng kết phải thu',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/ban-hang/tong-ket-phai-thu']
                    },
                    {
                        label: 'Hóa đơn bán hàng',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/nghiep-vu/ban-hang/hoa-don-ban-hang']
                    },
                    {
                        label: 'Hoàn trả tiền đặt cọc',
                        icon: 'pi pi-fw pi-replay',
                        routerLink: ['/pages/nghiep-vu/ban-hang/hoan-tra-dat-coc']
                    }
                ]
            },

            {
                label: 'Danh mục',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/ban-hang/danh-muc',

                items: [
                    {
                        label: 'Danh mục khách hàng',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/nghiep-vu/ban-hang/danh-muc-khach-hang']
                    },
                    {
                        label: 'Danh mục hàng hóa dịch vụ',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/ban-hang/danh-muc-hang-hoa-dich-vu']
                    }
                ]
            },

            {
                label: 'Báo cáo',
                icon: 'pi pi-fw pi-chart-bar',
                path: '/pages/nghiep-vu/ban-hang/bao-cao',

                items: [
                    {
                        label: 'Báo cáo tồn kho',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/ban-hang/bao-cao-ton-kho']
                    },
                    {
                        label: 'Bảng kê bán hàng',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/ban-hang/bang-ke-ban-hang']
                    },
                    {
                        label: 'Hàng bán nhập trả lại',
                        icon: 'pi pi-fw pi-replay',
                        routerLink: ['/pages/nghiep-vu/ban-hang/hang-ban-nhap-tra']
                    },
                    {
                        label: 'Doanh số thường',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/pages/nghiep-vu/ban-hang/doanh-so']
                    },
                    {
                        label: 'Báo cáo công nợ phải thu tổng hợp',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/ban-hang/cong-no-phai-thu']
                    },
                    {
                        label: 'Công nợ phải thu chi tiết theo mặt hàng',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/ban-hang/cong-no-theo-mat-hang']
                    },
                    {
                        label: 'Báo cáo tồn đơn hàng giao hàng',
                        icon: 'pi pi-fw pi-truck',
                        routerLink: ['/pages/nghiep-vu/ban-hang/ton-don-giao-hang']
                    },
                    {
                        label: 'Phân tích doanh số khách hàng theo tháng',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/pages/nghiep-vu/ban-hang/phan-tich-doanh-so']
                    },
                    {
                        label: 'Báo cáo tổng hợp thu chi tiết',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/nghiep-vu/ban-hang/tong-hop-thu-chi']
                    },
                    {
                        label: 'Tuổi nợ khách hàng',
                        icon: 'pi pi-fw pi-clock',
                        routerLink: ['/pages/nghiep-vu/ban-hang/tuoi-no']
                    },
                    {
                        label: 'Báo cáo chi phí giao hàng',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/ban-hang/chi-phi-giao-hang']
                    },
                    {
                        label: 'Báo cáo giao hàng',
                        icon: 'pi pi-fw pi-truck',
                        routerLink: ['/pages/nghiep-vu/ban-hang/bao-cao-giao-hang']
                    },
                    {
                        label: 'Kết quả hoạt động kinh doanh',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/ban-hang/ket-qua-kinh-doanh']
                    },
                    {
                        label: 'Hiệu suất kinh doanh',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/pages/nghiep-vu/ban-hang/hieu-suat-kinh-doanh']
                    }
                ]
            }
        ]
    };
