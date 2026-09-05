import { AppMenuItem } from '../menu.types';

export const KHO_HANG_MENU: AppMenuItem =
    // =====================================================
    // KHO HÀNG
    // =====================================================
    {
        label: 'Kho hàng',
        icon: 'pi pi-fw pi-box',
        path: '/pages/kho-hang',

        items: [
            {
                label: 'Nhập / Xuất kho',
                icon: 'pi pi-fw pi-arrows-v',
                path: '/pages/nghiep-vu/kho-hang/nhap-xuat',

                items: [
                    {
                        label: 'Phiếu nhập kho',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/kho-hang/phieu-nhap']
                    },
                    {
                        label: 'Phiếu xuất kho',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/kho-hang/phieu-xuat']
                    },
                    {
                        label: 'Xuất chuyển kho',
                        icon: 'pi pi-fw pi-arrow-right',
                        routerLink: ['/pages/nghiep-vu/kho-hang/xuat-chuyen-kho']
                    },
                    {
                        label: 'Quản lý chuyển kho',
                        icon: 'pi pi-fw pi-sync',
                        routerLink: ['/pages/nghiep-vu/kho-hang/quan-ly-chuyen-kho']
                    },
                    {
                        label: 'Nhập chuyển kho',
                        icon: 'pi pi-fw pi-arrow-left',
                        routerLink: ['/pages/nghiep-vu/kho-hang/nhap-chuyen-kho']
                    },
                    {
                        label: 'Nhập trả hàng bán',
                        icon: 'pi pi-fw pi-replay',
                        routerLink: ['/pages/nghiep-vu/kho-hang/nhap-tra-hang']
                    },
                    {
                        label: 'Quản lý trả hàng theo yêu cầu',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/kho-hang/quan-ly-tra-hang']
                    },
                    {
                        label: 'Xuất trả hàng',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/kho-hang/xuat-tra-hang']
                    },
                    {
                        label: 'Kiểm kê kho',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/pages/nghiep-vu/kho-hang/kiem-ke']
                    },
                    {
                        label: 'Nhập điều chỉnh',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/kho-hang/nhap-dieu-chinh']
                    },
                    {
                        label: 'Xuất điều chỉnh',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/kho-hang/xuat-dieu-chinh']
                    },
                    {
                        label: 'Xuất khác',
                        icon: 'pi pi-fw pi-external-link',
                        routerLink: ['/pages/nghiep-vu/kho-hang/xuat-khac']
                    }
                ]
            },

            {
                label: 'Giá vốn',
                icon: 'pi pi-fw pi-money-bill',
                path: '/pages/nghiep-vu/kho-hang/gia-von',

                items: [
                    {
                        label: 'Quản lý giá vốn',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/kho-hang/quan-ly-gia-von']
                    },
                    {
                        label: 'Xem lịch sử giá',
                        icon: 'pi pi-fw pi-history',
                        routerLink: ['/pages/nghiep-vu/kho-hang/lich-su-gia']
                    }
                ]
            },

            {
                label: 'Danh mục',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/kho-hang/danh-muc',

                items: [
                    {
                        label: 'Danh mục kho hàng',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/pages/nghiep-vu/kho-hang/danh-muc-kho']
                    },
                    {
                        label: 'Danh mục hàng hóa dịch vụ',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/kho-hang/danh-muc-hang-hoa']
                    },
                    {
                        label: 'Mã vạch hàng hóa',
                        icon: 'pi pi-fw pi-tag',
                        routerLink: ['/pages/nghiep-vu/kho-hang/ma-vach']
                    }
                ]
            },

            {
                label: 'Báo cáo',
                icon: 'pi pi-fw pi-chart-bar',
                path: '/pages/nghiep-vu/kho-hang/bao-cao',

                items: [
                    {
                        label: 'Bảng kê phiếu nhập',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/kho-hang/bang-ke-phieu-nhap']
                    },
                    {
                        label: 'Bảng kê phiếu xuất',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/kho-hang/bang-ke-phieu-xuat']
                    },
                    {
                        label: 'Tồn kho tức thời',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/kho-hang/ton-kho-tuc-thoi']
                    },
                    {
                        label: 'Báo cáo nhập xuất tồn',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/kho-hang/bao-cao-nhap-xuat-ton']
                    },
                    {
                        label: 'Thẻ kho',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['/pages/nghiep-vu/kho-hang/the-kho']
                    }
                ]
            }
        ]
    };
