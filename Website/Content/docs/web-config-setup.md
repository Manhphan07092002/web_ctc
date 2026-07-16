# Cấu hình Web.config cho trang hoạt động

## Connection String cần thêm

Thêm connection string sau vào file `web.config` trong section `<connectionStrings>`:

```xml
<connectionStrings>
  <!-- Connection string cho Entity Framework (đã có) -->
  <add name="CubeTechWebEntities" 
       connectionString="metadata=res://*/Models.Model.csdl|res://*/Models.Model.ssdl|res://*/Models.Model.msl;provider=System.Data.SqlClient;provider connection string=&quot;data source=.\SQLEXPRESS;initial catalog=ctcdb;persist security info=True;user id=ctc;password=ctc123$%^;MultipleActiveResultSets=True;App=EntityFramework&quot;" 
       providerName="System.Data.EntityClient" />
  
  <!-- Connection string cho Activities (THÊM MỚI) -->
  <add name="DefaultConnection" 
       connectionString="data source=.\SQLEXPRESS;initial catalog=ctcdb;persist security info=True;user id=ctc;password=ctc123$%^;MultipleActiveResultSets=True" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

## Giải thích

- **CubeTechWebEntities**: Entity Framework connection string (đã có sẵn)
- **DefaultConnection**: SQL connection string thuần túy cho ApplicationDbContext

## Kiểm tra hoạt động

### 1. Kiểm tra database
```sql
-- Kết nối SQL Server Management Studio
-- Server: .\SQLEXPRESS
-- Database: ctcdb
-- User: ctc / Password: ctc123$%^

USE ctcdb;
SELECT COUNT(*) FROM Activities WHERE IsPublished = 1;
```

### 2. Test trang web
```
URL: http://localhost:port/WProducts/hoat_dong
```

### 3. Debug nếu có lỗi
Thêm vào controller để debug:
```csharp
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

Và hiển thị trong view:
```html
@if (ViewBag.DebugInfo != null)
{
    <div style="background: #f0f0f0; padding: 10px; margin: 10px 0;">
        <strong>Debug Info:</strong> @ViewBag.DebugInfo
    </div>
}
```
