# Hướng dẫn cập nhật trang Hoạt động

## Tổng quan thay đổi

Trang hoạt động đã được cập nhật để kết nối trực tiếp với cơ sở dữ liệu SQL thay vì sử dụng dữ liệu tĩnh.

## Các file đã được cập nhật

### 1. Models
- **`Activity.cs`** - Model mới phù hợp với bảng Activities trong SQL
- **`ApplicationDbContext.cs`** - DbContext để kết nối với database

### 2. Controllers
- **`ActivitiesApiController.cs`** - API controller đã được cập nhật để sử dụng cấu trúc database mới

### 3. JavaScript
- **`modern-activities.js`** - File JavaScript mới để xử lý giao diện
- **`activities-page.js`** - File JavaScript hiện có đã được cập nhật

### 4. Views
- **`hoat_dong.cshtml`** - Trang hoạt động với các filter buttons

## Cấu trúc Database mới

### Bảng Activities
```sql
- ActivityID (int, Primary Key)
- Title (nvarchar(300))
- Description (ntext)
- ActivityType (nvarchar(50)) - 'news', 'events', 'training', 'projects'
- ImageUrl (nvarchar(255))
- StartDate (datetime)
- EndDate (datetime)
- Location (nvarchar(200))
- Participants (int)
- IsPublished (bit)
- IsFeatured (bit)
- ViewCount (int)
- CreatedDate (datetime)
- UpdatedDate (datetime)
```

## API Endpoints

### 1. Lấy danh sách hoạt động
```
GET /api/ActivitiesApi/GetActivities
```

### 2. Lọc hoạt động theo loại
```
GET /api/ActivitiesApi/Filter?type=news
GET /api/ActivitiesApi/Filter?type=events
GET /api/ActivitiesApi/Filter?type=training
GET /api/ActivitiesApi/Filter?type=projects
```

### 3. Tìm kiếm hoạt động
```
GET /api/ActivitiesApi/Search?query=từ_khóa
```

### 4. Lấy chi tiết hoạt động
```
GET /api/ActivitiesApi/GetActivityDetail/1
```

### 5. Lấy hoạt động liên quan
```
GET /api/ActivitiesApi/GetRelatedActivities/1?count=4
```

## Cách test

### 1. Chuẩn bị Database
```sql
-- Chạy script tạo database
EXEC sp_executesql N'[nội dung file create_ctcdb_database.sql]'

-- Chèn dữ liệu mẫu
EXEC sp_executesql N'[nội dung file insert_sample_data.sql]'
```

### 2. Kiểm tra Connection String
Đảm bảo trong `web.config` có connection string:
```xml
<add name="CubeTechWebEntities" 
     connectionString="metadata=res://*/Models.Model.csdl|res://*/Models.Model.ssdl|res://*/Models.Model.msl;provider=System.Data.SqlClient;provider connection string=&quot;data source=.\SQLEXPRESS;initial catalog=ctcdb;persist security info=True;user id=ctc;password=ctc123$%^;MultipleActiveResultSets=True;App=EntityFramework&quot;" 
     providerName="System.Data.EntityClient" />
```

### 3. Test API
Mở browser và test các URL:
```
http://localhost:port/api/ActivitiesApi/GetActivities
http://localhost:port/api/ActivitiesApi/Filter?type=news
http://localhost:port/api/ActivitiesApi/Search?query=hội thảo
```

### 4. Test Giao diện
1. Truy cập trang hoạt động: `/WProducts/hoat_dong`
2. Kiểm tra các filter buttons hoạt động
3. Kiểm tra tính năng tìm kiếm (nếu có)
4. Kiểm tra modal chi tiết hoạt động

## Tính năng mới

### 1. Filter theo loại hoạt động
- **Tất cả**: Hiển thị tất cả hoạt động
- **Tin tức**: Chỉ hiển thị tin tức (type = 'news')
- **Sự kiện**: Chỉ hiển thị sự kiện (type = 'events')
- **Đào tạo**: Chỉ hiển thị khóa đào tạo (type = 'training')
- **Dự án**: Chỉ hiển thị dự án (type = 'projects')

### 2. Modal chi tiết
- Click vào link "Đọc toàn bộ bài viết" hoặc "Xem chi tiết" để mở modal
- Hiển thị thông tin đầy đủ về hoạt động
- Tự động cập nhật lượt xem

### 3. Responsive design
- Giao diện tối ưu cho mobile và desktop
- Animations mượt mà khi scroll

### 4. Loading states
- Hiển thị trạng thái loading khi tải dữ liệu
- Toast notifications cho các thao tác

## Troubleshooting

### 1. Lỗi kết nối database
```
Error: Cannot open database "ctcdb"
```
**Giải pháp**: Kiểm tra SQL Server đang chạy và database đã được tạo

### 2. Lỗi API không trả về dữ liệu
```
Error: Failed to load activities
```
**Giải pháp**: 
- Kiểm tra connection string trong web.config
- Đảm bảo bảng Activities có dữ liệu và IsPublished = 1

### 3. JavaScript không hoạt động
```
Error: ModernActivitiesManager is not defined
```
**Giải pháp**: Đảm bảo file `modern-activities.js` được load sau jQuery

### 4. Filter buttons không hoạt động
**Giải pháp**: Kiểm tra các buttons có đúng `data-filter` attribute

## Cấu trúc dữ liệu mẫu

### Ví dụ Activity record
```json
{
  "id": 1,
  "title": "Hội thảo Chuyển đổi số trong Xây dựng 2025",
  "description": "Hội thảo về ứng dụng công nghệ số...",
  "type": "events",
  "startDate": "2025-02-20",
  "endDate": null,
  "location": "Trung tâm Hội nghị Đà Nẵng",
  "participants": 150,
  "image": "/images/activities/hoi-thao-ben-vung.jpg",
  "isFeatured": true,
  "viewCount": 234,
  "typeLabel": "Sự kiện",
  "statusText": "Sắp diễn ra",
  "relativeTime": "2 tuần nữa"
}
```

## Lưu ý quan trọng

1. **Backup dữ liệu** trước khi chạy script SQL
2. **Test trên môi trường development** trước khi deploy production
3. **Kiểm tra permissions** của user `ctc` trên database
4. **Monitor performance** khi có nhiều dữ liệu

## Liên hệ hỗ trợ

Nếu gặp vấn đề trong quá trình cập nhật, vui lòng liên hệ team phát triển với thông tin:
- Lỗi cụ thể gặp phải
- Screenshots (nếu có)
- Log files từ browser console
