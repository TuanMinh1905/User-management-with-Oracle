# IT Department Management System với Oracle Database

Hệ thống quản lý nhân viên phòng ban IT với đầy đủ tính năng CRUD, sử dụng Oracle Database 19c Enterprise Edition với bảo mật thực sự.

## 🛠 Tech Stack

### Frontend
- **Nuxt.js 3** - Vue.js Framework
- **Tailwind CSS** - Styling
- **Pinia** - State Management

### Backend
- **Next.js 14** - API Routes
- **Oracle Database 19c** - Enterprise Edition
- **oracledb** - Oracle Database Driver cho Node.js
- **PL/SQL Packages** - Business Logic Layer

## 🏗 Kiến trúc hệ thống

### Mô hình 3-layer (3-layer model)

1. **Presentation Layer** (Frontend)
   - Nuxt.js 3
   - Hiển thị dữ liệu và nhận thao tác người dùng
   - Gọi Business Layer qua API
   - Không chứa logic bảo mật

2. **Business Layer** (Backend)
   - Gọi PL/SQL Package trong Oracle
   - Truy vấn các view hệ thống của Oracle (dba_users, dba_roles, etc.)
   - Không hardcode quyền
   - Không tự đánh giá allow/deny

3. **Data Layer** (Oracle Database)
   - Oracle Database 19c Enterprise Edition
   - Thực thi toàn bộ bảo mật thật:
     * User
     * Role
     * Profile
     * System Privilege
     * Object / Column Privilege
     * RBAC

## 📁 Cấu trúc Project

```
User-management-with-Oracle/
├── backend/                 # Backend Next.js
│   ├── app/
│   │   └── api/
│   │       ├── users/       # User CRUD API
│   │       └── statistics/  # Statistics API
│   ├── lib/
│   │   ├── oracle.ts        # Oracle connection pools
│   │   └── business-layer.ts # Business Layer (gọi PL/SQL)
│   ├── sql/
│   │   ├── setup-oracle.sql # Script setup database
│   │   └── update-table.sql # Script cập nhật table
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
- Oracle Database 19c Enterprise Edition
- Oracle Instant Client (hoặc Oracle Client đầy đủ)
- npm hoặc pnpm

### 1. Cài đặt Oracle Database

Đảm bảo Oracle Database 19c đã được cài đặt và đang chạy. Kiểm tra listener:
- `orcl.lan`
- `orclpdb.lan`

### 2. Setup Oracle Database

Kết nối với **SYS AS SYSDBA** và chạy script setup:

```bash
# Kết nối Oracle
sqlplus sys/password@localhost:1521/orclpdb.lan AS SYSDBA

# Chạy script setup
@backend/sql/setup-oracle.sql
```

Script này sẽ tạo:
- Tablespaces (TS_APP_DATA, TS_APP_INDEX)
- Users (SEC_ADMIN, APP_OWNER, U_USER01)
- Roles (R_EMPLOYEE, R_MANAGER, R_ADMIN)
- Profiles (P_STANDARD, P_UNLIMITED)
- Table APP_USER_PROFILE
- PL/SQL Package PKG_USER_ADMIN
- Views và privileges

Sau đó chạy script cập nhật table:

```bash
# Kết nối với APP_OWNER
sqlplus APP_OWNER/app123@localhost:1521/orclpdb.lan

# Chạy script cập nhật
@backend/sql/update-table.sql
```

### 3. Cài đặt Oracle Instant Client

**Windows:**
1. Tải Oracle Instant Client từ Oracle website
2. Giải nén vào thư mục (ví dụ: `C:\oracle\instantclient_19_XX`)
3. Thêm vào PATH: `C:\oracle\instantclient_19_XX`

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install libaio1
# Tải và cài đặt Oracle Instant Client
```

**macOS:**
```bash
brew install instantclient-basic
```

### 4. Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install
# hoặc
pnpm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cấu hình .env với thông tin Oracle của bạn:
# ORACLE_ADMIN_USER=SEC_ADMIN
# ORACLE_ADMIN_PASSWORD=admin123
# ORACLE_CONNECTION_STRING=localhost:1521/orclpdb.lan

# Chạy server (port 3001)
npm run dev
```

### 5. Cài đặt Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
# hoặc
pnpm install

# Chạy development server (port 3000)
npm run dev
```

### 6. Truy cập ứng dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy danh sách nhân viên |
| POST | `/api/users` | Tạo nhân viên mới |
| GET | `/api/users/:id` | Lấy thông tin nhân viên theo ID (username) |
| PUT | `/api/users/:id` | Cập nhật thông tin nhân viên |
| DELETE | `/api/users/:id` | Xóa nhân viên |
| GET | `/api/statistics` | Lấy thống kê |

### Query Parameters cho GET /api/users

- `search` - Tìm kiếm theo tên, email, mã NV
- `status` - Lọc theo trạng thái (ACTIVE, INACTIVE, ON_LEAVE)
- `role` - Lọc theo vai trò (ADMIN, MANAGER, MEMBER)
- `position` - Lọc theo vị trí

## 📊 Database Schema

### APP_USER_PROFILE Table (APP_OWNER schema)

| Field | Type | Description |
|-------|------|-------------|
| USERNAME | VARCHAR2(30) | Primary key, mã nhân viên |
| FULL_NAME | VARCHAR2(100) | Họ và tên |
| EMAIL | VARCHAR2(100) | Email |
| PHONE | VARCHAR2(20) | Số điện thoại |
| ADDRESS | VARCHAR2(200) | Địa chỉ |
| POSITION | VARCHAR2(50) | Vị trí công việc |
| ROLE | VARCHAR2(20) | Vai trò: ADMIN, MANAGER, MEMBER |
| STATUS | VARCHAR2(20) | Trạng thái: ACTIVE, INACTIVE, ON_LEAVE |
| AVATAR | VARCHAR2(500) | URL avatar |
| JOIN_DATE | DATE | Ngày vào làm |
| CREATED_AT | DATE | Ngày tạo |
| UPDATED_AT | DATE | Ngày cập nhật |

## 🔐 Bảo mật

### Oracle Connections

| Connection | Mục đích | App có dùng |
|------------|----------|-------------|
| SYS / SYSDBA | Cài đặt ban đầu, tạo tablespace | Không |
| SEC_ADMIN | Quản trị user, role, profile, privilege | Có (Admin UI) |
| APP_OWNER | Schema nghiệp vụ, bảng, PL/SQL | Không |
| USER_xxx | User đăng nhập ứng dụng để demo | Có |

### Roles (RBAC)

- **R_EMPLOYEE**: Quyền cơ bản, có thể SELECT và INSERT vào APP_USER_PROFILE
- **R_MANAGER**: Có quyền của R_EMPLOYEE + SELECT trên VW_USER_CONTACT, UPDATE/DELETE
- **R_ADMIN**: Có quyền của R_MANAGER + CREATE USER

### Profiles

- **P_STANDARD**: Giới hạn 2 sessions, 60 phút connect time, 30 phút idle time
- **P_UNLIMITED**: Không giới hạn

## ✨ Tính năng

- ✅ Dashboard với thống kê tổng quan
- ✅ Danh sách nhân viên với tìm kiếm và lọc
- ✅ Thêm nhân viên mới
- ✅ Xem chi tiết nhân viên
- ✅ Chỉnh sửa thông tin nhân viên
- ✅ Xóa nhân viên
- ✅ Responsive design
- ✅ Vietnamese language support
- ✅ Oracle Database với bảo mật thực sự (User, Role, Profile, Privilege)
- ✅ PL/SQL Packages cho Business Logic
- ✅ RBAC thông qua Oracle Roles

## 📝 Ghi chú

- Backend chạy trên port 3001 để tránh xung đột với Frontend (port 3000)
- CORS đã được cấu hình để Frontend có thể gọi API từ Backend
- Đảm bảo Oracle Database đang chạy và listener hoạt động trước khi khởi động Backend
- Bảo mật được thực hiện trong Oracle, không phải trong code Web
- Ứng dụng không bao giờ dùng SYS connection
- Admin và user thường dùng hai connection khác nhau

## 🔧 Troubleshooting

### Lỗi kết nối Oracle

1. Kiểm tra Oracle listener đang chạy:
   ```bash
   lsnrctl status
   ```

2. Kiểm tra connection string:
   ```
   localhost:1521/orclpdb.lan
   ```

3. Kiểm tra Oracle Instant Client đã được cài đặt và trong PATH

### Lỗi ORA-12541: TNS:no listener

- Đảm bảo Oracle listener đang chạy
- Kiểm tra file `tnsnames.ora` hoặc sử dụng connection string đầy đủ

### Lỗi ORA-01017: invalid username/password

- Kiểm tra credentials trong file `.env`
- Đảm bảo user đã được tạo trong Oracle
