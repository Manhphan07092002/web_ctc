-- =============================================
-- Dữ liệu mẫu cho CTCDB
-- =============================================

USE ctcdb;
GO


-- =============================================
-- Dữ liệu mẫu cho bảng News
-- =============================================
INSERT INTO News (Title, Summary, Content, ImageUrl, Author, IsPublished, IsFeatured, ViewCount, PublishedDate) VALUES
(N'Công ty ký kết hợp đồng xây dựng dự án Trung tâm thương mại Miền Trung', 
 N'Ngày 15/10/2024, Công ty CTC đã chính thức ký kết hợp đồng thi công dự án Trung tâm thương mại Miền Trung với tổng giá trị 500 tỷ đồng.',
 N'<p>Sáng ngày 15/10/2024, tại trụ sở chính của Công ty Cổ phần Xây lắp Bưu điện Miền Trung, đã diễn ra lễ ký kết hợp đồng thi công dự án Trung tâm thương mại Miền Trung với tổng giá trị lên đến 500 tỷ đồng.</p><p>Dự án có quy mô 15 tầng nổi và 3 tầng hầm, tổng diện tích sàn xây dựng khoảng 80.000m2. Công trình sẽ bao gồm khu mua sắm, nhà hàng, rạp chiếu phim và khu vui chơi giải trí.</p><p>Ông Nguyễn Văn A - Tổng Giám đốc công ty cho biết: "Đây là dự án trọng điểm của công ty trong năm 2024, chúng tôi cam kết hoàn thành đúng tiến độ và chất lượng cao nhất".</p>',
 '/images/news/ky-ket-hop-dong-ttm.jpg', N'Ban Truyền thông', 1, 1, 1250, '2024-10-15 09:30:00'),

(N'Áp dụng công nghệ BIM trong thiết kế và thi công', 
 N'Công ty CTC đã đầu tư ứng dụng công nghệ BIM (Building Information Modeling) vào quy trình thiết kế và thi công để nâng cao hiệu quả.',
 N'<p>Nhằm nâng cao chất lượng thiết kế và thi công, Công ty CTC đã đầu tư mạnh mẽ vào việc ứng dụng công nghệ BIM (Building Information Modeling) trong toàn bộ quy trình làm việc.</p><p>Công nghệ BIM giúp tạo ra mô hình 3D chi tiết của công trình, cho phép phát hiện và giải quyết các xung đột thiết kế ngay từ giai đoạn đầu, tiết kiệm thời gian và chi phí thi công.</p><p>Theo thống kê, việc áp dụng BIM đã giúp công ty giảm 15% thời gian thiết kế và 20% chi phí sửa chữa trong quá trình thi công.</p>',
 '/images/news/cong-nghe-bim.jpg', N'Phòng Kỹ thuật', 1, 1, 890, '2024-10-10 14:20:00'),

(N'Khánh thành dự án Khu dân cư Hòa Bình', 
 N'Dự án Khu dân cư Hòa Bình do Công ty CTC thi công đã chính thức khánh thành sau 18 tháng xây dựng.',
 N'<p>Sau 18 tháng thi công, dự án Khu dân cư Hòa Bình đã chính thức khánh thành và bàn giao cho chủ đầu tư. Dự án có quy mô 200 căn nhà phố và biệt thự với đầy đủ hạ tầng tiện ích.</p><p>Khu dân cư được thiết kế theo mô hình "thành phố xanh" với nhiều cây xanh, công viên và hồ điều hòa. Hệ thống giao thông nội bộ được quy hoạch khoa học, đảm bảo an toàn cho cư dân.</p><p>Ông Trần Văn B - Chủ đầu tư dự án đánh giá cao chất lượng thi công của Công ty CTC và cam kết sẽ tiếp tục hợp tác trong các dự án tương lai.</p>',
 '/images/news/khanh-thanh-hoa-binh.jpg', N'Ban Truyền thông', 1, 0, 567, '2024-10-05 16:45:00'),

(N'Đào tạo kỹ năng an toàn lao động cho công nhân', 
 N'Công ty CTC tổ chức khóa đào tạo kỹ năng an toàn lao động cho 200 công nhân tham gia các dự án xây dựng.',
 N'<p>Nhằm đảm bảo an toàn tuyệt đối cho người lao động, Công ty CTC đã tổ chức khóa đào tạo kỹ năng an toàn lao động cho 200 công nhân đang tham gia các dự án xây dựng của công ty.</p><p>Khóa đào tạo kéo dài 3 ngày với nội dung bao gồm: quy định an toàn lao động trong xây dựng, sử dụng thiết bị bảo hộ, xử lý tình huống khẩn cấp và sơ cứu cơ bản.</p><p>Bà Nguyễn Thị C - Trưởng phòng Nhân sự cho biết: "An toàn của người lao động luôn là ưu tiên hàng đầu của công ty. Chúng tôi cam kết đầu tư tối đa cho công tác đào tạo và bảo hộ lao động".</p>',
 '/images/news/dao-tao-an-toan.jpg', N'Phòng Nhân sự', 1, 0, 423, '2024-09-28 10:15:00'),

(N'Nhận giải thưởng "Doanh nghiệp tiêu biểu ngành xây dựng 2024"', 
 N'Công ty CTC vinh dự được Hiệp hội Xây dựng Việt Nam trao tặng giải thưởng "Doanh nghiệp tiêu biểu ngành xây dựng 2024".',
 N'<p>Tại lễ trao giải thưởng thường niên của Hiệp hội Xây dựng Việt Nam, Công ty Cổ phần Xây lắp Bưu điện Miền Trung đã vinh dự nhận giải thưởng "Doanh nghiệp tiêu biểu ngành xây dựng 2024".</p><p>Giải thưởng được trao dựa trên các tiêu chí: chất lượng công trình, tiến độ thi công, ứng dụng công nghệ và trách nhiệm xã hội. Đây là lần thứ 3 liên tiếp công ty nhận được giải thưởng này.</p><p>Ông Lê Văn D - Chủ tịch HĐQT chia sẻ: "Giải thưởng này là sự ghi nhận cho những nỗ lực không ngừng của toàn thể CBNV công ty trong việc nâng cao chất lượng dịch vụ và đóng góp cho sự phát triển của ngành xây dựng".</p>',
 '/images/news/giai-thuong-tieu-bieu.jpg', N'Ban Truyền thông', 1, 1, 1456, '2024-09-20 19:30:00');

-- =============================================
-- Dữ liệu mẫu cho bảng Projects
-- =============================================
INSERT INTO Projects (ProjectName, Description, Location, Client, StartDate, EndDate, Status, Budget, Progress, ImageUrl, IsActive, IsFeatured) VALUES
(N'Trung tâm thương mại Miền Trung', 
 N'Dự án xây dựng trung tâm thương mại 15 tầng với tổng diện tích 80.000m2, bao gồm khu mua sắm, nhà hàng, rạp chiếu phim và khu vui chơi giải trí.',
 N'Đà Nẵng', N'Công ty TNHH Đầu tư Miền Trung', '2024-10-15', '2026-06-30', N'Đang thực hiện', 500000000000, 5,
 '/images/projects/ttm-mien-trung.jpg', 1, 1),

(N'Khu dân cư Hòa Bình', 
 N'Khu dân cư cao cấp với 200 căn nhà phố và biệt thự, đầy đủ tiện ích như trường học, bệnh viện, công viên.',
 N'Quảng Nam', N'Tập đoàn Hòa Bình', '2023-04-01', '2024-10-01', N'Hoàn thành', 300000000000, 100,
 '/images/projects/kdc-hoa-binh.jpg', 1, 1),

(N'Nhà máy sản xuất linh kiện điện tử', 
 N'Xây dựng nhà máy sản xuất linh kiện điện tử với công nghệ hiện đại, diện tích 15.000m2.',
 N'Đà Nẵng', N'Samsung Electronics Vietnam', '2024-06-01', '2025-03-31', N'Đang thực hiện', 180000000000, 45,
 '/images/projects/nha-may-samsung.jpg', 1, 1),

(N'Trường THPT Nguyễn Du', 
 N'Xây dựng trường THPT với quy mô 36 phòng học, phòng thí nghiệm và sân thể thao đạt tiêu chuẩn.',
 N'Quảng Ngãi', N'UBND tỉnh Quảng Ngãi', '2024-01-15', '2024-12-31', N'Đang thực hiện', 85000000000, 75,
 '/images/projects/truong-nguyen-du.jpg', 1, 0),

(N'Bệnh viện Đa khoa Trung ương Huế - Cơ sở 2', 
 N'Xây dựng cơ sở 2 của Bệnh viện Đa khoa Trung ương Huế với 500 giường bệnh và trang thiết bị hiện đại.',
 N'Thừa Thiên Huế', N'Bộ Y tế', '2023-08-01', '2025-07-31', N'Đang thực hiện', 650000000000, 60,
 '/images/projects/benh-vien-hue.jpg', 1, 1),

(N'Khu công nghiệp Thăng Long', 
 N'Đầu tư hạ tầng kỹ thuật cho khu công nghiệp Thăng Long với diện tích 200ha.',
 N'Hà Nam', N'Công ty CP Đầu tư Thăng Long', '2024-03-01', '2025-12-31', N'Đang thực hiện', 420000000000, 30,
 '/images/projects/kcn-thang-long.jpg', 1, 0),

(N'Chung cư cao cấp Sunrise', 
 N'Dự án chung cư cao cấp 25 tầng với 400 căn hộ và đầy đủ tiện ích hiện đại.',
 N'TP. Hồ Chí Minh', N'Novaland Group', '2023-11-01', '2025-05-31', N'Đang thực hiện', 750000000000, 55,
 '/images/projects/cc-sunrise.jpg', 1, 1),

(N'Cầu Nhật Tân 2', 
 N'Xây dựng cầu Nhật Tân 2 bắc qua sông Hồng với chiều dài 3,9km.',
 N'Hà Nội', N'Bộ Giao thông Vận tải', '2024-05-01', '2027-04-30', N'Đang thực hiện', 2800000000000, 15,
 '/images/projects/cau-nhat-tan-2.jpg', 1, 1);

-- =============================================
-- Dữ liệu mẫu cho bảng Activities
-- =============================================
INSERT INTO Activities (Title, Description, ActivityType, ImageUrl, StartDate, EndDate, Location, Participants, IsPublished, IsFeatured, ViewCount) VALUES
(N'Hội thảo "Xu hướng xây dựng bền vững 2024"', 
 N'Hội thảo chuyên đề về các xu hướng xây dựng bền vững, công nghệ xanh và tiết kiệm năng lượng trong ngành xây dựng.',
 'events', '/images/activities/hoi-thao-ben-vung.jpg', '2024-11-15 08:00:00', '2024-11-15 17:00:00', 
 N'Khách sạn Sheraton Đà Nẵng', 150, 1, 1, 234),

(N'Khóa đào tạo kỹ năng số cho nhân viên', 
 N'Chương trình đào tạo 40 giờ về kỹ năng số, bao gồm Digital Marketing, Project Management và Data Analysis.',
 'training', '/images/activities/dao-tao-ky-nang-so.jpg', '2024-10-20 08:00:00', '2024-10-25 17:00:00', 
 N'Trung tâm đào tạo CTC', 120, 1, 1, 189),

(N'Ký kết hợp tác với đối tác Nhật Bản', 
 N'Lễ ký kết thỏa thuận hợp tác chiến lược với tập đoàn Mitsubishi trong lĩnh vực công nghệ xây dựng.',
 'events', '/images/activities/hop-tac-nhat-ban.jpg', '2024-09-28 14:00:00', '2024-09-28 16:00:00', 
 N'Hà Nội', 50, 1, 1, 456),

(N'Chương trình từ thiện "Xây nhà tình thương"', 
 N'Hoạt động xây dựng 10 căn nhà tình thương cho các hộ nghèo tại vùng sâu vùng xa.',
 'news', '/images/activities/nha-tinh-thuong.jpg', '2024-09-01 07:00:00', '2024-09-30 18:00:00', 
 N'Huyện A Lưới, Thừa Thiên Huế', 80, 1, 1, 678),

(N'Triển lãm Công nghệ Xây dựng Việt Nam 2024', 
 N'Tham gia triển lãm quốc tế về công nghệ xây dựng, giới thiệu các sản phẩm và dịch vụ mới.',
 'events', '/images/activities/trien-lam-cong-nghe.jpg', '2024-08-15 09:00:00', '2024-08-18 18:00:00', 
 N'Trung tâm Hội chợ Triển lãm Sài Gòn', 200, 1, 0, 345),

(N'Khóa học An toàn lao động nâng cao', 
 N'Đào tạo chuyên sâu về an toàn lao động cho các trưởng ca và giám sát viên công trình.',
 'training', '/images/activities/an-toan-nang-cao.jpg', '2024-08-01 08:00:00', '2024-08-03 17:00:00', 
 N'Trung tâm đào tạo CTC', 45, 1, 0, 123),

(N'Lễ khánh thành văn phòng chi nhánh Cần Thơ', 
 N'Khánh thành văn phòng chi nhánh mới tại Cần Thơ, mở rộng hoạt động kinh doanh ra khu vực ĐBSCL.',
 'news', '/images/activities/khanh-thanh-can-tho.jpg', '2024-07-20 09:00:00', '2024-07-20 11:00:00', 
 N'Cần Thơ', 100, 1, 1, 567),

(N'Hội nghị Tổng kết năm 2023', 
 N'Hội nghị tổng kết hoạt động kinh doanh năm 2023 và định hướng phát triển năm 2024.',
 'events', '/images/activities/hoi-nghi-tong-ket.jpg', '2024-01-15 08:00:00', '2024-01-15 17:00:00', 
 N'Khách sạn Mường Thanh Đà Nẵng', 300, 1, 0, 234);

-- =============================================
-- Dữ liệu mẫu cho bảng ProjectImages
-- =============================================
INSERT INTO ProjectImages (ProjectID, ImageUrl, Caption, DisplayOrder) VALUES
(1, '/images/projects/ttm-mien-trung-1.jpg', N'Phối cảnh tổng thể dự án', 1),
(1, '/images/projects/ttm-mien-trung-2.jpg', N'Thiết kế nội thất khu mua sắm', 2),
(1, '/images/projects/ttm-mien-trung-3.jpg', N'Khu vực rạp chiếu phim', 3),
(2, '/images/projects/kdc-hoa-binh-1.jpg', N'Cổng chào khu dân cư', 1),
(2, '/images/projects/kdc-hoa-binh-2.jpg', N'Mẫu biệt thự trong khu', 2),
(2, '/images/projects/kdc-hoa-binh-3.jpg', N'Công viên trung tâm', 3),
(3, '/images/projects/nha-may-samsung-1.jpg', N'Toàn cảnh nhà máy', 1),
(3, '/images/projects/nha-may-samsung-2.jpg', N'Dây chuyền sản xuất', 2),
(4, '/images/projects/truong-nguyen-du-1.jpg', N'Khuôn viên trường học', 1),
(4, '/images/projects/truong-nguyen-du-2.jpg', N'Phòng học hiện đại', 2);

-- =============================================
-- Dữ liệu mẫu cho bảng Contacts
-- =============================================
INSERT INTO Contacts (FullName, Email, Phone, Subject, Message, IsRead, CreatedDate) VALUES
(N'Nguyễn Văn An', 'an.nguyen@email.com', '0901234567', N'Tư vấn xây dựng nhà phố', N'Tôi muốn được tư vấn về dịch vụ thiết kế và thi công nhà phố 3 tầng. Xin gửi báo giá chi tiết.', 0, '2024-10-15 14:30:00'),
(N'Trần Thị Bình', 'binh.tran@company.com', '0912345678', N'Hợp tác dự án khu công nghiệp', N'Công ty chúng tôi có dự án khu công nghiệp cần tìm đối tác thi công. Mong được hợp tác.', 1, '2024-10-14 09:15:00'),
(N'Lê Minh Cường', 'cuong.le@gmail.com', '0923456789', N'Thi công biệt thự', N'Gia đình tôi có kế hoạch xây biệt thự tại Đà Nẵng. Xin liên hệ tư vấn.', 0, '2024-10-13 16:45:00'),
(N'Phạm Thu Hà', 'ha.pham@email.com', '0934567890', N'Lắp đặt hệ thống viễn thông', N'Cần báo giá lắp đặt hệ thống cáp quang cho tòa nhà 20 tầng.', 1, '2024-10-12 11:20:00'),
(N'Hoàng Văn Nam', 'nam.hoang@company.vn', '0945678901', N'Tuyển dụng kỹ sư', N'Tôi muốn ứng tuyển vị trí kỹ sư xây dựng tại công ty. Xin gửi CV đính kèm.', 0, '2024-10-11 08:30:00');

-- =============================================
-- Cập nhật dữ liệu Settings
-- =============================================
UPDATE Settings SET SettingValue = N'CÔNG TY CỔ PHẦN XÂY LẮP BƯU ĐIỆN MIỀN TRUNG' WHERE SettingKey = 'CompanyName';
UPDATE Settings SET SettingValue = N'123 Nguyễn Văn Linh, Quận Thanh Khê, TP. Đà Nẵng' WHERE SettingKey = 'CompanyAddress';
UPDATE Settings SET SettingValue = '0915059666' WHERE SettingKey = 'CompanyPhone';
UPDATE Settings SET SettingValue = 'info@ctc-construction.vn' WHERE SettingKey = 'CompanyEmail';
UPDATE Settings SET SettingValue = 'https://ctc-construction.vn' WHERE SettingKey = 'CompanyWebsite';

-- Thêm các setting mới
INSERT INTO Settings (SettingKey, SettingValue, Description) VALUES
('CompanyFax', '0236.123.4567', N'Số fax công ty'),
('CompanyTaxCode', '0123456789', N'Mã số thuế'),
('CompanyEstablished', '2010', N'Năm thành lập'),
('CompanySlogan', N'Xây dựng tương lai - Kết nối thành công', N'Slogan công ty'),
('SocialFacebook', 'https://facebook.com/ctc.construction', N'Facebook fanpage'),
('SocialYoutube', 'https://youtube.com/ctc-construction', N'Youtube channel'),
('SocialLinkedin', 'https://linkedin.com/company/ctc-construction', N'LinkedIn company');

PRINT 'Chèn dữ liệu mẫu thành công!';
GO
