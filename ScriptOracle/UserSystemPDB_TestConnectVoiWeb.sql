SHOW CON_NAME;
SELECT con_id, name, open_mode FROM v$pdbs; -- Lệnh xem dang có các PDB nào đang hoạt động
ALTER PLUGGABLE DATABASE ORCLPDB OPEN; -- PDB đang bị mounted thì dùng lệnh này để mở || Nếu lỗi thì reconnect lại user
ALTER SESSION SET CONTAINER = ORCLPDB;
ALTER SESSION SET CONTAINER = CDB$ROOT;
SELECT USER, SYS_CONTEXT('USERENV', 'ISDBA') AS IS_DBA FROM DUAL; -- Kiểm tra user hiện tại và quyền

-- Chạy bằng Sys để tạo user Test hiển thị bảng Employee lên web trước đã
-- 1. Tạo user FirstTest
CREATE USER FirstTest IDENTIFIED BY firsttest;

-- 2. Cấp quyền cơ bản
GRANT CREATE SESSION TO FirstTest;
GRANT CREATE TABLE TO FirstTest;
GRANT UNLIMITED TABLESPACE TO FirstTest;

