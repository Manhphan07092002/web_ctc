<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web" %>

<%
    // Thử connection string trực tiếp với database ctcdb
    string connectionString = "Data Source=.;Initial Catalog=ctcdb;Integrated Security=True";
    
    // Fallback to config if exists
    try {
        if (ConfigurationManager.ConnectionStrings["DefaultConnection"] != null) {
            connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        }
    } catch { }
    
    string action = Request.Form["action"] ?? Request.QueryString["action"] ?? "";
    string message = "";
    string messageType = "";
    
    // Xử lý các thao tác CRUD
    if (Request.HttpMethod == "POST")
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                
                switch (action)
                {
                    case "create":
                        string insertQuery = @"
                            INSERT INTO Activities (Title, Description, ActivityType, StartDate, EndDate, Location, 
                                                  IsPublished, IsFeatured, ImageUrl, DocumentUrl, Participants, CreatedDate, IsDeleted, ViewCount, LikeCount)
                            VALUES (@Title, @Description, @ActivityType, @StartDate, @EndDate, @Location, 
                                   @IsPublished, @IsFeatured, @ImageUrl, @DocumentUrl, @Participants, GETDATE(), 0, 0, 0)";
                        
                        using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                        {
                            DateTime startDate, endDate;
                            if (!DateTime.TryParse(Request.Form["activityDate"], out startDate))
                            {
                                startDate = DateTime.Now;
                            }
                            endDate = startDate.AddHours(2); // Default 2 hours duration
                            
                            // Validate and truncate data - Conservative limits for CREATE
                            string title = (Request.Form["title"] ?? "").Trim();
                            if (title.Length > 100) title = title.Substring(0, 100);
                            
                            string description = (Request.Form["description"] ?? "").Trim();
                            if (description.Length > 1000) description = description.Substring(0, 1000);
                            
                            string activityType = (Request.Form["activityType"] ?? "").Trim();
                            if (activityType.Length > 20) activityType = activityType.Substring(0, 20);
                            
                            string location = (Request.Form["location"] ?? "").Trim();
                            if (location.Length > 100) location = location.Substring(0, 100);
                            
                            string participants = (Request.Form["participants"] ?? "").Trim();
                            if (participants.Length > 200) participants = participants.Substring(0, 200);
                            
                            // Xử lý upload hình ảnh
                            string imageUrl = "";
                            if (Request.Files["imageFile"] != null && Request.Files["imageFile"].ContentLength > 0)
                            {
                                HttpPostedFile imageFile = Request.Files["imageFile"];
                                string uploadFolder = "~/uploads/images/";
                                string physicalPath = Server.MapPath(uploadFolder);
                                
                                if (!Directory.Exists(physicalPath))
                                    Directory.CreateDirectory(physicalPath);
                                
                                string fileExtension = Path.GetExtension(imageFile.FileName).ToLower();
                                string fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + Guid.NewGuid().ToString("N").Substring(0, 8) + fileExtension;
                                string filePath = Path.Combine(physicalPath, fileName);
                                
                                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp" };
                                if (allowedExtensions.Contains(fileExtension) && imageFile.ContentLength <= 5 * 1024 * 1024)
                                {
                                    imageFile.SaveAs(filePath);
                                    imageUrl = uploadFolder.Replace("~/", "/") + fileName;
                                }
                            }
                            else if (!string.IsNullOrEmpty(Request.Form["imageUrl"]))
                            {
                                imageUrl = Request.Form["imageUrl"].Trim();
                                if (imageUrl.Length > 500) imageUrl = imageUrl.Substring(0, 500);
                            }
                            
                            // Xử lý upload tài liệu
                            string documentUrl = "";
                            if (Request.Files["documentFile"] != null && Request.Files["documentFile"].ContentLength > 0)
                            {
                                HttpPostedFile docFile = Request.Files["documentFile"];
                                string uploadFolder = "~/uploads/documents/";
                                string physicalPath = Server.MapPath(uploadFolder);
                                
                                if (!Directory.Exists(physicalPath))
                                    Directory.CreateDirectory(physicalPath);
                                
                                string fileExtension = Path.GetExtension(docFile.FileName).ToLower();
                                string fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + Guid.NewGuid().ToString("N").Substring(0, 8) + fileExtension;
                                string filePath = Path.Combine(physicalPath, fileName);
                                
                                string[] allowedExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };
                                if (allowedExtensions.Contains(fileExtension) && docFile.ContentLength <= 10 * 1024 * 1024)
                                {
                                    docFile.SaveAs(filePath);
                                    documentUrl = uploadFolder.Replace("~/", "/") + fileName;
                                }
                            }
                            else if (!string.IsNullOrEmpty(Request.Form["documentUrl"]))
                            {
                                documentUrl = Request.Form["documentUrl"].Trim();
                                if (documentUrl.Length > 500) documentUrl = documentUrl.Substring(0, 500);
                            }
                            
                            cmd.Parameters.AddWithValue("@Title", title);
                            cmd.Parameters.AddWithValue("@Description", description);
                            cmd.Parameters.AddWithValue("@ActivityType", activityType);
                            cmd.Parameters.AddWithValue("@StartDate", startDate);
                            cmd.Parameters.AddWithValue("@EndDate", endDate);
                            cmd.Parameters.AddWithValue("@Location", location);
                            cmd.Parameters.AddWithValue("@Participants", participants);
                            cmd.Parameters.AddWithValue("@IsPublished", Request.Form["isPublished"] == "on");
                            cmd.Parameters.AddWithValue("@IsFeatured", Request.Form["isFeatured"] == "on");
                            cmd.Parameters.AddWithValue("@ImageUrl", imageUrl);
                            cmd.Parameters.AddWithValue("@DocumentUrl", documentUrl);
                            
                            cmd.ExecuteNonQuery();
                            message = "Thêm hoạt động thành công!";
                            messageType = "success";
                        }
                        break;
                        
                    case "update":
                        string updateQuery = @"
                            UPDATE Activities SET 
                                Title = @Title, Description = @Description, ActivityType = @ActivityType,
                                StartDate = @StartDate, EndDate = @EndDate, Location = @Location, 
                                IsPublished = @IsPublished, IsFeatured = @IsFeatured, ImageUrl = @ImageUrl,
                                DocumentUrl = @DocumentUrl, Participants = @Participants, UpdatedDate = GETDATE()
                            WHERE ActivityID = @ActivityID AND IsDeleted = 0";
                        
                        using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                        {
                            int activityId;
                            if (!int.TryParse(Request.Form["id"], out activityId))
                            {
                                throw new ArgumentException("ID hoạt động không hợp lệ");
                            }
                            
                            DateTime startDate, endDate;
                            if (!DateTime.TryParse(Request.Form["activityDate"], out startDate))
                            {
                                startDate = DateTime.Now;
                            }
                            endDate = startDate.AddHours(2); // Default 2 hours duration
                            
                            // Validate and truncate data - Conservative limits for UPDATE
                            string title = (Request.Form["title"] ?? "").Trim();
                            if (title.Length > 100) title = title.Substring(0, 100);
                            
                            string description = (Request.Form["description"] ?? "").Trim();
                            if (description.Length > 1000) description = description.Substring(0, 1000);
                            
                            string activityType = (Request.Form["activityType"] ?? "").Trim();
                            if (activityType.Length > 20) activityType = activityType.Substring(0, 20);
                            
                            string location = (Request.Form["location"] ?? "").Trim();
                            if (location.Length > 100) location = location.Substring(0, 100);
                            
                            string participants = (Request.Form["participants"] ?? "").Trim();
                            if (participants.Length > 200) participants = participants.Substring(0, 200);
                            
                            // Xử lý upload hình ảnh
                            string imageUrl = "";
                            if (Request.Files["imageFile"] != null && Request.Files["imageFile"].ContentLength > 0)
                            {
                                HttpPostedFile imageFile = Request.Files["imageFile"];
                                string uploadFolder = "~/uploads/images/";
                                string physicalPath = Server.MapPath(uploadFolder);
                                
                                if (!Directory.Exists(physicalPath))
                                    Directory.CreateDirectory(physicalPath);
                                
                                string fileExtension = Path.GetExtension(imageFile.FileName).ToLower();
                                string fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + Guid.NewGuid().ToString("N").Substring(0, 8) + fileExtension;
                                string filePath = Path.Combine(physicalPath, fileName);
                                
                                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp" };
                                if (allowedExtensions.Contains(fileExtension) && imageFile.ContentLength <= 5 * 1024 * 1024)
                                {
                                    imageFile.SaveAs(filePath);
                                    imageUrl = uploadFolder.Replace("~/", "/") + fileName;
                                }
                            }
                            else if (!string.IsNullOrEmpty(Request.Form["imageUrl"]))
                            {
                                imageUrl = Request.Form["imageUrl"].Trim();
                                if (imageUrl.Length > 500) imageUrl = imageUrl.Substring(0, 500);
                            }
                            
                            // Xử lý upload tài liệu
                            string documentUrl = "";
                            if (Request.Files["documentFile"] != null && Request.Files["documentFile"].ContentLength > 0)
                            {
                                HttpPostedFile docFile = Request.Files["documentFile"];
                                string uploadFolder = "~/uploads/documents/";
                                string physicalPath = Server.MapPath(uploadFolder);
                                
                                if (!Directory.Exists(physicalPath))
                                    Directory.CreateDirectory(physicalPath);
                                
                                string fileExtension = Path.GetExtension(docFile.FileName).ToLower();
                                string fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" + Guid.NewGuid().ToString("N").Substring(0, 8) + fileExtension;
                                string filePath = Path.Combine(physicalPath, fileName);
                                
                                string[] allowedExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };
                                if (allowedExtensions.Contains(fileExtension) && docFile.ContentLength <= 10 * 1024 * 1024)
                                {
                                    docFile.SaveAs(filePath);
                                    documentUrl = uploadFolder.Replace("~/", "/") + fileName;
                                }
                            }
                            else if (!string.IsNullOrEmpty(Request.Form["documentUrl"]))
                            {
                                documentUrl = Request.Form["documentUrl"].Trim();
                                if (documentUrl.Length > 500) documentUrl = documentUrl.Substring(0, 500);
                            }
                            
                            cmd.Parameters.AddWithValue("@ActivityID", activityId);
                            cmd.Parameters.AddWithValue("@Title", title);
                            cmd.Parameters.AddWithValue("@Description", description);
                            cmd.Parameters.AddWithValue("@ActivityType", activityType);
                            cmd.Parameters.AddWithValue("@StartDate", startDate);
                            cmd.Parameters.AddWithValue("@EndDate", endDate);
                            cmd.Parameters.AddWithValue("@Location", location);
                            cmd.Parameters.AddWithValue("@Participants", participants);
                            cmd.Parameters.AddWithValue("@IsPublished", Request.Form["isPublished"] == "on");
                            cmd.Parameters.AddWithValue("@IsFeatured", Request.Form["isFeatured"] == "on");
                            cmd.Parameters.AddWithValue("@ImageUrl", imageUrl);
                            cmd.Parameters.AddWithValue("@DocumentUrl", documentUrl);
                            
                            cmd.ExecuteNonQuery();
                            message = "Cập nhật hoạt động thành công!";
                            messageType = "success";
                        }
                        break;
                        
                    case "delete":
                        int deleteId;
                        if (!int.TryParse(Request.Form["id"], out deleteId))
                        {
                            throw new ArgumentException("ID hoạt động không hợp lệ");
                        }
                        
                        string deleteQuery = "UPDATE Activities SET IsDeleted = 1, UpdatedDate = GETDATE() WHERE ActivityID = @ActivityID";
                        using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@ActivityID", deleteId);
                            cmd.ExecuteNonQuery();
                            message = "Xóa hoạt động thành công!";
                            messageType = "success";
                        }
                        break;
                        
                    case "restore":
                        int restoreId;
                        if (!int.TryParse(Request.Form["id"], out restoreId))
                        {
                            throw new ArgumentException("ID hoạt động không hợp lệ");
                        }
                        
                        string restoreQuery = "UPDATE Activities SET IsDeleted = 0, UpdatedDate = GETDATE() WHERE ActivityID = @ActivityID";
                        using (SqlCommand cmd = new SqlCommand(restoreQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@ActivityID", restoreId);
                            cmd.ExecuteNonQuery();
                            message = "Khôi phục hoạt động thành công!";
                            messageType = "success";
                        }
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            message = "Lỗi: " + ex.Message;
            messageType = "error";
        }
    }
    
    // Lấy danh sách hoạt động
    string searchTerm = Request.QueryString["search"] ?? "";
    string filterType = Request.QueryString["filter"] ?? "";
    string publishedFilter = Request.QueryString["published"] ?? "";
    string showDeleted = Request.QueryString["deleted"] ?? "";
    string dateFrom = Request.QueryString["dateFrom"] ?? "";
    string dateTo = Request.QueryString["dateTo"] ?? "";
    string locationFilter = Request.QueryString["location"] ?? "";
    string featuredFilter = Request.QueryString["featured"] ?? "";
    string sortBy = Request.QueryString["sortBy"] ?? "date";
    string sortOrder = Request.QueryString["sortOrder"] ?? "desc";
    int currentPage;
    if (!int.TryParse(Request.QueryString["page"] ?? "1", out currentPage) || currentPage < 1)
    {
        currentPage = 1;
    }
    int pageSize = 10;
    int totalRecords = 0;
    int publishedCount = 0;
    int featuredCount = 0;
    int filteredRecords = 0;
    DataTable activitiesData = new DataTable(); // Fixed duplicate declaration issue
    
    try
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            
            // Get accurate statistics from database
            string statsQuery = @"
                SELECT 
                    COUNT(*) as TotalCount,
                    SUM(CASE WHEN ISNULL(IsPublished, 0) = 1 AND ISNULL(IsDeleted, 0) = 0 THEN 1 ELSE 0 END) as PublishedCount,
                    SUM(CASE WHEN ISNULL(IsFeatured, 0) = 1 AND ISNULL(IsDeleted, 0) = 0 THEN 1 ELSE 0 END) as FeaturedCount
                FROM Activities 
                WHERE ISNULL(IsDeleted, 0) = 0";
                
            using (SqlCommand statsCmd = new SqlCommand(statsQuery, conn))
            {
                using (SqlDataReader reader = statsCmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        totalRecords = Convert.ToInt32(reader[0]); // TotalCount
                        publishedCount = Convert.ToInt32(reader[1]); // PublishedCount
                        featuredCount = Convert.ToInt32(reader[2]); // FeaturedCount
                    }
                }
            }
            
            // Đếm số bản ghi sau khi filter - Simplified query
            string countQuery = @"
                SELECT COUNT(*) FROM Activities 
                WHERE (ISNULL(IsDeleted, 0) = 0 OR @ShowDeleted = '1')
                AND (@Search = '' OR Title LIKE '%' + @Search + '%' OR Description LIKE '%' + @Search + '%')
                AND (@Filter = '' OR ActivityType = @Filter)
                AND (@Location = '' OR Location LIKE '%' + @Location + '%')
                AND (@Featured = '' OR (@Featured = '1' AND ISNULL(IsFeatured, 0) = 1))
                AND (@Published = '' OR ISNULL(IsPublished, 0) = @Published)";
            using (SqlCommand cmd = new SqlCommand(countQuery, conn))
            {
                cmd.Parameters.AddWithValue("@ShowDeleted", showDeleted);
                cmd.Parameters.AddWithValue("@Search", searchTerm);
                cmd.Parameters.AddWithValue("@Filter", filterType);
                cmd.Parameters.AddWithValue("@Location", locationFilter);
                cmd.Parameters.AddWithValue("@Featured", featuredFilter);
                cmd.Parameters.AddWithValue("@Published", publishedFilter);
                
                filteredRecords = (int)cmd.ExecuteScalar();
            }
            
            // Xây dựng ORDER BY clause
            string orderByClause = "CreatedDate DESC";
            switch (sortBy.ToLower())
            {
                case "title":
                    orderByClause = "Title " + (sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC");
                    break;
                case "type":
                    orderByClause = "ActivityType " + (sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC");
                    break;
                case "date":
                    orderByClause = "StartDate " + (sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC");
                    break;
                default:
                    orderByClause = "CreatedDate " + (sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC");
                    break;
            }
            
            // Lấy dữ liệu với phân trang - Simplified query
            string selectQuery = @"
                SELECT * FROM (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY " + orderByClause + @") as RowNum
                    FROM Activities 
                    WHERE (ISNULL(IsDeleted, 0) = 0 OR @ShowDeleted = '1')
                    AND (@Search = '' OR Title LIKE '%' + @Search + '%' OR Description LIKE '%' + @Search + '%')
                    AND (@Filter = '' OR ActivityType = @Filter)
                    AND (@Location = '' OR Location LIKE '%' + @Location + '%')
                    AND (@Featured = '' OR (@Featured = '1' AND ISNULL(IsFeatured, 0) = 1))
                    AND (@Published = '' OR ISNULL(IsPublished, 0) = @Published)
                ) AS NumberedActivities
                WHERE RowNum BETWEEN @StartRow AND @EndRow";
            
            using (SqlCommand cmd = new SqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@ShowDeleted", showDeleted);
                cmd.Parameters.AddWithValue("@Search", searchTerm);
                cmd.Parameters.AddWithValue("@Filter", filterType);
                cmd.Parameters.AddWithValue("@Location", locationFilter);
                cmd.Parameters.AddWithValue("@Featured", featuredFilter);
                cmd.Parameters.AddWithValue("@Published", publishedFilter);
                cmd.Parameters.AddWithValue("@StartRow", (currentPage - 1) * pageSize + 1);
                cmd.Parameters.AddWithValue("@EndRow", currentPage * pageSize);
                
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(activitiesData);
            }
        }
    }
    catch (Exception ex)
    {
        message = "Lỗi tải dữ liệu: " + ex.Message;
        messageType = "error";
        
        // Try simple query as fallback
        try {
            using (SqlConnection conn = new SqlConnection(connectionString)) {
                conn.Open();
                string simpleQuery = "SELECT TOP 10 * FROM Activities ORDER BY ActivityID DESC";
                SqlDataAdapter adapter = new SqlDataAdapter(simpleQuery, conn);
                activitiesData.Clear();
                adapter.Fill(activitiesData);
                filteredRecords = activitiesData.Rows.Count;
            }
        } catch (Exception ex2) {
            // Fallback failed, will use test data below
        }
        
        // Tạo test data nếu có lỗi
        activitiesData.Clear();
        activitiesData.Columns.Add("ActivityID", typeof(int));
        activitiesData.Columns.Add("Title", typeof(string));
        activitiesData.Columns.Add("Description", typeof(string));
        activitiesData.Columns.Add("ActivityType", typeof(string));
        activitiesData.Columns.Add("StartDate", typeof(DateTime));
        activitiesData.Columns.Add("Location", typeof(string));
        activitiesData.Columns.Add("Participants", typeof(string));
        activitiesData.Columns.Add("IsPublished", typeof(bool));
        activitiesData.Columns.Add("IsFeatured", typeof(bool));
        activitiesData.Columns.Add("IsDeleted", typeof(bool));
        
        // Thêm test row
        DataRow testRow = activitiesData.NewRow();
        testRow["ActivityID"] = 1;
        testRow["Title"] = "Test Activity";
        testRow["Description"] = "This is a test activity";
        testRow["ActivityType"] = "event";
        testRow["StartDate"] = DateTime.Now;
        testRow["Location"] = "Test Location";
        testRow["Participants"] = "Test Participants";
        testRow["IsPublished"] = true;
        testRow["IsFeatured"] = false;
        testRow["IsDeleted"] = false;
        activitiesData.Rows.Add(testRow);
        
        filteredRecords = 1;
    }
    
    int totalPages = (int)Math.Ceiling((double)filteredRecords / pageSize);
%>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Hoạt động - Admin</title>
    
    <!-- External CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/admin-hoat-dong.css">
</head>
<body>
    <div class="admin-container">
        <!-- Header -->
        <header class="admin-header">
            <div class="header-content">
                <h1><i class="fas fa-calendar-alt"></i> Quản lý Hoạt động</h1>
                <div class="header-actions">
                    <div class="action-group">
                        <button class="btn btn-success" onclick="exportData('excel')">
                            <i class="fas fa-file-excel"></i> Excel
                        </button>
                        <button class="btn btn-danger" onclick="exportData('pdf')">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                        <button class="btn btn-info" onclick="exportData('csv')">
                            <i class="fas fa-file-csv"></i> CSV
                        </button>
                    </div>
                    
                    <div class="action-group">
                        <button class="btn btn-primary" onclick="showCreateForm()">
                            <i class="fas fa-plus"></i> Thêm hoạt động
                        </button>
                        <a href="hoat_dong_database.aspx" class="btn btn-secondary" target="_blank">
                            <i class="fas fa-eye"></i> Xem trang công khai
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Message Alert -->
        <% if (!string.IsNullOrEmpty(message)) { %>
        <div class="alert alert-<%= messageType %>">
            <i class="fas fa-<%= messageType == "success" ? "check-circle" : "exclamation-triangle" %>"></i>
            <%= message %>
        </div>
        <% } %>

        <!-- Advanced Filters -->
        <div class="filters-section">
            <div class="filters-header">
                <h4><i class="fas fa-filter"></i> Bộ lọc và tìm kiếm</h4>
                <button type="button" class="btn-toggle-filters" onclick="toggleAdvancedFilters()">
                    <i class="fas fa-chevron-down"></i> Nâng cao
                </button>
            </div>
            
            <form method="get" class="filters-form">
                <div class="basic-filters">
                    <div class="filter-group">
                        <label>Tìm kiếm</label>
                        <div class="search-input-group">
                            <input type="text" name="search" placeholder="Tìm kiếm theo tiêu đề, mô tả..." 
                                   value="<%= searchTerm %>" class="form-control" id="searchInput">
                            <button type="button" class="search-clear <%= !string.IsNullOrEmpty(searchTerm) ? "show" : "" %>" onclick="clearSearch()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label>Loại hoạt động</label>
                        <select name="filter" class="form-control">
                            <option value="">Tất cả loại</option>
                            <option value="event" <%= filterType == "event" ? "selected" : "" %>>Sự kiện</option>
                            <option value="training" <%= filterType == "training" ? "selected" : "" %>>Đào tạo</option>
                            <option value="meeting" <%= filterType == "meeting" ? "selected" : "" %>>Cuộc họp</option>
                            <option value="notification" <%= filterType == "notification" ? "selected" : "" %>>Thông báo</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Trạng thái xuất bản</label>
                        <select name="published" class="form-control">
                            <option value="">Tất cả</option>
                            <option value="1" <%= Request.QueryString["published"] == "1" ? "selected" : "" %>>Đã xuất bản</option>
                            <option value="0" <%= Request.QueryString["published"] == "0" ? "selected" : "" %>>Chưa xuất bản</option>
                        </select>
                    </div>
                    
                    <div class="filter-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-search"></i> Tìm kiếm
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="resetFilters()">
                            <i class="fas fa-undo"></i> Đặt lại
                        </button>
                    </div>
                </div>
                
                <div class="advanced-filters" id="advancedFilters" style="display: none;">
                    <div class="filter-row">
                        <div class="filter-group">
                            <label>Ngày tạo từ</label>
                            <input type="date" name="dateFrom" class="form-control" value="<%= Request.QueryString["dateFrom"] ?? "" %>">
                        </div>
                        
                        <div class="filter-group">
                            <label>Ngày tạo đến</label>
                            <input type="date" name="dateTo" class="form-control" value="<%= Request.QueryString["dateTo"] ?? "" %>">
                        </div>
                        
                        <div class="filter-group">
                            <label>Địa điểm</label>
                            <input type="text" name="location" placeholder="Tìm theo địa điểm..." 
                                   value="<%= Request.QueryString["location"] ?? "" %>" class="form-control">
                        </div>
                    </div>
                    
                    <div class="filter-row">
                        <div class="filter-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="featured" value="1" <%= Request.QueryString["featured"] == "1" ? "checked" : "" %>>
                                Chỉ hoạt động nổi bật
                            </label>
                        </div>
                        
                        <div class="filter-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="deleted" value="1" <%= showDeleted == "1" ? "checked" : "" %>>
                                Hiển thị đã xóa
                            </label>
                        </div>
                        
                        <div class="filter-group">
                            <label>Sắp xếp theo</label>
                            <select name="sortBy" class="form-control">
                                <option value="date" <%= Request.QueryString["sortBy"] == "date" ? "selected" : "" %>>Ngày tạo</option>
                                <option value="title" <%= Request.QueryString["sortBy"] == "title" ? "selected" : "" %>>Tiêu đề</option>
                                <option value="type" <%= Request.QueryString["sortBy"] == "type" ? "selected" : "" %>>Loại hoạt động</option>
                                <option value="status" <%= Request.QueryString["sortBy"] == "status" ? "selected" : "" %>>Trạng thái</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Thứ tự</label>
                            <select name="sortOrder" class="form-control">
                                <option value="desc" <%= Request.QueryString["sortOrder"] == "desc" ? "selected" : "" %>>Giảm dần</option>
                                <option value="asc" <%= Request.QueryString["sortOrder"] == "asc" ? "selected" : "" %>>Tăng dần</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            
            <!-- Quick Stats -->
            <div class="quick-stats">
                <div class="stat-item">
                    <span class="stat-number"><%= totalRecords %></span>
                    <span class="stat-label">Tổng số</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><%= publishedCount %></span>
                    <span class="stat-label">Đã xuất bản</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><%= featuredCount %></span>
                    <span class="stat-label">Nổi bật</span>
                </div>
            </div>
        </div>

        <!-- Activities Table -->
        <div class="table-section">
            <div class="table-header">
                <h3>Danh sách hoạt động (<%= filteredRecords %> kết quả)</h3>
            </div>
            
            <div class="table-responsive">
                <table class="activities-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Loại</th>
                            <th>Ngày bắt đầu</th>
                            <th>Địa điểm</th>
                            <th>Người tham gia</th>
                            <th>Hình ảnh</th>
                            <th>Tài liệu</th>
                            <th>Nổi bật</th>
                            <th>Đã xuất bản</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% foreach (DataRow row in activitiesData.Rows) { %>
                        <tr class="<%= Convert.ToBoolean(row["IsDeleted"]) ? "deleted-row" : "" %>">
                            <td><%= row["ActivityID"] %></td>
                            <td>
                                <div class="activity-title">
                                    <%= row["Title"] != DBNull.Value ? row["Title"].ToString() : "" %>
                                    <% if (row["IsFeatured"] != DBNull.Value && Convert.ToBoolean(row["IsFeatured"])) { %>
                                    <span class="badge badge-featured">Nổi bật</span>
                                    <% } %>
                                    <% if (row["IsPublished"] != DBNull.Value && Convert.ToBoolean(row["IsPublished"])) { %>
                                    <span class="badge badge-published">Đã xuất bản</span>
                                    <% } %>
                                </div>
                                <div class="activity-description">
                                    <% 
                                        string description = row["Description"] != DBNull.Value ? row["Description"].ToString() : "";
                                        string displayDescription = description.Length > 100 ? description.Substring(0, 100) + "..." : description;
                                    %>
                                    <%= displayDescription %>
                                </div>
                            </td>
                            <td>
                                <span class="activity-type type-<%= row["ActivityType"] != DBNull.Value ? row["ActivityType"].ToString() : "" %>">
                                    <%= row["ActivityType"] != DBNull.Value ? row["ActivityType"].ToString() : "" %>
                                </span>
                            </td>
                            <td><%= row["StartDate"] != DBNull.Value ? Convert.ToDateTime(row["StartDate"]).ToString("dd/MM/yyyy HH:mm") : "" %></td>
                            <td><%= row["Location"] != DBNull.Value ? row["Location"].ToString() : "" %></td>
                            <td><%= row["Participants"] != DBNull.Value ? row["Participants"].ToString() : "" %></td>
                            <td>
                                <% 
                                    string imageUrl = row["ImageUrl"] != DBNull.Value ? row["ImageUrl"].ToString() : "";
                                %>
                                <% if (!string.IsNullOrEmpty(imageUrl)) { %>
                                <div class="image-thumbnail" onclick="viewImage('<%= imageUrl %>')" title="Click để xem ảnh lớn">
                                    <img src="<%= imageUrl %>" alt="Activity Image" class="thumbnail-img">
                                </div>
                                <% } else { %>
                                <div class="no-image">
                                    <span class="no-image-text">No image</span>
                                </div>
                                <% } %>
                            </td>
                            <td>
                                <% 
                                    string documentUrl = row["DocumentUrl"] != DBNull.Value ? row["DocumentUrl"].ToString() : "";
                                %>
                                <% if (!string.IsNullOrEmpty(documentUrl)) { %>
                                <button class="btn-download-document" onclick="downloadDocument('<%= documentUrl %>')" title="Tải xuống tài liệu">
                                    <i class="fas fa-download"></i>
                                </button>
                                <% } else { %>
                                <div class="no-file">
                                    <span class="no-file-text">No file</span>
                                </div>
                                <% } %>
                            </td>
                            <td>
                                <% 
                                    bool isFeatured = row["IsFeatured"] != DBNull.Value && Convert.ToBoolean(row["IsFeatured"]);
                                %>
                                <span class="status-badge <%= isFeatured ? "badge-featured" : "badge-normal" %>">
                                    <i class="fas fa-<%= isFeatured ? "star" : "star-o" %>"></i>
                                    <%= isFeatured ? "Nổi bật" : "Bình thường" %>
                                </span>
                            </td>
                            <td>
                                <% 
                                    bool isPublished = row["IsPublished"] != DBNull.Value && Convert.ToBoolean(row["IsPublished"]);
                                %>
                                <span class="status-badge <%= isPublished ? "badge-published" : "badge-draft" %>">
                                    <i class="fas fa-<%= isPublished ? "eye" : "eye-slash" %>"></i>
                                    <%= isPublished ? "Đã xuất bản" : "Bản nháp" %>
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <% 
                                        bool isDeleted = row["IsDeleted"] != DBNull.Value && Convert.ToBoolean(row["IsDeleted"]);
                                        string activityId = row["ActivityID"] != DBNull.Value ? row["ActivityID"].ToString() : "0";
                                    %>
                                    <% if (!isDeleted) { %>
                                    <button class="btn-action btn-edit" data-action="edit" data-id="<%= activityId %>">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-action btn-delete" data-action="delete" data-id="<%= activityId %>">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                    <% } else { %>
                                    <button class="btn-action btn-restore" data-action="restore" data-id="<%= activityId %>">
                                        <i class="fas fa-undo"></i>
                                    </button>
                                    <% } %>
                                </div>
                            </td>
                        </tr>
                        <% } %>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <% if (totalPages > 1) { 
                string baseUrl = "?search=" + Server.UrlEncode(searchTerm) + 
                               "&filter=" + Server.UrlEncode(filterType) + 
                               "&published=" + Server.UrlEncode(publishedFilter) + 
                               "&deleted=" + Server.UrlEncode(showDeleted) + 
                               "&dateFrom=" + Server.UrlEncode(dateFrom) + 
                               "&dateTo=" + Server.UrlEncode(dateTo) + 
                               "&location=" + Server.UrlEncode(locationFilter) + 
                               "&featured=" + Server.UrlEncode(featuredFilter) + 
                               "&sortBy=" + Server.UrlEncode(sortBy) + 
                               "&sortOrder=" + Server.UrlEncode(sortOrder);
            %>
            <div class="pagination">
                <% if (currentPage > 1) { %>
                <a href="<%= baseUrl %>&page=<%= currentPage - 1 %>" class="page-btn">« Trước</a>
                <% } %>
                
                <% for (int i = Math.Max(1, currentPage - 2); i <= Math.Min(totalPages, currentPage + 2); i++) { %>
                <a href="<%= baseUrl %>&page=<%= i %>" class="page-btn <%= i == currentPage ? "active" : "" %>"><%= i %></a>
                <% } %>
                
                <% if (currentPage < totalPages) { %>
                <a href="<%= baseUrl %>&page=<%= currentPage + 1 %>" class="page-btn">Sau »</a>
                <% } %>
            </div>
            <% } %>
        </div>
    </div>

    <!-- Modal for Create/Edit Activity -->
    <div id="activityModal" class="modal">
        <div class="modal-content modern-modal">
            <div class="modal-header">
                <div class="modal-title-section">
                    <div class="modal-icon">
                        <i class="fas fa-calendar-plus" id="modalIcon"></i>
                    </div>
                    <div class="modal-title-text">
                        <h3 id="modalTitle">Thêm hoạt động mới</h3>
                        <p class="modal-subtitle">Điền thông tin chi tiết cho hoạt động</p>
                    </div>
                </div>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="activityForm" method="post" class="modern-form" enctype="multipart/form-data">
                <input type="hidden" name="action" id="formAction" value="create">
                <input type="hidden" name="id" id="activityId">
                
                <!-- Basic Information Card -->
                <div class="form-card">
                    <div class="card-header">
                        <i class="fas fa-info-circle"></i>
                        <h4>Thông tin cơ bản</h4>
                    </div>
                    <div class="card-content">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-heading"></i>
                                Tiêu đề hoạt động
                                <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <input type="text" name="title" id="title" class="form-control" maxlength="100" required 
                                       placeholder="Nhập tiêu đề hoạt động...">
                                <span class="char-counter" id="titleCounter">0/100</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-align-left"></i>
                                Mô tả chi tiết
                            </label>
                            <div class="input-wrapper">
                                <textarea name="description" id="description" rows="4" class="form-control" maxlength="1000"
                                          placeholder="Mô tả chi tiết về hoạt động..."></textarea>
                                <span class="char-counter" id="descriptionCounter">0/1000</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Schedule & Type Card -->
                <div class="form-card">
                    <div class="card-header">
                        <i class="fas fa-calendar-alt"></i>
                        <h4>Lịch trình & Phân loại</h4>
                    </div>
                    <div class="card-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-tag"></i>
                                    Loại hoạt động
                                    <span class="required">*</span>
                                </label>
                                <select name="activityType" id="activityType" class="form-control" required>
                                    <option value="">-- Chọn loại hoạt động --</option>
                                    <option value="event">🎉 Sự kiện</option>
                                    <option value="training">📚 Đào tạo</option>
                                    <option value="meeting">👥 Cuộc họp</option>
                                    <option value="notification">📢 Thông báo</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-clock"></i>
                                    Thời gian diễn ra
                                    <span class="required">*</span>
                                </label>
                                <input type="datetime-local" name="activityDate" id="activityDate" class="form-control" required>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Location & Participants Card -->
                <div class="form-card">
                    <div class="card-header">
                        <i class="fas fa-map-marker-alt"></i>
                        <h4>Địa điểm & Người tham gia</h4>
                    </div>
                    <div class="card-content">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-location-dot"></i>
                                Địa điểm tổ chức
                            </label>
                            <div class="input-wrapper">
                                <input type="text" name="location" id="location" class="form-control" maxlength="100"
                                       placeholder="Nhập địa điểm tổ chức...">
                                <span class="char-counter" id="locationCounter">0/100</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-users"></i>
                                Thông tin người tham gia
                            </label>
                            <div class="input-wrapper">
                                <textarea name="participants" id="participants" rows="3" class="form-control" maxlength="200" 
                                          placeholder="Danh sách người tham gia hoặc số lượng dự kiến..."></textarea>
                                <span class="char-counter" id="participantsCounter">0/200</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Image Upload Card -->
                <div class="form-card">
                    <div class="card-header">
                        <i class="fas fa-image"></i>
                        <h4>Hình ảnh hoạt động</h4>
                    </div>
                    <div class="card-content">
                        <div class="image-upload-section">
                            <div class="upload-tabs">
                                <button type="button" class="upload-tab active" data-tab="url">
                                    <i class="fas fa-link"></i> URL
                                </button>
                                <button type="button" class="upload-tab" data-tab="file">
                                    <i class="fas fa-upload"></i> Upload File
                                </button>
                            </div>
                            
                            <div class="upload-content">
                                <div class="upload-panel active" id="urlPanel">
                                    <div class="input-wrapper">
                                        <input type="url" name="imageUrl" id="imageUrl" class="form-control" 
                                               placeholder="https://example.com/image.jpg">
                                        <i class="fas fa-globe input-icon"></i>
                                    </div>
                                    <small class="form-help">Nhập URL hình ảnh từ internet</small>
                                </div>
                                
                                <div class="upload-panel" id="filePanel">
                                    <div class="file-drop-zone" id="fileDropZone">
                                        <div class="drop-zone-content">
                                            <i class="fas fa-cloud-upload-alt drop-icon"></i>
                                            <p class="drop-text">Kéo thả file vào đây hoặc <span class="file-browse">chọn file</span></p>
                                            <input type="file" id="imageFile" name="imageFile" accept="image/*" style="display: none;">
                                            <small class="drop-help">Hỗ trợ: JPG, PNG, GIF, WebP (Max: 5MB)</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="image-preview" id="imagePreview" style="display: none;">
                                <div class="preview-container">
                                    <img id="previewImg" src="" alt="Preview">
                                    <button type="button" class="btn-remove-image" onclick="removeImagePreview()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div class="image-info" id="imageInfo"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Document Upload Card -->
                <div class="form-card">
                    <div class="card-header">
                        <i class="fas fa-file-alt"></i>
                        <h4>Tài liệu hoạt động</h4>
                    </div>
                    <div class="card-content">
                        <div class="document-upload-section">
                            <div class="upload-tabs">
                                <button type="button" class="upload-tab active" data-tab="doc-url">
                                    <i class="fas fa-link"></i> URL
                                </button>
                                <button type="button" class="upload-tab" data-tab="doc-file">
                                    <i class="fas fa-upload"></i> Upload File
                                </button>
                            </div>
                            
                            <div class="upload-content">
                                <div class="upload-panel active" id="docUrlPanel">
                                    <div class="input-wrapper">
                                        <input type="url" name="documentUrl" id="documentUrl" class="form-control" 
                                               placeholder="https://example.com/document.pdf">
                                        <i class="fas fa-globe input-icon"></i>
                                    </div>
                                    <small class="form-help">Nhập URL tài liệu từ internet (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)</small>
                                </div>
                                
                                <div class="upload-panel" id="docFilePanel">
                                    <div class="file-drop-zone" id="docFileDropZone">
                                        <div class="drop-zone-content">
                                            <i class="fas fa-cloud-upload-alt drop-icon"></i>
                                            <p class="drop-text">Kéo thả file vào đây hoặc <span class="file-browse">chọn file</span></p>
                                            <input type="file" id="documentFile" name="documentFile" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" style="display: none;">
                                            <small class="drop-help">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max: 10MB)</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="document-preview" id="documentPreview" style="display: none;">
                                <div class="preview-container">
                                    <div class="document-info">
                                        <i class="fas fa-file-alt document-icon"></i>
                                        <div class="document-details">
                                            <span class="document-name" id="documentName"></span>
                                            <span class="document-size" id="documentSize"></span>
                                        </div>
                                    </div>
                                    <button type="button" class="btn-remove-document" onclick="removeDocumentPreview()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Settings Card -->
                <div class="form-card">
                    <div class="card-header">
                        <i class="fas fa-cog"></i>
                        <h4>Cài đặt hoạt động</h4>
                    </div>
                    <div class="card-content">
                        <div class="settings-grid">
                            <div class="setting-item">
                                <label class="toggle-switch">
                                    <input type="checkbox" name="isPublished" id="isPublished">
                                    <span class="toggle-slider"></span>
                                </label>
                                <div class="setting-info">
                                    <h5>Xuất bản ngay</h5>
                                    <p>Hoạt động sẽ hiển thị công khai</p>
                                </div>
                            </div>
                            
                            <div class="setting-item">
                                <label class="toggle-switch">
                                    <input type="checkbox" name="isFeatured" id="isFeatured">
                                    <span class="toggle-slider featured"></span>
                                </label>
                                <div class="setting-info">
                                    <h5>Đánh dấu nổi bật</h5>
                                    <p>Hiển thị ưu tiên trong danh sách</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Form Actions -->
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                        Hủy bỏ
                    </button>
                    <button type="submit" class="btn btn-primary" id="submitBtn">
                        <i class="fas fa-save"></i>
                        <span id="submitText">Lưu hoạt động</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- JavaScript -->
    <script src="js/admin-hoat-dong.js"></script>
</body>
</html>
