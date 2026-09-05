import { AppMenuItem } from '../menu.types';

export const TAI_SAN_MENU: AppMenuItem =
    // =====================================================
    // TÀI SẢN
    // =====================================================
    {
        label: 'Tài sản',
        icon: 'pi pi-fw pi-building',
        path: '/pages/nghiep-vu/tai-san',

        items: [
            {
                label: 'Nghiệp vụ',
                icon: 'pi pi-fw pi-file-edit',
                path: '/pages/nghiep-vu/tai-san/nghiep-vu',

                items: [
                    {
                        label: 'Quản lý tài sản',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/pages/nghiep-vu/tai-san/quan-ly']
                    },
                    {
                        label: 'Điều chỉnh tài sản',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/nghiep-vu/tai-san/dieu-chinh']
                    },
                    {
                        label: 'Giảm tài sản',
                        icon: 'pi pi-fw pi-minus-circle',
                        routerLink: ['/pages/nghiep-vu/tai-san/giam']
                    },
                    {
                        label: 'Khấu hao tài sản',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/tai-san/khau-hao']
                    },
                    {
                        label: 'Điều chỉnh khấu hao',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/nghiep-vu/tai-san/dieu-chinh-khau-hao']
                    },
                    {
                        label: 'Xem bút toán khấu hao',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/pages/nghiep-vu/tai-san/but-toan-khau-hao']
                    }
                ]
            },

            {
                label: 'Báo cáo',
                icon: 'pi pi-fw pi-chart-bar',
                path: '/pages/nghiep-vu/tai-san/bao-cao',

                items: [
                    {
                        label: 'Quá trình khấu hao',
                        icon: 'pi pi-fw pi-history',
                        routerLink: ['/pages/nghiep-vu/tai-san/qua-trinh-khau-hao']
                    },
                    {
                        label: 'Báo cáo tổng hợp tài sản',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/nghiep-vu/tai-san/tong-hop']
                    },
                    {
                        label: 'Sổ tài sản cố định',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/nghiep-vu/tai-san/so-tai-san']
                    },
                    {
                        label: 'Thẻ tài sản cố định',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/pages/nghiep-vu/tai-san/the-tai-san']
                    }
                ]
            }
        ]
    };
