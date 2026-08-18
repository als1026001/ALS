import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            // =====================================================
            // NGHIỆP VỤ
            // =====================================================
            {
                label: 'NGHIỆP VỤ',
                items: [
                    // =====================================================
                    // VỐN BẰNG TIỀN
                    // =====================================================
                    {
                        label: 'Vốn bằng tiền',
                        icon: 'pi pi-fw pi-wallet',
                        path: '/pages/von-bang-tien',

                        items: [
                            {
                                label: 'Giao dịch',
                                icon: 'pi pi-fw pi-money-bill',
                                path: '/pages/von-bang-tien/giao-dich',

                                items: [
                                    {
                                        label: 'Phiếu thu tiền mặt',
                                        icon: 'pi pi-fw pi-plus-circle',
                                        routerLink: ['/pages/von-bang-tien/phieu-thu-tien-mat']
                                    },
                                    {
                                        label: 'Phiếu chi tiền mặt',
                                        icon: 'pi pi-fw pi-minus-circle',
                                        routerLink: ['/pages/von-bang-tien/phieu-chi-tien-mat']
                                    },
                                    {
                                        label: 'Báo có',
                                        icon: 'pi pi-building-columns',
                                        routerLink: ['/pages/von-bang-tien/bao-co']
                                    },
                                    {
                                        label: 'Báo nợ',
                                        icon: 'pi pi-fw pi-arrow-up',
                                        routerLink: ['/pages/von-bang-tien/bao-no']
                                    }
                                ]
                            },

                            {
                                label: 'Sổ sách',
                                icon: 'pi pi-fw pi-book',
                                path: '/pages/von-bang-tien/so-sach',

                                items: [
                                    {
                                        label: 'Sổ quỹ tiền mặt',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/von-bang-tien/so-quy-tien-mat']
                                    },
                                    {
                                        label: 'Sổ tiền gửi ngân hàng',
                                        icon: 'pi pi-fw pi-building',
                                        routerLink: ['/pages/von-bang-tien/so-tien-gui-ngan-hang']
                                    },
                                    {
                                        label: 'Sổ chi tiết tài khoản',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/von-bang-tien/so-chi-tiet-tai-khoan']
                                    },
                                    {
                                        label: 'Sổ tổng hợp tài khoản',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/von-bang-tien/so-tong-hop-tai-khoan']
                                    },
                                    {
                                        label: 'Sổ cái tài khoản',
                                        icon: 'pi pi-fw pi-book',
                                        routerLink: ['/pages/von-bang-tien/so-cai-tai-khoan']
                                    },
                                    {
                                        label: 'Nhật ký chung',
                                        icon: 'pi pi-fw pi-calendar',
                                        routerLink: ['/pages/von-bang-tien/nhat-ky-chung']
                                    }
                                ]
                            },

                            {
                                label: 'Danh mục',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/von-bang-tien/danh-muc',

                                items: [
                                    {
                                        label: 'Danh mục tài khoản',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-tai-khoan']
                                    },
                                    {
                                        label: 'Danh mục đối tượng',
                                        icon: 'pi pi-fw pi-users',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-doi-tuong']
                                    },
                                    {
                                        label: 'Danh mục hợp đồng, công trình, dự án',
                                        icon: 'pi pi-fw pi-briefcase',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-hop-dong']
                                    },
                                    {
                                        label: 'Danh mục sản phẩm',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-san-pham']
                                    },
                                    {
                                        label: 'Danh mục bộ phận',
                                        icon: 'pi pi-fw pi-sitemap',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-bo-phan']
                                    },
                                    {
                                        label: 'Danh mục khoản mục phí',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-khoan-muc-phi']
                                    },
                                    {
                                        label: 'Danh mục nghiệp vụ kế toán',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/von-bang-tien/danh-muc-nghiep-vu-ke-toan']
                                    }
                                ]
                            }
                        ]
                    },

                    // =====================================================
                    // MUA HÀNG
                    // =====================================================
                    {
                        label: 'Mua hàng',
                        icon: 'pi pi-fw pi-shopping-cart',
                        path: '/pages/mua-hang',

                        items: [
                            {
                                label: 'Nghiệp vụ',
                                icon: 'pi pi-fw pi-file-edit',
                                path: '/pages/mua-hang/nghiep-vu',

                                items: [
                                    {
                                        label: 'Phiếu nhập hàng',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/mua-hang/phieu-nhap-hang']
                                    },
                                    {
                                        label: 'Yêu cầu trả hàng',
                                        icon: 'pi pi-fw pi-replay',
                                        routerLink: ['/pages/mua-hang/yeu-cau-tra-hang']
                                    },
                                    {
                                        label: 'Quản lý trả hàng theo yêu cầu',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/mua-hang/quan-ly-tra-hang']
                                    },
                                    {
                                        label: 'Xuất trả hàng',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/mua-hang/xuat-tra-hang']
                                    },
                                    {
                                        label: 'Yêu cầu thanh toán',
                                        icon: 'pi pi-fw pi-credit-card',
                                        routerLink: ['/pages/mua-hang/yeu-cau-thanh-toan']
                                    },
                                    {
                                        label: 'Chi trả công nợ',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/mua-hang/chi-tra-cong-no']
                                    },
                                    {
                                        label: 'Bảng tổng kết phải trả',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/mua-hang/tong-ket-phai-tra']
                                    },
                                    {
                                        label: 'Chuyển đổi đơn vị tính',
                                        icon: 'pi pi-fw pi-sync',
                                        routerLink: ['/pages/mua-hang/chuyen-doi-don-vi']
                                    },
                                    {
                                        label: 'Điều chỉnh giá',
                                        icon: 'pi pi-fw pi-pencil',
                                        routerLink: ['/pages/mua-hang/dieu-chinh-gia']
                                    },
                                    {
                                        label: 'Hàng hóa không dùng',
                                        icon: 'pi pi-fw pi-ban',
                                        routerLink: ['/pages/mua-hang/hang-hoa-khong-dung']
                                    }
                                ]
                            },

                            {
                                label: 'Danh mục',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/mua-hang/danh-muc',

                                items: [
                                    {
                                        label: 'Danh mục nhà cung cấp',
                                        icon: 'pi pi-fw pi-truck',
                                        routerLink: ['/pages/mua-hang/danh-muc-nha-cung-cap']
                                    },
                                    {
                                        label: 'Danh mục hàng hóa dịch vụ',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/mua-hang/danh-muc-hang-hoa-dich-vu']
                                    }
                                ]
                            },

                            {
                                label: 'Báo cáo',
                                icon: 'pi pi-fw pi-chart-bar',
                                path: '/pages/mua-hang/bao-cao',

                                items: [
                                    {
                                        label: 'Báo cáo tồn kho',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/mua-hang/bao-cao-ton-kho']
                                    },
                                    {
                                        label: 'Báo cáo đơn mua hàng',
                                        icon: 'pi pi-fw pi-file',
                                        routerLink: ['/pages/mua-hang/bao-cao-don-mua-hang']
                                    },
                                    {
                                        label: 'Bảng kê mua hàng',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/mua-hang/bang-ke-mua-hang']
                                    },
                                    {
                                        label: 'Xuất trả hàng nhà cung cấp',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/mua-hang/xuat-tra-nha-cung-cap']
                                    },
                                    {
                                        label: 'Báo cáo công nợ phải trả chi tiết',
                                        icon: 'pi pi-fw pi-file',
                                        routerLink: ['/pages/mua-hang/cong-no-phai-tra-chi-tiet']
                                    },
                                    {
                                        label: 'Báo cáo công nợ phải trả tổng hợp',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/mua-hang/cong-no-phai-tra-tong-hop']
                                    },
                                    {
                                        label: 'Báo cáo công nợ phải trả chi tiết theo chứng từ',
                                        icon: 'pi pi-fw pi-file-edit',
                                        routerLink: ['/pages/mua-hang/cong-no-phai-tra-theo-chung-tu']
                                    }
                                ]
                            }
                        ]
                    },

                    // =====================================================
                    // BÁN HÀNG
                    // =====================================================
                    {
                        label: 'Bán hàng',
                        icon: 'pi pi-fw pi-shopping-bag',
                        path: '/pages/ban-hang',

                        items: [
                            {
                                label: 'Nghiệp vụ',
                                icon: 'pi pi-fw pi-file-edit',
                                path: '/pages/ban-hang/nghiep-vu',

                                items: [
                                    {
                                        label: 'Đặt cọc',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/ban-hang/dat-coc']
                                    },
                                    {
                                        label: 'Phiếu bán hàng',
                                        icon: 'pi pi-fw pi-shopping-cart',
                                        routerLink: ['/pages/ban-hang/phieu-ban-hang']
                                    },
                                    {
                                        label: 'Nhập trả hàng bán',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/ban-hang/nhap-tra-hang']
                                    },
                                    {
                                        label: 'Thu tiền công nợ',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/ban-hang/thu-tien-cong-no']
                                    },
                                    {
                                        label: 'Bảng tổng kết phải thu',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/ban-hang/tong-ket-phai-thu']
                                    },
                                    {
                                        label: 'Hóa đơn bán hàng',
                                        icon: 'pi pi-fw pi-file',
                                        routerLink: ['/pages/ban-hang/hoa-don-ban-hang']
                                    },
                                    {
                                        label: 'Hoàn trả tiền đặt cọc',
                                        icon: 'pi pi-fw pi-replay',
                                        routerLink: ['/pages/ban-hang/hoan-tra-dat-coc']
                                    }
                                ]
                            },

                            {
                                label: 'Danh mục',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/ban-hang/danh-muc',

                                items: [
                                    {
                                        label: 'Danh mục khách hàng',
                                        icon: 'pi pi-fw pi-users',
                                        routerLink: ['/pages/ban-hang/danh-muc-khach-hang']
                                    },
                                    {
                                        label: 'Danh mục hàng hóa dịch vụ',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/ban-hang/danh-muc-hang-hoa-dich-vu']
                                    }
                                ]
                            },

                            {
                                label: 'Báo cáo',
                                icon: 'pi pi-fw pi-chart-bar',
                                path: '/pages/ban-hang/bao-cao',

                                items: [
                                    {
                                        label: 'Báo cáo tồn kho',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/ban-hang/bao-cao-ton-kho']
                                    },
                                    {
                                        label: 'Bảng kê bán hàng',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/ban-hang/bang-ke-ban-hang']
                                    },
                                    {
                                        label: 'Hàng bán nhập trả lại',
                                        icon: 'pi pi-fw pi-replay',
                                        routerLink: ['/pages/ban-hang/hang-ban-nhap-tra']
                                    },
                                    {
                                        label: 'Doanh số thường',
                                        icon: 'pi pi-fw pi-chart-line',
                                        routerLink: ['/pages/ban-hang/doanh-so']
                                    },
                                    {
                                        label: 'Báo cáo công nợ phải thu tổng hợp',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/ban-hang/cong-no-phai-thu']
                                    },
                                    {
                                        label: 'Công nợ phải thu chi tiết theo mặt hàng',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/ban-hang/cong-no-theo-mat-hang']
                                    },
                                    {
                                        label: 'Báo cáo tồn đơn hàng giao hàng',
                                        icon: 'pi pi-fw pi-truck',
                                        routerLink: ['/pages/ban-hang/ton-don-giao-hang']
                                    },
                                    {
                                        label: 'Phân tích doanh số khách hàng theo tháng',
                                        icon: 'pi pi-fw pi-chart-line',
                                        routerLink: ['/pages/ban-hang/phan-tich-doanh-so']
                                    },
                                    {
                                        label: 'Báo cáo tổng hợp thu chi tiết',
                                        icon: 'pi pi-fw pi-file',
                                        routerLink: ['/pages/ban-hang/tong-hop-thu-chi']
                                    },
                                    {
                                        label: 'Tuổi nợ khách hàng',
                                        icon: 'pi pi-fw pi-clock',
                                        routerLink: ['/pages/ban-hang/tuoi-no']
                                    },
                                    {
                                        label: 'Báo cáo chi phí giao hàng',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/ban-hang/chi-phi-giao-hang']
                                    },
                                    {
                                        label: 'Báo cáo giao hàng',
                                        icon: 'pi pi-fw pi-truck',
                                        routerLink: ['/pages/ban-hang/bao-cao-giao-hang']
                                    },
                                    {
                                        label: 'Kết quả hoạt động kinh doanh',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/ban-hang/ket-qua-kinh-doanh']
                                    },
                                    {
                                        label: 'Hiệu suất kinh doanh',
                                        icon: 'pi pi-fw pi-chart-line',
                                        routerLink: ['/pages/ban-hang/hieu-suat-kinh-doanh']
                                    }
                                ]
                            }
                        ]
                    },

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
                                path: '/pages/kho-hang/nhap-xuat',

                                items: [
                                    {
                                        label: 'Phiếu nhập kho',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/kho-hang/phieu-nhap']
                                    },
                                    {
                                        label: 'Phiếu xuất kho',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/kho-hang/phieu-xuat']
                                    },
                                    {
                                        label: 'Xuất chuyển kho',
                                        icon: 'pi pi-fw pi-arrow-right',
                                        routerLink: ['/pages/kho-hang/xuat-chuyen-kho']
                                    },
                                    {
                                        label: 'Quản lý chuyển kho',
                                        icon: 'pi pi-fw pi-sync',
                                        routerLink: ['/pages/kho-hang/quan-ly-chuyen-kho']
                                    },
                                    {
                                        label: 'Nhập chuyển kho',
                                        icon: 'pi pi-fw pi-arrow-left',
                                        routerLink: ['/pages/kho-hang/nhap-chuyen-kho']
                                    },
                                    {
                                        label: 'Nhập trả hàng bán',
                                        icon: 'pi pi-fw pi-replay',
                                        routerLink: ['/pages/kho-hang/nhap-tra-hang']
                                    },
                                    {
                                        label: 'Quản lý trả hàng theo yêu cầu',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/kho-hang/quan-ly-tra-hang']
                                    },
                                    {
                                        label: 'Xuất trả hàng',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/kho-hang/xuat-tra-hang']
                                    },
                                    {
                                        label: 'Kiểm kê kho',
                                        icon: 'pi pi-fw pi-check-square',
                                        routerLink: ['/pages/kho-hang/kiem-ke']
                                    },
                                    {
                                        label: 'Nhập điều chỉnh',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/kho-hang/nhap-dieu-chinh']
                                    },
                                    {
                                        label: 'Xuất điều chỉnh',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/kho-hang/xuat-dieu-chinh']
                                    },
                                    {
                                        label: 'Xuất khác',
                                        icon: 'pi pi-fw pi-external-link',
                                        routerLink: ['/pages/kho-hang/xuat-khac']
                                    }
                                ]
                            },

                            {
                                label: 'Giá vốn',
                                icon: 'pi pi-fw pi-money-bill',
                                path: '/pages/kho-hang/gia-von',

                                items: [
                                    {
                                        label: 'Quản lý giá vốn',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/kho-hang/quan-ly-gia-von']
                                    },
                                    {
                                        label: 'Xem lịch sử giá',
                                        icon: 'pi pi-fw pi-history',
                                        routerLink: ['/pages/kho-hang/lich-su-gia']
                                    }
                                ]
                            },

                            {
                                label: 'Danh mục',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/kho-hang/danh-muc',

                                items: [
                                    {
                                        label: 'Danh mục kho hàng',
                                        icon: 'pi pi-fw pi-home',
                                        routerLink: ['/pages/kho-hang/danh-muc-kho']
                                    },
                                    {
                                        label: 'Danh mục hàng hóa dịch vụ',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/kho-hang/danh-muc-hang-hoa']
                                    },
                                    {
                                        label: 'Mã vạch hàng hóa',
                                        icon: 'pi pi-fw pi-tag',
                                        routerLink: ['/pages/kho-hang/ma-vach']
                                    }
                                ]
                            },

                            {
                                label: 'Báo cáo',
                                icon: 'pi pi-fw pi-chart-bar',
                                path: '/pages/kho-hang/bao-cao',

                                items: [
                                    {
                                        label: 'Bảng kê phiếu nhập',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/kho-hang/bang-ke-phieu-nhap']
                                    },
                                    {
                                        label: 'Bảng kê phiếu xuất',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/kho-hang/bang-ke-phieu-xuat']
                                    },
                                    {
                                        label: 'Tồn kho tức thời',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/kho-hang/ton-kho-tuc-thoi']
                                    },
                                    {
                                        label: 'Báo cáo nhập xuất tồn',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/kho-hang/bao-cao-nhap-xuat-ton']
                                    },
                                    {
                                        label: 'Thẻ kho',
                                        icon: 'pi pi-fw pi-credit-card',
                                        routerLink: ['/pages/kho-hang/the-kho']
                                    }
                                ]
                            }
                        ]
                    },

                    // =====================================================
                    // TÀI SẢN
                    // =====================================================
                    {
                        label: 'Tài sản',
                        icon: 'pi pi-fw pi-building',
                        path: '/pages/tai-san',

                        items: [
                            {
                                label: 'Nghiệp vụ',
                                icon: 'pi pi-fw pi-file-edit',
                                path: '/pages/tai-san/nghiep-vu',

                                items: [
                                    {
                                        label: 'Quản lý tài sản',
                                        icon: 'pi pi-fw pi-building',
                                        routerLink: ['/pages/tai-san/quan-ly']
                                    },
                                    {
                                        label: 'Điều chỉnh tài sản',
                                        icon: 'pi pi-fw pi-pencil',
                                        routerLink: ['/pages/tai-san/dieu-chinh']
                                    },
                                    {
                                        label: 'Giảm tài sản',
                                        icon: 'pi pi-fw pi-minus-circle',
                                        routerLink: ['/pages/tai-san/giam']
                                    },
                                    {
                                        label: 'Khấu hao tài sản',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/tai-san/khau-hao']
                                    },
                                    {
                                        label: 'Điều chỉnh khấu hao',
                                        icon: 'pi pi-fw pi-pencil',
                                        routerLink: ['/pages/tai-san/dieu-chinh-khau-hao']
                                    },
                                    {
                                        label: 'Xem bút toán khấu hao',
                                        icon: 'pi pi-fw pi-eye',
                                        routerLink: ['/pages/tai-san/but-toan-khau-hao']
                                    }
                                ]
                            },

                            {
                                label: 'Báo cáo',
                                icon: 'pi pi-fw pi-chart-bar',
                                path: '/pages/tai-san/bao-cao',

                                items: [
                                    {
                                        label: 'Quá trình khấu hao',
                                        icon: 'pi pi-fw pi-history',
                                        routerLink: ['/pages/tai-san/qua-trinh-khau-hao']
                                    },
                                    {
                                        label: 'Báo cáo tổng hợp tài sản',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/tai-san/tong-hop']
                                    },
                                    {
                                        label: 'Sổ tài sản cố định',
                                        icon: 'pi pi-fw pi-book',
                                        routerLink: ['/pages/tai-san/so-tai-san']
                                    },
                                    {
                                        label: 'Thẻ tài sản cố định',
                                        icon: 'pi pi-fw pi-id-card',
                                        routerLink: ['/pages/tai-san/the-tai-san']
                                    }
                                ]
                            }
                        ]
                    },

                    // =====================================================
                    // THUẾ
                    // =====================================================
                    {
                        label: 'Thuế',
                        icon: 'pi pi-fw pi-file',
                        path: '/pages/thue',

                        items: [
                            {
                                label: 'Kê khai / Thuế GTGT',
                                icon: 'pi pi-fw pi-file-edit',
                                path: '/pages/thue/ke-khai',

                                items: [
                                    {
                                        label: 'Duyệt số liệu thuế',
                                        icon: 'pi pi-fw pi-check-square',
                                        routerLink: ['/pages/thue/duyet-so-lieu']
                                    },
                                    {
                                        label: 'So sánh chứng từ thuế',
                                        icon: 'pi pi-fw pi-clone',
                                        routerLink: ['/pages/thue/so-sanh-chung-tu']
                                    },
                                    {
                                        label: 'So sánh kho thuế',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/thue/so-sanh-kho']
                                    }
                                ]
                            },

                            {
                                label: 'Hóa đơn',
                                icon: 'pi pi-fw pi-file',
                                path: '/pages/thue/hoa-don',

                                items: [
                                    {
                                        label: 'Hóa đơn bán hàng',
                                        icon: 'pi pi-fw pi-shopping-cart',
                                        routerLink: ['/pages/thue/hoa-don-ban-hang']
                                    },
                                    {
                                        label: 'Hóa đơn xuất trả',
                                        icon: 'pi pi-fw pi-upload',
                                        routerLink: ['/pages/thue/hoa-don-xuat-tra']
                                    },
                                    {
                                        label: 'Hóa đơn thay thế',
                                        icon: 'pi pi-fw pi-refresh',
                                        routerLink: ['/pages/thue/hoa-don-thay-the']
                                    },
                                    {
                                        label: 'Hóa đơn điều chỉnh',
                                        icon: 'pi pi-fw pi-pencil',
                                        routerLink: ['/pages/thue/hoa-don-dieu-chinh']
                                    },
                                    {
                                        label: 'Hóa đơn tổng',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/thue/hoa-don-tong']
                                    },
                                    {
                                        label: 'Hóa đơn đơn vị lý',
                                        icon: 'pi pi-fw pi-file',
                                        routerLink: ['/pages/thue/hoa-don-don-vi-ly']
                                    },
                                    {
                                        label: 'In HĐ đã phát hành',
                                        icon: 'pi pi-fw pi-print',
                                        routerLink: ['/pages/thue/in-hoa-don']
                                    }
                                ]
                            },

                            {
                                label: 'Bảng kê thuế',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/thue/bang-ke',

                                items: [
                                    {
                                        label: 'Bảng kê thuế đầu vào',
                                        icon: 'pi pi-fw pi-arrow-down',
                                        routerLink: ['/pages/thue/bang-ke-dau-vao']
                                    },
                                    {
                                        label: 'Bảng kê thuế đầu ra',
                                        icon: 'pi pi-fw pi-arrow-up',
                                        routerLink: ['/pages/thue/bang-ke-dau-ra']
                                    }
                                ]
                            },

                            {
                                label: 'Báo cáo thuế',
                                icon: 'pi pi-fw pi-chart-bar',
                                path: '/pages/thue/bao-cao',

                                items: [
                                    {
                                        label: 'Báo cáo hóa đơn chi tiết',
                                        icon: 'pi pi-fw pi-file',
                                        routerLink: ['/pages/thue/bao-cao-hoa-don']
                                    },
                                    {
                                        label: 'Báo cáo tồn kho thuế',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/thue/ton-kho-thue']
                                    },
                                    {
                                        label: 'Báo cáo NXT kho thuế',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/thue/nxt-kho-thue']
                                    },
                                    {
                                        label: 'Báo cáo thẻ kho thuế',
                                        icon: 'pi pi-fw pi-credit-card',
                                        routerLink: ['/pages/thue/the-kho-thue']
                                    }
                                ]
                            },

                            {
                                label: 'Danh mục',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/thue/danh-muc',

                                items: [
                                    {
                                        label: 'Danh mục tài khoản',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/thue/danh-muc-tai-khoan']
                                    },
                                    {
                                        label: 'Danh mục đối tượng',
                                        icon: 'pi pi-fw pi-users',
                                        routerLink: ['/pages/thue/danh-muc-doi-tuong']
                                    },
                                    {
                                        label: 'Danh mục hàng hóa dịch vụ',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/thue/danh-muc-hang-hoa']
                                    }
                                ]
                            }
                        ]
                    },

                    // =====================================================
                    // CHỨNG TỪ KẾ TOÁN
                    // =====================================================
                    {
                        label: 'Chứng từ kế toán',
                        icon: 'pi pi-fw pi-file-edit',
                        path: '/pages/chung-tu-ke-toan',

                        items: [
                            {
                                label: 'Chứng từ kế toán',
                                icon: 'pi pi-fw pi-file',
                                path: '/pages/chung-tu-ke-toan/chung-tu',

                                items: [
                                    {
                                        label: 'Phiếu kế toán',
                                        icon: 'pi pi-fw pi-file-edit',
                                        routerLink: ['/pages/chung-tu-ke-toan/phieu-ke-toan']
                                    },
                                    {
                                        label: 'Chứng từ bù trừ',
                                        icon: 'pi pi-fw pi-clone',
                                        routerLink: ['/pages/chung-tu-ke-toan/chung-tu-bu-tru']
                                    },
                                    {
                                        label: 'Tổng hợp phiếu kế toán',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/chung-tu-ke-toan/tong-hop-phieu']
                                    },
                                    {
                                        label: 'Sổ chứng từ gốc',
                                        icon: 'pi pi-fw pi-book',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-chung-tu-goc']
                                    }
                                ]
                            },

                            {
                                label: 'Điều chỉnh / Định khoản',
                                icon: 'pi pi-fw pi-calculator',
                                path: '/pages/chung-tu-ke-toan/dinh-khoan',

                                items: [
                                    {
                                        label: 'Bút toán điều chỉnh',
                                        icon: 'pi pi-fw pi-pencil',
                                        routerLink: ['/pages/chung-tu-ke-toan/but-toan-dieu-chinh']
                                    },
                                    {
                                        label: 'Bút toán chuyển',
                                        icon: 'pi pi-fw pi-arrow-right',
                                        routerLink: ['/pages/chung-tu-ke-toan/but-toan-chuyen']
                                    },
                                    {
                                        label: 'Bút toán khóa sổ',
                                        icon: 'pi pi-fw pi-lock',
                                        routerLink: ['/pages/chung-tu-ke-toan/but-toan-khoa-so']
                                    },
                                    {
                                        label: 'Chênh lệch tỷ giá',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/chung-tu-ke-toan/chenh-lech-ty-gia']
                                    }
                                ]
                            },

                            {
                                label: 'Tiền lương',
                                icon: 'pi pi-fw pi-users',
                                path: '/pages/chung-tu-ke-toan/tien-luong',

                                items: [
                                    {
                                        label: 'Nhận số liệu lương',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/chung-tu-ke-toan/nhan-so-lieu-luong']
                                    },
                                    {
                                        label: 'Nhận số liệu lương T13',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/chung-tu-ke-toan/nhan-so-lieu-luong-t13']
                                    },
                                    {
                                        label: 'Bút toán lương',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/chung-tu-ke-toan/but-toan-luong']
                                    },
                                    {
                                        label: 'Bút toán khấu hao',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/chung-tu-ke-toan/but-toan-khau-hao']
                                    }
                                ]
                            },

                            {
                                label: 'Phân bổ / Kết chuyển',
                                icon: 'pi pi-fw pi-sync',
                                path: '/pages/chung-tu-ke-toan/phan-bo',

                                items: [
                                    {
                                        label: 'Bút toán phân bổ',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/chung-tu-ke-toan/but-toan-phan-bo']
                                    }
                                ]
                            },

                            {
                                label: 'Sổ / Báo cáo kế toán',
                                icon: 'pi pi-fw pi-chart-bar',
                                path: '/pages/chung-tu-ke-toan/bao-cao',

                                items: [
                                    {
                                        label: 'Sổ quỹ tiền mặt',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-quy']
                                    },
                                    {
                                        label: 'Sổ tiền gửi ngân hàng',
                                        icon: 'pi pi-fw pi-building',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-tien-gui']
                                    },
                                    {
                                        label: 'Sổ chi tiết tài khoản',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-chi-tiet']
                                    },
                                    {
                                        label: 'Sổ tổng hợp tài khoản',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-tong-hop']
                                    },
                                    {
                                        label: 'Sổ tổng hợp tạm ứng',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-tam-ung']
                                    },
                                    {
                                        label: 'Sổ cái tài khoản',
                                        icon: 'pi pi-fw pi-book',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-cai']
                                    },
                                    {
                                        label: 'Nhật ký chung',
                                        icon: 'pi pi-fw pi-calendar',
                                        routerLink: ['/pages/chung-tu-ke-toan/nhat-ky-chung']
                                    },
                                    {
                                        label: 'Bảng kê thuế đầu vào',
                                        icon: 'pi pi-fw pi-arrow-down',
                                        routerLink: ['/pages/chung-tu-ke-toan/thue-dau-vao']
                                    },
                                    {
                                        label: 'Bảng kê thuế đầu ra',
                                        icon: 'pi pi-fw pi-arrow-up',
                                        routerLink: ['/pages/chung-tu-ke-toan/thue-dau-ra']
                                    },
                                    {
                                        label: 'Báo cáo tài chính',
                                        icon: 'pi pi-fw pi-chart-bar',
                                        routerLink: ['/pages/chung-tu-ke-toan/bao-cao-tai-chinh']
                                    },
                                    {
                                        label: 'Cân đối phát sinh',
                                        icon: 'pi pi-fw pi-chart-pie',
                                        routerLink: ['/pages/chung-tu-ke-toan/can-doi-phat-sinh']
                                    },
                                    {
                                        label: 'Báo cáo quản trị',
                                        icon: 'pi pi-fw pi-chart-line',
                                        routerLink: ['/pages/chung-tu-ke-toan/bao-cao-quan-tri']
                                    },
                                    {
                                        label: 'Công nợ phải thu tổng hợp',
                                        icon: 'pi pi-fw pi-arrow-down',
                                        routerLink: ['/pages/chung-tu-ke-toan/cong-no-phai-thu']
                                    },
                                    {
                                        label: 'Công nợ phải trả tổng hợp',
                                        icon: 'pi pi-fw pi-arrow-up',
                                        routerLink: ['/pages/chung-tu-ke-toan/cong-no-phai-tra']
                                    },
                                    {
                                        label: 'Sổ tổng hợp TK theo đối tượng',
                                        icon: 'pi pi-fw pi-users',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-tk-theo-doi-tuong']
                                    },
                                    {
                                        label: 'Sổ chi tiết chi phí',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-chi-tiet-chi-phi']
                                    },
                                    {
                                        label: 'Sổ chi tiết doanh thu',
                                        icon: 'pi pi-fw pi-chart-line',
                                        routerLink: ['/pages/chung-tu-ke-toan/so-chi-tiet-doanh-thu']
                                    }
                                ]
                            }
                        ]
                    },

                    // =====================================================
                    // HỆ THỐNG
                    // =====================================================
                    {
                        label: 'Hệ thống',
                        icon: 'pi pi-fw pi-cog',
                        path: '/pages/he-thong',

                        items: [
                            {
                                label: 'Thiết lập hệ thống',
                                icon: 'pi pi-fw pi-sliders-h',
                                path: '/pages/he-thong/thiet-lap',

                                items: [
                                    {
                                        label: 'Tham số hệ thống',
                                        icon: 'pi pi-fw pi-cog',
                                        routerLink: ['/pages/he-thong/tham-so']
                                    },
                                    {
                                        label: 'Số dư kho',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/he-thong/so-du-kho']
                                    },
                                    {
                                        label: 'Số dư bán thành phẩm',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/he-thong/so-du-ban-thanh-pham']
                                    },
                                    {
                                        label: 'Số dư tài khoản',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/he-thong/so-du-tai-khoan']
                                    },
                                    {
                                        label: 'Số dư cân đối TSCĐ',
                                        icon: 'pi pi-fw pi-building',
                                        routerLink: ['/pages/he-thong/so-du-tscd']
                                    },
                                    {
                                        label: 'Số dư CN phải thu theo chứng từ',
                                        icon: 'pi pi-fw pi-arrow-down',
                                        routerLink: ['/pages/he-thong/so-du-phai-thu']
                                    },
                                    {
                                        label: 'Số dư CN phải trả theo chứng từ',
                                        icon: 'pi pi-fw pi-arrow-up',
                                        routerLink: ['/pages/he-thong/so-du-phai-tra']
                                    }
                                ]
                            },

                            {
                                label: 'Danh mục',
                                icon: 'pi pi-fw pi-list',
                                path: '/pages/he-thong/danh-muc',

                                items: [
                                    {
                                        label: 'Danh mục tài khoản',
                                        icon: 'pi pi-fw pi-wallet',
                                        routerLink: ['/pages/he-thong/danh-muc-tai-khoan']
                                    },
                                    {
                                        label: 'Danh mục đối tượng',
                                        icon: 'pi pi-fw pi-users',
                                        routerLink: ['/pages/he-thong/danh-muc-doi-tuong']
                                    },
                                    {
                                        label: 'Danh mục khách hàng',
                                        icon: 'pi pi-fw pi-user',
                                        routerLink: ['/pages/he-thong/danh-muc-khach-hang']
                                    },
                                    {
                                        label: 'Danh mục nhà cung cấp',
                                        icon: 'pi pi-fw pi-truck',
                                        routerLink: ['/pages/he-thong/danh-muc-nha-cung-cap']
                                    },
                                    {
                                        label: 'Danh mục khách hàng tiềm năng',
                                        icon: 'pi pi-fw pi-star',
                                        routerLink: ['/pages/he-thong/danh-muc-khach-hang-tiem-nang']
                                    },
                                    {
                                        label: 'Danh mục hợp đồng, công trình, dự án',
                                        icon: 'pi pi-fw pi-briefcase',
                                        routerLink: ['/pages/he-thong/danh-muc-hop-dong']
                                    },
                                    {
                                        label: 'Danh mục khoản mục phí',
                                        icon: 'pi pi-fw pi-money-bill',
                                        routerLink: ['/pages/he-thong/danh-muc-khoan-muc-phi']
                                    },
                                    {
                                        label: 'Danh mục nghiệp vụ kế toán',
                                        icon: 'pi pi-fw pi-calculator',
                                        routerLink: ['/pages/he-thong/danh-muc-nghiep-vu-ke-toan']
                                    },
                                    {
                                        label: 'Danh mục sản phẩm',
                                        icon: 'pi pi-fw pi-box',
                                        routerLink: ['/pages/he-thong/danh-muc-san-pham']
                                    },
                                    {
                                        label: 'Danh mục kho hàng',
                                        icon: 'pi pi-fw pi-home',
                                        routerLink: ['/pages/he-thong/danh-muc-kho-hang']
                                    },
                                    {
                                        label: 'Danh mục ngân hàng',
                                        icon: 'pi pi-fw pi-building',
                                        routerLink: ['/pages/he-thong/danh-muc-ngan-hang']
                                    },
                                    {
                                        label: 'Danh mục nhóm hàng',
                                        icon: 'pi pi-fw pi-tags',
                                        routerLink: ['/pages/he-thong/danh-muc-nhom-hang']
                                    },
                                    {
                                        label: 'Danh mục nhóm hàng chi tiết',
                                        icon: 'pi pi-fw pi-tag',
                                        routerLink: ['/pages/he-thong/danh-muc-nhom-hang-chi-tiet']
                                    },
                                    {
                                        label: 'Danh mục hàng hóa dịch vụ',
                                        icon: 'pi pi-fw pi-shopping-cart',
                                        routerLink: ['/pages/he-thong/danh-muc-hang-hoa-dich-vu']
                                    },
                                    {
                                        label: 'Danh mục đơn vị tính',
                                        icon: 'pi pi-fw pi-sliders-v',
                                        routerLink: ['/pages/he-thong/danh-muc-don-vi-tinh']
                                    },
                                    {
                                        label: 'Danh mục nghiệp vụ nhập xuất',
                                        icon: 'pi pi-fw pi-arrows-v',
                                        routerLink: ['/pages/he-thong/danh-muc-nghiep-vu-nhap-xuat']
                                    }
                                ]
                            },

                            {
                                label: 'Định khoản',
                                icon: 'pi pi-fw pi-calculator',
                                path: '/pages/he-thong/dinh-khoan',

                                items: [
                                    {
                                        label: 'Thông số định khoản tự động kế toán theo nghiệp vụ',
                                        icon: 'pi pi-fw pi-cog',
                                        routerLink: ['/pages/he-thong/dinh-khoan-tu-dong']
                                    }
                                ]
                            },

                            {
                                label: 'Chuyển đổi dữ liệu',
                                icon: 'pi pi-fw pi-sync',
                                path: '/pages/he-thong/chuyen-doi-du-lieu',

                                items: [
                                    {
                                        label: 'Chuyển số dư sang năm',
                                        icon: 'pi pi-fw pi-calendar-plus',
                                        routerLink: ['/pages/he-thong/chuyen-so-du-sang-nam']
                                    }
                                ]
                            },

                            {
                                label: 'Sao lưu dữ liệu',
                                icon: 'pi pi-fw pi-database',
                                path: '/pages/he-thong/sao-luu',

                                items: [
                                    {
                                        label: 'Sao lưu dữ liệu',
                                        icon: 'pi pi-fw pi-download',
                                        routerLink: ['/pages/he-thong/sao-luu-du-lieu']
                                    }
                                ]
                            },

                            {
                                label: 'Mã / Barcode',
                                icon: 'pi pi-fw pi-tag',
                                path: '/pages/he-thong/barcode',

                                items: [
                                    {
                                        label: 'Mã vạch',
                                        icon: 'pi pi-fw pi-tag',
                                        routerLink: ['/pages/he-thong/ma-vach']
                                    },
                                    {
                                        label: 'Mã vạch theo lô',
                                        icon: 'pi pi-fw pi-tags',
                                        routerLink: ['/pages/he-thong/ma-vach-theo-lo']
                                    },
                                    {
                                        label: 'Nhãn, mã vạch hàng hóa, sản phẩm',
                                        icon: 'pi pi-fw pi-print',
                                        routerLink: ['/pages/he-thong/nhan-ma-vach']
                                    }
                                ]
                            },

                            {
                                label: 'Thông tin doanh nghiệp',
                                icon: 'pi pi-fw pi-building',
                                routerLink: ['/pages/he-thong/thong-tin-doanh-nghiep']
                            },

                            {
                                label: 'Người dùng',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/pages/he-thong/nguoi-dung']
                            },

                            {
                                label: 'Phân quyền',
                                icon: 'pi pi-fw pi-shield',
                                routerLink: ['/pages/he-thong/phan-quyen']
                            },

                            {
                                label: 'Khóa / Mở sổ',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/pages/he-thong/khoa-mo-so']
                            },

                            {
                                label: 'Thoát',
                                icon: 'pi pi-fw pi-sign-out',
                                routerLink: ['/pages/he-thong/thoat']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                path: '/pages',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        path: '/auth',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                path: '/hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        path: '/hierarchy/submenu_1',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_1/submenu_1_1',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_1/submenu_1_2',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        path: '/hierarchy/submenu_2',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_2/submenu_2_1',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                path: '/hierarchy/submenu_2/submenu_2_2',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
