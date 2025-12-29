-- 3. Đăng nhập vào FirstTest và tạo bảng Employee
-- (Hoặc tạo luôn với prefix)
CREATE TABLE FirstTest.Employee (
    id NUMBER PRIMARY KEY,
    ten NVARCHAR2(100),
    email VARCHAR2(100)
);

-- 4. Thêm data
INSERT INTO FirstTest.Employee VALUES (1, N'Nguyễn Văn A', 'nguyenvana@email.com');
INSERT INTO FirstTest.Employee VALUES (2, N'Trần Thị B', 'tranthib@email.com');
INSERT INTO FirstTest.Employee VALUES (3, N'Lê Văn C', 'levanc@email.com');
INSERT INTO FirstTest.Employee VALUES (4, N'Phạm Thị D', 'phamthid@email.com');
COMMIT;

-- 5. Kiểm tra
SELECT * FROM FirstTest.Employee;