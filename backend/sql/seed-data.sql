-- ============================================
-- SEED DATA CHO APP_USER_PROFILE
-- Chỉ có 5 cột: USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS
-- ============================================
-- Connection: SEC_ADMIN hoặc APP_OWNER

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM APP_OWNER.APP_USER_PROFILE;

-- Insert dữ liệu mẫu (chỉ 5 cột)
INSERT INTO APP_OWNER.APP_USER_PROFILE (USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
VALUES ('NV001', 'Nguyễn Văn An', 'nguyenvanan@example.com', '0901234567', '123 Đường ABC, Quận 1, TP.HCM');

INSERT INTO APP_OWNER.APP_USER_PROFILE (USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
VALUES ('NV002', 'Trần Thị Bình', 'tranthibinh@example.com', '0902345678', '456 Đường XYZ, Quận 2, TP.HCM');

INSERT INTO APP_OWNER.APP_USER_PROFILE (USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
VALUES ('NV003', 'Lê Văn Cường', 'levancuong@example.com', '0903456789', '789 Đường DEF, Quận 3, TP.HCM');

INSERT INTO APP_OWNER.APP_USER_PROFILE (USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
VALUES ('NV004', 'Phạm Thị Dung', 'phamthidung@example.com', '0904567890', '321 Đường GHI, Quận 4, TP.HCM');

INSERT INTO APP_OWNER.APP_USER_PROFILE (USERNAME, FULL_NAME, EMAIL, PHONE, ADDRESS)
VALUES ('NV005', 'Hoàng Văn Em', 'hoangvanem@example.com', '0905678901', '654 Đường JKL, Quận 5, TP.HCM');

COMMIT;

-- Kiểm tra dữ liệu
SELECT COUNT(*) as TOTAL_USERS FROM APP_OWNER.APP_USER_PROFILE;
SELECT * FROM APP_OWNER.APP_USER_PROFILE ORDER BY USERNAME;
