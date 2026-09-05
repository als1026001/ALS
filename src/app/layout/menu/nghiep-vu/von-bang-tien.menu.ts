import { AppMenuItem } from '../menu.types';

export const VON_BANG_TIEN_MENU: AppMenuItem =
    // =====================================================
    // VỐN BẰNG TIỀN
    // =====================================================
    {
        label: 'Vốn bằng tiền',
        icon: 'pi pi-fw pi-wallet',
        path: '/pages/nghiep-vu/von-bang-tien',

        items: [
            {
                label: 'Giao dịch',
                icon: 'pi pi-fw pi-money-bill',
                path: '/pages/nghiep-vu/von-bang-tien/giao-dich',

                items: [
                    {
                        label: 'Phiếu thu tiền mặt',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/giao-dich/phieu-thu']
                    },
                    {
                        label: 'Phiếu chi tiền mặt',
                        icon: 'pi pi-fw pi-minus-circle',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/giao-dich/phieu-chi']
                    },
                    {
                        label: 'Báo có',
                        icon: 'pi pi-building-columns',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/giao-dich/bao-co']
                    },
                    {
                        label: 'Báo nợ',
                        icon: 'pi pi-fw pi-arrow-up',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/giao-dich/bao-no']
                    }
                ]
            },

            {
                label: 'Sổ sách',
                icon: 'pi pi-fw pi-book',
                path: '/pages/nghiep-vu/von-bang-tien/so-sach',

                items: [
                    {
                        label: 'Sổ quỹ tiền mặt',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/so-quy-tien-mat']
                    },
                    {
                        label: 'Sổ quỹ tiền mặt',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/so-tien-gui-ngan-hang']
                    },
                    {
                        label: 'Sổ chi tiết tài khoản',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/so-chi-tiet-tai-khoan']
                    },
                    {
                        label: 'Sổ tổng hợp tài khoản',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/so-tong-hop-tai-khoan']
                    },
                    {
                        label: 'Sổ cái tài khoản',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/so-cai-tai-khoan']
                    },
                    {
                        label: 'Nhật ký chung',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/nhat-ky-chung']
                    }
                ]
            },

            {
                label: 'Danh mục',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/von-bang-tien/danh-muc',

                items: [
                    {
                        label: 'Danh mục tài khoản',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-tai-khoan']
                    },
                    {
                        label: 'Danh mục đối tượng',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-doi-tuong']
                    },
                    {
                        label: 'Danh mục hợp đồng, công trình, dự án',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-hop-dong']
                    },
                    {
                        label: 'Danh mục sản phẩm',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-san-pham']
                    },
                    {
                        label: 'Danh mục bộ phận',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-bo-phan']
                    },
                    {
                        label: 'Danh mục khoản mục phí',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-khoan-muc-phi']
                    },
                    {
                        label: 'Danh mục nghiệp vụ kế toán',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/von-bang-tien/danh-muc-nghiep-vu-ke-toan']
                    }
                ]
            }
        ]
    };
