-- Create database and Activities table - Simple version
USE master;

-- Create database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ctcdb')
BEGIN
    CREATE DATABASE ctcdb;
    PRINT 'Database ctcdb created successfully';
END
ELSE
    PRINT 'Database ctcdb already exists';

-- Switch to ctcdb
USE ctcdb;

-- Create Activities table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Activities')
BEGIN
    CREATE TABLE Activities (
        ActivityID int IDENTITY(1,1) PRIMARY KEY,
        Title nvarchar(300) NOT NULL,
        Description nvarchar(max),
        ActivityType nvarchar(50) NOT NULL,
        ImageUrl nvarchar(255),
        StartDate datetime2,
        EndDate datetime2,
        Location nvarchar(200),
        Participants int,
        IsPublished bit NOT NULL DEFAULT 1,
        IsFeatured bit NOT NULL DEFAULT 0,
        ViewCount int NOT NULL DEFAULT 0,
        CreatedDate datetime2 NOT NULL DEFAULT GETDATE(),
        UpdatedDate datetime2 NOT NULL DEFAULT GETDATE()
    );
    PRINT 'Activities table created successfully';
END
ELSE
    PRINT 'Activities table already exists';

-- Insert test data
DELETE FROM Activities; -- Clear existing data

INSERT INTO Activities (Title, Description, ActivityType, IsPublished, IsFeatured, ViewCount) VALUES
(N'Đại hội Cổ đông 2025', N'Đại hội Cổ đông thường niên năm 2025 - Thông qua báo cáo tài chính và kế hoạch phát triển.', 'events', 1, 1, 150),
(N'Thông báo nghỉ Tết 2025', N'Thông báo lịch nghỉ Tết Nguyên đán Ất Tỵ 2025 từ ngày 26/1 đến 2/2/2025.', 'news', 1, 1, 89),
(N'Hội thảo Chuyển đổi số', N'Hội thảo về ứng dụng công nghệ số trong ngành xây dựng - BIM, IoT, AI.', 'events', 1, 0, 234),
(N'Đào tạo An toàn lao động', N'Chương trình đào tạo nâng cao ý thức an toàn lao động cho CBCNV.', 'training', 1, 1, 67),
(N'Dự án ERP tích hợp', N'Triển khai hệ thống ERP tích hợp quản lý toàn diện hoạt động công ty.', 'projects', 1, 0, 112);

-- Verify data
SELECT COUNT(*) as TotalActivities FROM Activities WHERE IsPublished = 1;
SELECT ActivityType, COUNT(*) as Count FROM Activities WHERE IsPublished = 1 GROUP BY ActivityType;

PRINT 'Setup completed successfully!';
