import { AppMenuItem } from '../menu.types';

export const HE_THONG_MENU: AppMenuItem =
    // =====================================================
    // HỆ THỐNG
    // =====================================================
    {
        label: 'Hệ thống',
        icon: 'pi pi-fw pi-cog',
        path: '/pages/nghiep-vu/he-thong',

        items: [
            {
                label: 'Thiết lập hệ thống',
                icon: 'pi pi-fw pi-sliders-h',
                path: '/pages/nghiep-vu/he-thong/thiet-lap',

                items: [
                    {
                        label: 'Tham số hệ thống',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/nghiep-vu/he-thong/tham-so']
                    },
                    {
                        label: 'Số dư kho',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/he-thong/so-du-kho']
                    },
                    {
                        label: 'Số dư bán thành phẩm',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/he-thong/so-du-ban-thanh-pham']
                    },
                    {
                        label: 'Số dư tài khoản',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/he-thong/so-du-tai-khoan']
                    },
                    {
                        label: 'Số dư cân đối TSCĐ',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/pages/nghiep-vu/he-thong/so-du-tscd']
                    },
                    {
                        label: 'Số dư CN phải thu theo chứng từ',
                        icon: 'pi pi-fw pi-arrow-down',
                        routerLink: ['/pages/nghiep-vu/he-thong/so-du-phai-thu']
                    },
                    {
                        label: 'Số dư CN phải trả theo chứng từ',
                        icon: 'pi pi-fw pi-arrow-up',
                        routerLink: ['/pages/nghiep-vu/he-thong/so-du-phai-tra']
                    }
                ]
            },

            {
                label: 'Danh mục',
                icon: 'pi pi-fw pi-list',
                path: '/pages/nghiep-vu/he-thong/danh-muc',

                items: [
                    {
                        label: 'Danh mục màu sắc',
                        icon: 'pi pi-fw pi-palette',
                        routerLink: ['/color']
                    },
                    {
                        label: 'Danh mục tài khoản',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-tai-khoan']
                    },
                    {
                        label: 'Danh mục đối tượng',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-doi-tuong']
                    },
                    {
                        label: 'Danh mục khách hàng',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-khach-hang']
                    },
                    {
                        label: 'Danh mục nhà cung cấp',
                        icon: 'pi pi-fw pi-truck',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-nha-cung-cap']
                    },
                    {
                        label: 'Danh mục khách hàng tiềm năng',
                        icon: 'pi pi-fw pi-star',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-khach-hang-tiem-nang']
                    },
                    {
                        label: 'Danh mục hợp đồng, công trình, dự án',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-hop-dong']
                    },
                    {
                        label: 'Danh mục khoản mục phí',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-khoan-muc-phi']
                    },
                    {
                        label: 'Danh mục nghiệp vụ kế toán',
                        icon: 'pi pi-fw pi-calculator',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-nghiep-vu-ke-toan']
                    },
                    {
                        label: 'Danh mục sản phẩm',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-san-pham']
                    },
                    {
                        label: 'Danh mục kho hàng',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-kho-hang']
                    },
                    {
                        label: 'Danh mục ngân hàng',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-ngan-hang']
                    },
                    {
                        label: 'Danh mục nhóm hàng',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-nhom-hang']
                    },
                    {
                        label: 'Danh mục nhóm hàng chi tiết',
                        icon: 'pi pi-fw pi-tag',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-nhom-hang-chi-tiet']
                    },
                    {
                        label: 'Danh mục hàng hóa dịch vụ',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-hang-hoa-dich-vu']
                    },
                    {
                        label: 'Danh mục đơn vị tính',
                        icon: 'pi pi-fw pi-sliders-v',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-don-vi-tinh']
                    },
                    {
                        label: 'Danh mục nghiệp vụ nhập xuất',
                        icon: 'pi pi-fw pi-arrows-v',
                        routerLink: ['/pages/nghiep-vu/he-thong/danh-muc-nghiep-vu-nhap-xuat']
                    }
                ]
            },

            {
                label: 'Định khoản',
                icon: 'pi pi-fw pi-calculator',
                path: '/pages/nghiep-vu/he-thong/dinh-khoan',

                items: [
                    {
                        label: 'Thông số định khoản tự động kế toán theo nghiệp vụ',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/nghiep-vu/he-thong/dinh-khoan-tu-dong']
                    }
                ]
            },

            {
                label: 'Chuyển đổi dữ liệu',
                icon: 'pi pi-fw pi-sync',
                path: '/pages/nghiep-vu/he-thong/chuyen-doi-du-lieu',

                items: [
                    {
                        label: 'Chuyển số dư sang năm',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['/pages/nghiep-vu/he-thong/chuyen-so-du-sang-nam']
                    }
                ]
            },

            {
                label: 'Sao lưu dữ liệu',
                icon: 'pi pi-fw pi-database',
                path: '/pages/nghiep-vu/he-thong/sao-luu',

                items: [
                    {
                        label: 'Sao lưu dữ liệu',
                        icon: 'pi pi-fw pi-download',
                        routerLink: ['/pages/nghiep-vu/he-thong/sao-luu-du-lieu']
                    }
                ]
            },

            {
                label: 'Mã / Barcode',
                icon: 'pi pi-fw pi-tag',
                path: '/pages/nghiep-vu/he-thong/barcode',

                items: [
                    {
                        label: 'Mã vạch',
                        icon: 'pi pi-fw pi-tag',
                        routerLink: ['/pages/nghiep-vu/he-thong/ma-vach']
                    },
                    {
                        label: 'Mã vạch theo lô',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: ['/pages/nghiep-vu/he-thong/ma-vach-theo-lo']
                    },
                    {
                        label: 'Nhãn, mã vạch hàng hóa, sản phẩm',
                        icon: 'pi pi-fw pi-print',
                        routerLink: ['/pages/nghiep-vu/he-thong/nhan-ma-vach']
                    }
                ]
            },

            {
                label: 'Thông tin doanh nghiệp',
                icon: 'pi pi-fw pi-building',
                routerLink: ['/pages/nghiep-vu/he-thong/thong-tin-doanh-nghiep']
            },

            {
                label: 'Người dùng',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/pages/nghiep-vu/he-thong/nguoi-dung']
            },

            {
                label: 'Phân quyền',
                icon: 'pi pi-fw pi-shield',
                routerLink: ['/pages/nghiep-vu/he-thong/phan-quyen']
            },

            {
                label: 'Khóa / Mở sổ',
                icon: 'pi pi-fw pi-lock',
                routerLink: ['/pages/nghiep-vu/he-thong/khoa-mo-so']
            },

            {
                label: 'Thoát',
                icon: 'pi pi-fw pi-sign-out',
                routerLink: ['/pages/nghiep-vu/he-thong/thoat']
            }
        ]
    };
