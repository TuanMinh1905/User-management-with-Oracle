# IT Department Management System

Hệ thống quản lý nhân viên phòng ban IT với đầy đủ tính năng CRUD.

## 🛠 Tech Stack

### Frontend
- **Nuxt.js 3** - Vue.js Framework
- **Tailwind CSS** - Styling
- **Pinia** - State Management

### Backend
- **Next.js 14** - API Routes
- **Prisma** - ORM
- **MySQL** - Database

## 📁 Cấu trúc Project

```
CuoiKiOracle/
├── backend/                 # Backend Next.js
│   ├── app/
│   │   └── api/
│   │       ├── users/       # User CRUD API
│   │       └── statistics/  # Statistics API
│   ├── lib/
│   │   └── prisma.ts       # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── package.json
│
├── frontend/                # Frontend Nuxt.js
│   ├── assets/
│   │   └── css/main.css    # Tailwind CSS
│   ├── components/         
│   ├── layouts/
│   │   └── default.vue     # Main layout
│   ├── pages/
│   │   ├── index.vue       # Dashboard
│   │   └── users/          # User management
│   ├── stores/
│   │   └── user.ts         # Pinia store
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── package.json
│
└── README.md
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- Node.js 18+
- MySQL Server (MySQL Workbench)
- npm hoặc yarn

### 1. Tạo Database

Mở MySQL Workbench và tạo database mới:

```sql
CREATE DATABASE it_department_db;
```

### 2. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Cấu hình database trong file .env
# Sửa DATABASE_URL với thông tin MySQL của bạn:
# DATABASE_URL="mysql://root:your_password@localhost:3306/it_department_db"

# Generate Prisma Client
npm run prisma:generate

# Chạy migration để tạo tables
npm run prisma:migrate

# (Tùy chọn) Thêm dữ liệu mẫu
npx ts-node prisma/seed.ts

# Chạy server (port 3001)
npm run dev
```

### 3. Cài đặt Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server (port 3000)
npm run dev
```

### 4. Truy cập ứng dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy danh sách nhân viên |
| POST | `/api/users` | Tạo nhân viên mới |
| GET | `/api/users/:id` | Lấy thông tin nhân viên theo ID |
| PUT | `/api/users/:id` | Cập nhật thông tin nhân viên |
| DELETE | `/api/users/:id` | Xóa nhân viên |
| GET | `/api/statistics` | Lấy thống kê |

### Query Parameters cho GET /api/users

- `search` - Tìm kiếm theo tên, email, mã NV
- `status` - Lọc theo trạng thái (ACTIVE, INACTIVE, ON_LEAVE)
- `role` - Lọc theo vai trò (ADMIN, MANAGER, MEMBER)
- `position` - Lọc theo vị trí

## 📊 Database Schema

### User Table

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key, auto-increment |
| employeeId | VARCHAR | Mã nhân viên (unique) |
| fullName | VARCHAR | Họ và tên |
| email | VARCHAR | Email (unique) |
| phone | VARCHAR | Số điện thoại |
| position | VARCHAR | Vị trí công việc |
| role | ENUM | Vai trò: ADMIN, MANAGER, MEMBER |
| status | ENUM | Trạng thái: ACTIVE, INACTIVE, ON_LEAVE |
| avatar | VARCHAR | URL avatar |
| joinDate | DATETIME | Ngày vào làm |
| createdAt | DATETIME | Ngày tạo |
| updatedAt | DATETIME | Ngày cập nhật |

## ✨ Tính năng

- ✅ Dashboard với thống kê tổng quan
- ✅ Danh sách nhân viên với tìm kiếm và lọc
- ✅ Thêm nhân viên mới
- ✅ Xem chi tiết nhân viên
- ✅ Chỉnh sửa thông tin nhân viên
- ✅ Xóa nhân viên
- ✅ Responsive design
- ✅ Vietnamese language support

## 📝 Ghi chú

- Backend chạy trên port 3001 để tránh xung đột với Frontend (port 3000)
- CORS đã được cấu hình để Frontend có thể gọi API từ Backend
- Đảm bảo MySQL Server đang chạy trước khi khởi động Backend
