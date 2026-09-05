import { AppMenuItem } from '../menu.types';

export const MUA_HANG_MENU: AppMenuItem =
    // =====================================================
    // MUA HÀNG
    // =====================================================
    {
        label: 'Mua hàng',
        icon: 'pi pi-fw pi-shopping-cart',
        path: '/pages/nghiep-vu/mua-hang',

        items: [
            {
                label: 'Nghiệp vụ',
                icon: 'pi pi-fw pi-file-edit',
                path: '/pages/nghiep-vu/mua-hang/nghiep-vu',

                items: [
                    {
                        label: 'Phiếu nhập hàng',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/mua-hang/phieu-nhap-hang']
                    },
                    {
                        label: 'Yêu cầu trả hàng',
                        icon: 'pi pi-fw pi-replay',
                        routerLink: ['/pages/nghiep-vu/mua-hang/yeu-cau-tra-hang']
                    },
                    {
                        label: 'Quản lý trả hàng theo yêu cầu',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/mua-hang/quan-ly-tra-hang']
                    },
                    {
                        label: 'Xuất trả hàng',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/mua-hang/xuat-tra-hang']
                    },
                    {
                        label: 'Yêu cầu thanh toán',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['/pages/nghiep-vu/mua-hang/yeu-cau-thanh-toan']
                    },
                    {
                        label: 'Chi trả công nợ',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/mua-hang/chi-tra-cong-no']
                    },
                    {
                        label: 'Bảng tổng kết phải trả',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/mua-hang/tong-ket-phai-tra']
                    },
                    {
                        label: 'Chuyển đổi đơn vị tính',
                        icon: 'pi pi-fw pi-sync',
                        routerLink: ['/pages/nghiep-vu/mua-hang/chuyen-doi-don-vi']
                    },
                    {
                        label: 'Điều chỉnh giá',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/nghiep-vu/mua-hang/dieu-chinh-gia']
                    },
                    {
                        label: 'Hàng hóa không dùng',
                        icon: 'pi pi-fw pi-ban',
                        routerLink: ['/pages/nghiep-vu/mua-hang/hang-hoa-khong-dung']
                    }
                ]
            },

            {
                label: 'Danh mục',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/mua-hang/danh-muc',

                items: [
                    {
                        label: 'Danh mục nhà cung cấp',
                        icon: 'pi pi-fw pi-truck',
                        routerLink: ['/pages/nghiep-vu/mua-hang/danh-muc-nha-cung-cap']
                    },
                    {
                        label: 'Danh mục hàng hóa dịch vụ',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/mua-hang/danh-muc-hang-hoa-dich-vu']
                    }
                ]
            },

            {
                label: 'Báo cáo',
                icon: 'pi pi-fw pi-chart-bar',
                path: '/pages/nghiep-vu/mua-hang/bao-cao',

                items: [
                    {
                        label: 'Báo cáo tồn kho',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/mua-hang/bao-cao-ton-kho']
                    },
                    {
                        label: 'Báo cáo đơn mua hàng',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/nghiep-vu/mua-hang/bao-cao-don-mua-hang']
                    },
                    {
                        label: 'Bảng kê mua hàng',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/mua-hang/bang-ke-mua-hang']
                    },
                    {
                        label: 'Xuất trả hàng nhà cung cấp',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/pages/nghiep-vu/mua-hang/xuat-tra-nha-cung-cap']
                    },
                    {
                        label: 'Báo cáo công nợ phải trả chi tiết',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/pages/nghiep-vu/mua-hang/cong-no-phai-tra-chi-tiet']
                    },
                    {
                        label: 'Báo cáo công nợ phải trả tổng hợp',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/mua-hang/cong-no-phai-tra-tong-hop']
                    },
                    {
                        label: 'Báo cáo công nợ phải trả chi tiết theo chứng từ',
                        icon: 'pi pi-fw pi-file-edit',
                        routerLink: ['/pages/nghiep-vu/mua-hang/cong-no-phai-tra-theo-chung-tu']
                    }
                ]
            }
        ]
    };
