# ALS.ERP - PROJECT PLAN

## Công nghệ
- Frontend: Angular
- UI: PrimeNG / Sakai
- Backend: Node.js + Express
- Database: PostgreSQL
- Database table menu: public.smenu

## Trạng thái hiện tại

- [x] Angular project đã chạy
- [x] Đã tổ chức thư mục nghiệp vụ
- [x] Đã tạo module Vốn bằng tiền
- [x] Đã tạo giao dịch/Báo có
- [x] Backend đã tạo tại:
      D:\WORKINGWEB\ALS.ERP\backend
- [x] Đã cài:
      express
      pg
      cors
      dotenv
- [x] PostgreSQL kết nối thành công bằng test-db.js
- [ ] Chưa triển khai 9 bước chính

## Cấu trúc Angular hiện tại

src/app/

├── layout/
│   ├── component/
│   └── service/
│
└── pages/
    ├── auth/
    ├── dashboard/
    ├── documentation/
    ├── empty/
    ├── landing/
    ├── notfound/
    ├── uikit/
    │
    └── nghiep-vu/
        ├── von-bang-tien/
        │   ├── giao-dich/
        │   │   ├── bao-co/
        │   │   ├── bao-no/
        │   │   ├── phieu-chi/
        │   │   └── phieu-thu/
        │   │
        │   ├── so-sach/
        │   └── danh-muc/
        │
        ├── mua-hang/
        ├── ban-hang/
        ├── kho-hang/
        ├── tai-san/
        ├── thue/
        ├── chung-tu-ke-toan/
        └── he-thong/

## Database

PostgreSQL database đã kết nối thành công.

Bảng menu:

public.smenu

Các cột quan trọng:

menu_id
tenant_id
company_id
public_id
menu_no
menu_name
parent_menu_id
seq_no
menu_type_id
icon
router_link
menu_url
is_inactive
is_visible
is_security
is_external
target
permission_code

## Backend

D:\WORKINGWEB\ALS.ERP\backend

Các file hiện có:

package.json
test-db.js

Backend dùng:

Express
pg
cors
dotenv

## Mục tiêu

Chuyển menu Angular từ menu viết cứng trong app.menu.ts

sang:

PostgreSQL
    ↓
Node.js API
    ↓
Angular service
    ↓
app.menu.ts
    ↓
app.menuitem.ts
    ↓
Sidebar

Sau đó các item menu sẽ mở đúng Angular route.

## ROADMAP 9 BƯỚC

Bước 1:
Chuẩn hóa cấu trúc thư mục Angular theo nghiệp vụ.

Bước 2:
Chuẩn hóa routing cho từng nghiệp vụ/menu.

Bước 3:
Xây dựng backend Node.js + Express.

Bước 4:
Kết nối backend với PostgreSQL.

Bước 5:
Xây API đọc dữ liệu từ bảng smenu.

Bước 6:
Tạo Angular service gọi API menu.

Bước 7:
Chuyển app.menu.ts từ menu hard-code sang menu lấy từ database.

Bước 8:
Xử lý parent_menu_id, menu con, icon, router_link,
is_visible, is_inactive, permission.

Bước 9:
Hoàn thiện trang nghiệp vụ thực tế,
bắt đầu với:
Vốn bằng tiền → Giao dịch → Báo có.

## BƯỚC HIỆN TẠI

Đang ở trước Bước 1 của roadmap 9 bước.

Backend PostgreSQL đã test thành công.

Việc tiếp theo:
Bắt đầu Bước 1 và không nhảy bước.