# Debug trang hoạt động không hiển thị

## 🔍 Các bước kiểm tra:

### 1. Kiểm tra URL
```
URL đúng: http://localhost:port/WProducts/hoat_dong
```

### 2. Kiểm tra Database
```sql
-- Kết nối SQL Server Management Studio
USE ctcdb;
SELECT COUNT(*) FROM Activities WHERE IsPublished = 1;
```

### 3. Kiểm tra Connection String
Trong `web.config`:
```xml
<connectionStrings>
  <add name="DefaultConnection" 
       connectionString="data source=.\SQLEXPRESS;initial catalog=ctcdb;persist security info=True;user id=ctc;password=ctc123$%^;MultipleActiveResultSets=True" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

### 4. Kiểm tra Controller
- Action `hoat_dong()` có tồn tại không?
- Có lỗi exception không?

### 5. Kiểm tra View
- File `hoat_dong.cshtml` có tồn tại không?
- Layout có đúng không?

## 🚨 Các lỗi thường gặp:

### Lỗi 1: Trang trắng/xanh
**Nguyên nhân:** CSS conflicts hoặc layout issues
**Giải pháp:** Kiểm tra test content có hiển thị không

### Lỗi 2: Database connection failed
**Nguyên nhân:** SQL Server không chạy hoặc connection string sai
**Giải pháp:** 
- Khởi động SQL Server
- Kiểm tra connection string
- Chạy script tạo database

### Lỗi 3: No data
**Nguyên nhân:** Bảng Activities trống
**Giải pháp:** Chạy script `insert_activities_from_js.sql`

### Lỗi 4: Layout conflicts
**Nguyên nhân:** Layout `_Layout.cshtml` có vấn đề
**Giải pháp:** Thay đổi `Layout = null` để test

## 🔧 Debug steps:

1. **Refresh trang** và kiểm tra:
   - Có thấy "TEST - Trang hoạt động đang load" không?
   - Debug info hiển thị gì?

2. **Nếu không thấy gì:**
   - Kiểm tra URL có đúng không
   - Kiểm tra có lỗi 404/500 không
   - Xem View Source có HTML không

3. **Nếu thấy test content:**
   - Kiểm tra debug info
   - Nếu Total Activities = 0 → Vấn đề database
   - Nếu có lỗi → Vấn đề connection

4. **Nếu có dữ liệu nhưng không hiển thị:**
   - Vấn đề CSS
   - Kiểm tra console errors
   - Tắt CSS để test

## 📋 Quick fixes:

### Fix 1: Tạo dữ liệu test
```sql
USE ctcdb;
INSERT INTO Activities (Title, Description, ActivityType, IsPublished, IsFeatured, CreatedDate, UpdatedDate)
VALUES 
(N'Test Activity', N'This is a test activity', 'news', 1, 1, GETDATE(), GETDATE());
```

### Fix 2: Simplify layout
```csharp
Layout = null; // Trong hoat_dong.cshtml
```

### Fix 3: Remove CSS conflicts
Tạm thời comment out CSS links để test.
