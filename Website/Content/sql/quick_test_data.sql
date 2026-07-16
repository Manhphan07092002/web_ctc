-- Quick test data for Activities table
USE ctcdb;

-- Insert test activities
INSERT INTO Activities (Title, Description, ActivityType, IsPublished, IsFeatured, CreatedDate, UpdatedDate, ViewCount) VALUES
(N'Đại hội Cổ đông 2025', N'Đại hội Cổ đông thường niên năm 2025 - Thông qua báo cáo tài chính và kế hoạch phát triển.', 'events', 1, 1, GETDATE(), GETDATE(), 150),
(N'Thông báo nghỉ Tết 2025', N'Thông báo lịch nghỉ Tết Nguyên đán Ất Tỵ 2025 từ ngày 26/1 đến 2/2/2025.', 'news', 1, 1, GETDATE(), GETDATE(), 89),
(N'Hội thảo Chuyển đổi số', N'Hội thảo về ứng dụng công nghệ số trong ngành xây dựng - BIM, IoT, AI.', 'events', 1, 0, GETDATE(), GETDATE(), 234),
(N'Đào tạo An toàn lao động', N'Chương trình đào tạo nâng cao ý thức an toàn lao động cho CBCNV.', 'training', 1, 1, GETDATE(), GETDATE(), 67),
(N'Dự án ERP tích hợp', N'Triển khai hệ thống ERP tích hợp quản lý toàn diện hoạt động công ty.', 'projects', 1, 0, GETDATE(), GETDATE(), 112);

-- Check results
SELECT COUNT(*) as TotalActivities FROM Activities WHERE IsPublished = 1;
SELECT ActivityType, COUNT(*) as Count FROM Activities WHERE IsPublished = 1 GROUP BY ActivityType;

PRINT 'Test data inserted successfully!';
