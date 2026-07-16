# Checklist kiểm tra trang hoạt động

## ✅ Các thành phần đã hoàn thành

### 1. Models
- [x] **Activity.cs** - Model phù hợp với database
- [x] **ApplicationDbContext.cs** - DbContext với connection string đúng

### 2. Controllers  
- [x] **WProductsController.cs** - Action `hoat_dong()` lấy dữ liệu từ DB

### 3. Views
- [x] **hoat_dong.cshtml** - Hiển thị dữ liệu động từ ViewBag
- [x] **Helper functions** - GetActivityIcon(), GetStatusClass()

### 4. CSS
- [x] **activities-dynamic.css** - Styles cho elements động

### 5. Database
- [x] **create_ctcdb_database.sql** - Script tạo database
- [x] **insert_activities_from_js.sql** - Dữ liệu mẫu

## 🔧 Cần kiểm tra/cấu hình

### 1. Web.config
```xml
<connectionStrings>
  <add name="DefaultConnection" 
       connectionString="data source=.\SQLEXPRESS;initial catalog=ctcdb;persist security info=True;user id=ctc;password=ctc123$%^;MultipleActiveResultSets=True" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

### 2. Database Setup
```sql
-- 1. Chạy script tạo database
USE master;
-- [Chạy nội dung create_ctcdb_database.sql]

-- 2. Chèn dữ liệu mẫu  
USE ctcdb;
-- [Chạy nội dung insert_activities_from_js.sql]

-- 3. Kiểm tra dữ liệu
SELECT COUNT(*) FROM Activities WHERE IsPublished = 1;
```

### 3. Build & Test
```bash
# Build solution
Build -> Rebuild Solution

# Chạy ứng dụng
F5 hoặc Ctrl+F5

# Test URL
http://localhost:port/WProducts/hoat_dong
```

## 🚨 Các lỗi có thể gặp

### 1. "Cannot open database 'ctcdb'"
**Nguyên nhân**: Database chưa được tạo hoặc SQL Server không chạy
**Giải pháp**: 
- Kiểm tra SQL Server đang chạy
- Chạy script `create_ctcdb_database.sql`

### 2. "The model backing the context has changed"
**Nguyên nhân**: Model không khớp với database schema
**Giải pháp**:
- Delete files trong App_Data
- Rebuild solution

### 3. "Object reference not set to an instance"
**Nguyên nhân**: ViewBag data null
**Giải pháp**: 
- Kiểm tra controller action
- Thêm null checks trong view

### 4. Trang hiển thị "Chưa có hoạt động nào"
**Nguyên nhân**: Không có dữ liệu hoặc IsPublished = 0
**Giải pháp**:
- Chạy script `insert_activities_from_js.sql`
- Kiểm tra `SELECT * FROM Activities WHERE IsPublished = 1`

## 📋 Test Cases

### Test 1: Hiển thị dữ liệu cơ bản
- [ ] Trang load không lỗi
- [ ] Hiển thị danh sách hoạt động
- [ ] Thống kê hiển thị đúng
- [ ] CSS load đầy đủ

### Test 2: Dữ liệu từ database
- [ ] Hoạt động hiển thị từ bảng Activities
- [ ] Chỉ hiển thị IsPublished = 1
- [ ] Sắp xếp theo IsFeatured và StartDate
- [ ] Thông tin đầy đủ (title, description, date, location)

### Test 3: Responsive design
- [ ] Desktop hiển thị đúng
- [ ] Mobile/tablet responsive
- [ ] Icons hiển thị đúng
- [ ] Animations hoạt động

### Test 4: Error handling
- [ ] Graceful khi database lỗi
- [ ] Hiển thị message lỗi user-friendly
- [ ] Không crash khi không có dữ liệu

## 🎯 Kết quả mong đợi

Sau khi hoàn thành checklist:
- ✅ Trang hoạt động hiển thị dữ liệu từ SQL database
- ✅ Thống kê chính xác theo từng loại hoạt động
- ✅ Giao diện đẹp và responsive
- ✅ Xử lý lỗi graceful
- ✅ Performance tốt

## 🔍 Debug Commands

### Kiểm tra connection
```csharp
// Thêm vào controller
ViewBag.DebugInfo = $"Can connect: {db.Database.Exists()}";
```

### Kiểm tra dữ liệu
```sql
-- Trong SQL Server Management Studio
SELECT 
    ActivityType,
    COUNT(*) as Count,
    SUM(CASE WHEN IsPublished = 1 THEN 1 ELSE 0 END) as Published
FROM Activities 
GROUP BY ActivityType;
```

### Kiểm tra ViewBag
```html
<!-- Thêm vào view -->
<div>Total Activities: @allActivities.Count</div>
<div>Stats: @Html.Raw(Json.Encode(stats))</div>
```
