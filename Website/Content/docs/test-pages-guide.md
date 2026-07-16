# 🧪 Hướng dẫn sử dụng trang Test SQL

## 📋 Tổng quan

Đã tạo 2 trang test để kiểm tra SQL của bảng Activities:

### 1. **Activities Test Page**
- **URL:** `/Test/Activities`
- **Mục đích:** Kiểm tra toàn diện dữ liệu Activities
- **Tính năng:**
  - ✅ Test kết nối database
  - 📊 Hiển thị thống kê chi tiết
  - 🗃️ Xem tất cả dữ liệu thô
  - ⭐ Hiển thị activities nổi bật
  - 📈 Phân nhóm theo loại

### 2. **Custom SQL Query Page**
- **URL:** `/Test/SqlQuery`
- **Mục đích:** Chạy các câu lệnh SQL tùy chỉnh
- **Tính năng:**
  - 🔍 Nhập và thực thi SELECT queries
  - 📚 Các mẫu query có sẵn
  - 📊 Hiển thị kết quả dạng bảng
  - ⚠️ Bảo mật: Chỉ cho phép SELECT

## 🚀 Cách sử dụng

### **Bước 1: Build và chạy ứng dụng**
```
1. Build Solution (Ctrl+Shift+B)
2. Run Application (F5)
```

### **Bước 2: Truy cập trang test**
```
- Activities Test: http://localhost:port/Test/Activities
- SQL Query Test: http://localhost:port/Test/SqlQuery
```

## 📊 Tính năng Activities Test Page

### **Database Connection Test**
- Kiểm tra kết nối database có thành công không
- Hiển thị lỗi chi tiết nếu có

### **Statistics Dashboard**
- Total Activities: Tổng số activities
- Published: Số lượng đã xuất bản
- Featured: Số lượng nổi bật
- Phân loại theo type: news, events, training, projects

### **Data Tables**
- **All Activities:** Tất cả dữ liệu thô
- **Published Activities:** Chỉ activities đã xuất bản
- **Featured Activities:** Chỉ activities nổi bật

### **Quick Actions**
- 🔄 Refresh Data
- 🔍 Custom SQL Query
- 👀 View Live Page

## 🔍 Tính năng SQL Query Page

### **Sample Queries có sẵn:**

1. **All Activities**
   ```sql
   SELECT * FROM Activities
   ```

2. **Published Activities**
   ```sql
   SELECT * FROM Activities WHERE IsPublished = 1
   ```

3. **Count by Type**
   ```sql
   SELECT ActivityType, COUNT(*) as Count 
   FROM Activities WHERE IsPublished = 1 
   GROUP BY ActivityType
   ```

4. **Recent Activities**
   ```sql
   SELECT TOP 5 * FROM Activities 
   WHERE IsPublished = 1 
   ORDER BY CreatedDate DESC
   ```

5. **Featured Activities**
   ```sql
   SELECT * FROM Activities 
   WHERE IsFeatured = 1 AND IsPublished = 1
   ```

6. **View Statistics**
   ```sql
   SELECT ActivityType, AVG(ViewCount) as AvgViews, MAX(ViewCount) as MaxViews 
   FROM Activities WHERE IsPublished = 1 
   GROUP BY ActivityType
   ```

## 🛠️ Troubleshooting

### **Lỗi "Database connection failed"**
- Kiểm tra SQL Server có chạy không
- Kiểm tra connection string trong web.config
- Chạy lại script tạo database

### **Lỗi "No activities found"**
- Chạy script insert dữ liệu test
- Kiểm tra bảng Activities có tồn tại không

### **Lỗi "Only SELECT queries allowed"**
- Chỉ được phép chạy SELECT queries
- Không được chạy INSERT, UPDATE, DELETE

## 📝 Các query hữu ích khác

### **Kiểm tra cấu trúc bảng**
```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Activities'
```

### **Tìm activities theo từ khóa**
```sql
SELECT * FROM Activities 
WHERE Title LIKE '%keyword%' OR Description LIKE '%keyword%'
```

### **Activities theo tháng**
```sql
SELECT MONTH(CreatedDate) as Month, COUNT(*) as Count
FROM Activities 
WHERE YEAR(CreatedDate) = 2024
GROUP BY MONTH(CreatedDate)
```

### **Top activities có lượt xem cao**
```sql
SELECT TOP 10 Title, ViewCount, ActivityType
FROM Activities 
WHERE IsPublished = 1
ORDER BY ViewCount DESC
```

## 🎯 Mục đích sử dụng

- **Development:** Debug và kiểm tra dữ liệu
- **Testing:** Verify các query hoạt động đúng
- **Monitoring:** Theo dõi thống kê database
- **Troubleshooting:** Tìm và sửa lỗi dữ liệu
