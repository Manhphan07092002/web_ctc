# Hướng dẫn Test Trang Hoạt động với Dữ liệu từ CSDL

## Tổng quan

Trang hoạt động đã được cập nhật để lấy dữ liệu trực tiếp từ cơ sở dữ liệu SQL thay vì dữ liệu tĩnh.

## Các thay đổi chính

### 1. Controller
- **WProductsController.cs**: Thêm action `hoat_dong()` để lấy dữ liệu từ database
- Sử dụng `ApplicationDbContext` để truy vấn bảng `Activities`
- Truyền dữ liệu qua `ViewBag`

### 2. View
- **hoat_dong.cshtml**: Cập nhật để hiển thị dữ liệu động từ ViewBag
- Thêm helper functions để format dữ liệu
- Hiển thị thống kê thực từ database

### 3. CSS
- **activities-dynamic.css**: CSS mới cho các elements động
- Styles cho error states, empty states, và activity cards

## Cách test

### Bước 1: Chuẩn bị Database
```sql
-- 1. Chạy script tạo database
USE master;
EXEC sp_executesql N'[Nội dung file create_ctcdb_database.sql]';

-- 2. Chèn dữ liệu mẫu
USE ctcdb;
EXEC sp_executesql N'[Nội dung file insert_sample_data.sql]';

-- 3. Kiểm tra dữ liệu
SELECT COUNT(*) as TotalActivities FROM Activities WHERE IsPublished = 1;
SELECT ActivityType, COUNT(*) as Count FROM Activities WHERE IsPublished = 1 GROUP BY ActivityType;
```

### Bước 2: Kiểm tra Connection String
Đảm bảo trong `web.config` có:
```xml
<connectionStrings>
  <add name="CubeTechWebEntities" 
       connectionString="metadata=res://*/Models.Model.csdl|res://*/Models.Model.ssdl|res://*/Models.Model.msl;provider=System.Data.SqlClient;provider connection string=&quot;data source=.\SQLEXPRESS;initial catalog=ctcdb;persist security info=True;user id=ctc;password=ctc123$%^;MultipleActiveResultSets=True;App=EntityFramework&quot;" 
       providerName="System.Data.EntityClient" />
</connectionStrings>
```

### Bước 3: Build và Test
```bash
# 1. Build solution
Build -> Rebuild Solution

# 2. Chạy ứng dụng
F5 hoặc Ctrl+F5

# 3. Truy cập trang hoạt động
http://localhost:port/WProducts/hoat_dong
```

## Test Cases

### 1. Test hiển thị dữ liệu bình thường
**Điều kiện**: Database có dữ liệu và IsPublished = 1
**Kết quả mong đợi**:
- Hiển thị danh sách hoạt động
- Thống kê chính xác
- Filter buttons hoạt động
- Responsive design

### 2. Test trường hợp không có dữ liệu
**Điều kiện**: Database trống hoặc không có hoạt động nào IsPublished = 1
**Kết quả mong đợi**:
- Hiển thị "Chưa có hoạt động nào"
- Thống kê = 0
- Không có lỗi JavaScript

### 3. Test lỗi kết nối database
**Điều kiện**: Connection string sai hoặc database không tồn tại
**Kết quả mong đợi**:
- Hiển thị thông báo lỗi
- Trang không bị crash
- Có thể reload để thử lại

### 4. Test các loại hoạt động
**Điều kiện**: Database có đủ 4 loại: news, events, training, projects
**Kết quả mong đợi**:
- Mỗi loại hiển thị icon đúng
- Thống kê chính xác cho từng loại
- Filter hoạt động (nếu JavaScript được enable)

## Checklist Test

### Giao diện
- [ ] Trang load không lỗi
- [ ] Hiển thị đúng title và meta tags
- [ ] CSS load đầy đủ
- [ ] Responsive trên mobile/tablet
- [ ] Icons hiển thị đúng

### Dữ liệu
- [ ] Hoạt động hiển thị từ database
- [ ] Thống kê chính xác
- [ ] Thông tin chi tiết đầy đủ (title, description, date, location, etc.)
- [ ] Sắp xếp theo IsFeatured và StartDate
- [ ] Chỉ hiển thị hoạt động IsPublished = 1

### Xử lý lỗi
- [ ] Graceful handling khi database lỗi
- [ ] Thông báo lỗi user-friendly
- [ ] Không crash khi không có dữ liệu
- [ ] Log lỗi vào Debug output

### Performance
- [ ] Trang load nhanh
- [ ] Query database hiệu quả
- [ ] Không memory leak
- [ ] Caching (nếu có)

## Debug

### Kiểm tra Database Connection
```csharp
// Thêm vào action để debug
try 
{
    using (var db = new ApplicationDbContext())
    {
        var canConnect = db.Database.Exists();
        ViewBag.DebugInfo = $"Can connect: {canConnect}";
        
        if (canConnect)
        {
            var count = db.Activities.Count();
            ViewBag.DebugInfo += $", Total activities: {count}";
        }
    }
}
catch (Exception ex)
{
    ViewBag.DebugInfo = $"Error: {ex.Message}";
}
```

### Kiểm tra ViewBag Data
```html
<!-- Thêm vào view để debug -->
@if (ViewBag.DebugInfo != null)
{
    <div style="background: #f0f0f0; padding: 10px; margin: 10px 0;">
        <strong>Debug Info:</strong> @ViewBag.DebugInfo
    </div>
}
```

### Kiểm tra JavaScript Console
```javascript
// Mở F12 -> Console để xem lỗi JavaScript
console.log('Activities data:', @Html.Raw(Json.Encode(allActivities)));
```

## Troubleshooting

### Lỗi thường gặp

1. **"Cannot open database 'ctcdb'"**
   - Kiểm tra SQL Server đang chạy
   - Kiểm tra connection string
   - Đảm bảo database đã được tạo

2. **"The model backing the context has changed"**
   - Delete file trong App_Data
   - Rebuild solution
   - Hoặc update database schema

3. **"Object reference not set to an instance"**
   - Kiểm tra ViewBag data không null
   - Thêm null checks trong view

4. **CSS không load**
   - Kiểm tra đường dẫn file CSS
   - Clear browser cache
   - Kiểm tra file tồn tại

### Performance Issues

1. **Trang load chậm**
   - Thêm index cho bảng Activities
   - Limit số lượng records
   - Implement caching

2. **Memory usage cao**
   - Dispose DbContext properly
   - Không load toàn bộ Description
   - Sử dụng pagination

## Kết quả mong đợi

Sau khi test thành công:
- Trang hoạt động hiển thị dữ liệu từ database
- Thống kê chính xác và real-time
- Giao diện đẹp và responsive
- Xử lý lỗi graceful
- Performance tốt

## Liên hệ hỗ trợ

Nếu gặp vấn đề trong quá trình test, vui lòng cung cấp:
- Screenshot lỗi
- Browser console logs
- Server error logs (nếu có)
- Thông tin database connection
