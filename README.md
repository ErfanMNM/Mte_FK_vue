# Mte_FK_vue (Vue 3 + Vite)

Admin panel mini với đăng nhập (mock), router và Kanban kéo-thả. Không dùng CDN; cài đặt bằng npm.

## Yêu cầu
- Node.js 18+ (khuyến nghị 20+)

## Cài đặt & chạy
```bash
cd Mte_FK_vue
npm install
npm run dev
```
Mở địa chỉ hiển thị (thường là http://localhost:5173).

Đăng nhập demo: `admin` / `123456`.

## Build
```bash
npm run build
npm run preview
```

## Tính năng
- Đăng nhập/đăng xuất (mock API).
- Giao diện admin: Header + Sidebar + nội dung.
- Router Hash: `/login`, `/kanban` (bảo vệ route).
- Kanban: thêm/sửa/xóa, kéo-thả, lưu `localStorage`.
- Chi tiết task: mô tả, hạn, nhãn, checklist, bình luận đơn giản (modal).
- Quản lý cột: thêm cột mới, đổi tên, xóa cột.
- Tên bảng có thể chỉnh sửa; nút xóa bảng (reset).
- Mock API mô phỏng `fetch/save`.

## Cấu trúc
- `src/App.vue` – Shell chung; hiển thị Header/Sidebar (trừ login).
- `src/router/index.js` – Định tuyến + guard.
- `src/stores/auth.js`, `src/stores/board.js` – Trạng thái auth/kanban.
- `src/api/mock.js` – API giả lập.
- `src/views/Login.vue`, `src/views/Kanban.vue` – Các trang.
- `src/components/HeaderBar.vue`, `src/components/SidebarNav.vue` – Thành phần giao diện.

## Ghi chú
- Có thể mở rộng thêm trang Users/Reports, tích hợp Pinia, v.v.
