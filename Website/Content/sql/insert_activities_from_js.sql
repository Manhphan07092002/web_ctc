-- =============================================
-- Chèn dữ liệu mẫu Activities từ JavaScript
-- Dành cho Công ty Cổ phần Xây lắp Bưu điện Miền Trung
-- =============================================

USE ctcdb;
GO

-- Xóa dữ liệu cũ nếu có
DELETE FROM Activities;
GO

-- Reset IDENTITY
DBCC CHECKIDENT ('Activities', RESEED, 0);
GO

-- =============================================
-- Chèn dữ liệu Activities
-- =============================================

-- Đại hội cổ đông các năm
INSERT INTO Activities (Title, Description, ActivityType, ImageUrl, StartDate, EndDate, Location, Participants, IsPublished, IsFeatured, ViewCount, CreatedDate, UpdatedDate) VALUES
(N'Đại hội Cổ đông thường niên 2025', 
 N'Đại hội Cổ đông thường niên năm 2025 - Công ty CP Xây lắp Bưu điện Miền Trung. Thông qua báo cáo tài chính, kế hoạch phát triển và chuyển đổi số.', 
 'events', 
 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop', 
 '2025-03-15 08:00:00', 
 '2025-03-15 17:00:00', 
 N'Trung tâm Hội nghị Đà Nẵng', 
 200, 
 1, 1, 0, GETDATE(), GETDATE()),

(N'Đại hội Cổ đông thường niên 2024', 
 N'Đại hội Cổ đông thường niên năm 2024 - Thông qua nghị quyết về tái cơ cấu tổ chức và đầu tư công nghệ.', 
 'events', 
 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop', 
 '2024-03-20 08:00:00', 
 '2024-03-20 17:00:00', 
 N'Khách sạn Mường Thanh Đà Nẵng', 
 180, 
 1, 1, 156, GETDATE(), GETDATE()),

(N'Đại hội Cổ đông thường niên 2023', 
 N'Đại hội Cổ đông thường niên năm 2023 - Phê duyệt kế hoạch mở rộng thị trường và nâng cao năng lực cạnh tranh.', 
 'events', 
 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop', 
 '2023-03-25 08:00:00', 
 '2023-03-25 17:00:00', 
 N'Trung tâm Hội nghị Quốc gia', 
 160, 
 1, 0, 203, GETDATE(), GETDATE()),

(N'Đại hội Cổ đông thường niên 2022', 
 N'Đại hội Cổ đông thường niên năm 2022 - Thông qua chiến lược phát triển bền vững và chuyển đổi số.', 
 'events', 
 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=200&fit=crop', 
 '2022-03-18 08:00:00', 
 '2022-03-18 17:00:00', 
 N'Khách sạn Pullman Đà Nẵng', 
 150, 
 1, 0, 89, GETDATE(), GETDATE()),

(N'Đại hội Cổ đông thường niên 2021', 
 N'Đại hội Cổ đông thường niên năm 2021 - Vượt qua khó khăn COVID-19, định hướng phục hồi và phát triển.', 
 'events', 
 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=200&fit=crop', 
 '2021-04-10 08:00:00', 
 '2021-04-10 17:00:00', 
 N'Trực tuyến và Hội trường công ty', 
 120, 
 1, 0, 134, GETDATE(), GETDATE()),

(N'Đại hội Cổ đông thường niên 2020', 
 N'Đại hội Cổ đông thường niên năm 2020 - Thích ứng với tình hình mới, đổi mới mô hình kinh doanh.', 
 'events', 
 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop', 
 '2020-05-15 08:00:00', 
 '2020-05-15 17:00:00', 
 N'Hội trường Công ty', 
 100, 
 1, 0, 67, GETDATE(), GETDATE()),

-- Thông báo nghỉ lễ năm 2025
(N'Thông báo nghỉ Tết Nguyên đán 2025', 
 N'Thông báo lịch nghỉ Tết Nguyên đán Ất Tỵ 2025 từ ngày 26/1 đến 2/2/2025 (tức 27 tháng Chạp đến mùng 5 tháng Giêng).', 
 'news', 
 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=200&fit=crop', 
 '2025-01-26 00:00:00', 
 '2025-02-02 23:59:59', 
 N'Toàn công ty', 
 NULL, 
 1, 1, 112, GETDATE(), GETDATE()),

(N'Thông báo nghỉ Giỗ tổ Hùng Vương 2025', 
 N'Thông báo nghỉ lễ Giỗ tổ Hùng Vương ngày 10/3/2025 (tức 10/3 âm lịch).', 
 'news', 
 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop', 
 '2025-04-07 00:00:00', 
 '2025-04-07 23:59:59', 
 N'Toàn công ty', 
 NULL, 
 1, 0, 78, GETDATE(), GETDATE()),

(N'Thông báo nghỉ 30/4 và 1/5/2025', 
 N'Thông báo nghỉ lễ Giải phóng miền Nam (30/4) và Quốc tế Lao động (1/5) năm 2025.', 
 'news', 
 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop', 
 '2025-04-30 00:00:00', 
 '2025-05-01 23:59:59', 
 N'Toàn công ty', 
 NULL, 
 1, 0, 145, GETDATE(), GETDATE()),

(N'Thông báo nghỉ Quốc khánh 2/9/2025', 
 N'Thông báo nghỉ lễ Quốc khánh 2/9/2025 - Kỷ niệm 80 năm Cách mạng tháng Tám và Quốc khánh nước CHXHCN Việt Nam.', 
 'news', 
 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop', 
 '2025-09-02 00:00:00', 
 '2025-09-02 23:59:59', 
 N'Toàn công ty', 
 NULL, 
 1, 0, 189, GETDATE(), GETDATE()),

-- Sự kiện chuyển đổi số 2025
(N'Hội thảo Chuyển đổi số trong Xây dựng 2025', 
 N'Hội thảo về ứng dụng công nghệ số trong ngành xây dựng - BIM, IoT, AI và quản lý dự án thông minh.', 
 'events', 
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop', 
 '2025-02-20 08:30:00', 
 '2025-02-20 17:30:00', 
 N'Trung tâm Hội nghị Đà Nẵng', 
 250, 
 1, 1, 95, GETDATE(), GETDATE()),

(N'Triển khai hệ thống ERP tích hợp', 
 N'Dự án triển khai hệ thống ERP tích hợp quản lý toàn diện hoạt động công ty - giai đoạn 1.', 
 'projects', 
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop', 
 '2025-01-15 09:00:00', 
 '2025-06-15 18:00:00', 
 N'Phòng IT và các phòng ban', 
 50, 
 1, 1, 234, GETDATE(), GETDATE()),

(N'Đào tạo Kỹ năng số cho CBCNV', 
 N'Chương trình đào tạo kỹ năng số cho cán bộ công nhân viên - Sử dụng công cụ số trong công việc.', 
 'training', 
 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop', 
 '2025-03-10 14:00:00', 
 '2025-03-12 17:00:00', 
 N'Trung tâm Đào tạo', 
 80, 
 1, 0, 156, GETDATE(), GETDATE()),

-- Đổi bộ máy nhà nước 2025
(N'Hội nghị triển khai Nghị định về cải cách hành chính', 
 N'Hội nghị triển khai các nghị định mới về cải cách hành chính và đơn giản hóa thủ tục.', 
 'events', 
 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop', 
 '2025-02-05 08:00:00', 
 '2025-02-05 17:00:00', 
 N'Hội trường Công ty', 
 120, 
 1, 0, 89, GETDATE(), GETDATE()),

(N'Đào tạo quy trình mới theo Luật Đầu tư công', 
 N'Đào tạo về quy trình mới theo Luật Đầu tư công 2019 và các văn bản hướng dẫn thi hành.', 
 'training', 
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop', 
 '2025-01-25 09:00:00', 
 '2025-01-27 17:00:00', 
 N'Phòng đào tạo A', 
 60, 
 1, 0, 134, GETDATE(), GETDATE()),

(N'Cập nhật quy định mới về đấu thầu 2025', 
 N'Hội nghị cập nhật các quy định mới về đấu thầu và lựa chọn nhà thầu theo Luật Đấu thầu sửa đổi.', 
 'events', 
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop', 
 '2025-03-05 08:30:00', 
 '2025-03-05 17:30:00', 
 N'Trung tâm Hội nghị', 
 150, 
 1, 0, 67, GETDATE(), GETDATE()),

-- Các hoạt động khác
(N'Khánh thành dự án Trung tâm Bưu chính Huế', 
 N'Lễ khánh thành và bàn giao dự án Trung tâm Bưu chính tỉnh Thừa Thiên Huế.', 
 'events', 
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop', 
 '2024-11-20 09:00:00', 
 '2024-11-20 11:00:00', 
 N'Thừa Thiên Huế', 
 100, 
 1, 1, 112, GETDATE(), GETDATE()),

(N'Chương trình An toàn lao động 2025', 
 N'Triển khai chương trình nâng cao ý thức an toàn lao động và phòng chống tai nạn lao động.', 
 'training', 
 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop', 
 '2025-01-20 14:00:00', 
 '2025-01-22 17:00:00', 
 N'Các công trình', 
 200, 
 1, 1, 78, GETDATE(), GETDATE()),

(N'Tổng kết hoạt động Đoàn Thanh niên 2024', 
 N'Đại hội tổng kết hoạt động Đoàn Thanh niên năm 2024 và kế hoạch hoạt động 2025.', 
 'events', 
 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=200&fit=crop', 
 '2024-12-10 19:00:00', 
 '2024-12-10 21:00:00', 
 N'Hội trường Công ty', 
 80, 
 1, 0, 145, GETDATE(), GETDATE()),

(N'Họp Ban Giám đốc tháng 12/2024', 
 N'Họp Ban Giám đốc đánh giá kết quả năm 2024 và định hướng kế hoạch 2025.', 
 'events', 
 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop', 
 '2024-12-15 08:30:00', 
 '2024-12-15 11:30:00', 
 N'Phòng họp BGĐ', 
 15, 
 1, 0, 189, GETDATE(), GETDATE());

-- =============================================
-- Cập nhật ViewCount ngẫu nhiên để tạo sự đa dạng
-- =============================================
UPDATE Activities SET ViewCount = ABS(CHECKSUM(NEWID())) % 500 + 50 WHERE ViewCount = 0;

-- =============================================
-- Kiểm tra kết quả
-- =============================================
SELECT 
    ActivityType,
    COUNT(*) as Count,
    SUM(CASE WHEN IsFeatured = 1 THEN 1 ELSE 0 END) as FeaturedCount,
    SUM(CASE WHEN IsPublished = 1 THEN 1 ELSE 0 END) as PublishedCount
FROM Activities 
GROUP BY ActivityType
ORDER BY ActivityType;

SELECT COUNT(*) as TotalActivities FROM Activities WHERE IsPublished = 1;

PRINT 'Đã chèn thành công ' + CAST(@@ROWCOUNT AS VARCHAR(10)) + ' hoạt động!';
GO
