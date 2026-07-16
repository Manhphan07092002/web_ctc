using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Cubetech.Website.Models;

namespace Cubetech.Website.AppCode
{
    // Simple ProjectCategory class for admin functionality
    public class ProjectCategory
    {
        public int CategoryID { get; set; }
        public string CategoryCode { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class AdminProjectController : Controller
    {
        private readonly string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        // Security check
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!IsAdminUser())
            {
                filterContext.Result = new RedirectResult("/Login");
                return;
            }
            base.OnActionExecuting(filterContext);
        }

        private bool IsAdminUser()
        {
            try
            {
                // Use SecurityHelper to check admin status
                return Cubetech.Website.Common.SecurityHelper.IsCurrentUserAdmin();
            }
            catch
            {
                return false;
            }
        }

        // GET: Index - List projects
        public ActionResult Index(string category = "", string status = "", string search = "", int page = 1, int pageSize = 10)
        {
            var projects = new List<Project>();
            var totalCount = 0;

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Build query with filters - same logic as test page
                    var whereClause = "WHERE IsDeleted = 0";
                    var parameters = new List<SqlParameter>();

                    // Category filtering - exact match like test page
                    if (!string.IsNullOrEmpty(category))
                    {
                        whereClause += " AND Category = @Category";
                        parameters.Add(new SqlParameter("@Category", category));
                    }

                    // Status filtering
                    if (!string.IsNullOrEmpty(status))
                    {
                        whereClause += " AND Status = @Status";
                        parameters.Add(new SqlParameter("@Status", status));
                    }

                    // Search filtering
                    if (!string.IsNullOrEmpty(search))
                    {
                        whereClause += " AND (Title LIKE @Search OR Description LIKE @Search OR Location LIKE @Search)";
                        parameters.Add(new SqlParameter("@Search", "%" + search + "%"));
                    }

                // Get total count - use alias for consistency
                var countQueryWhere = whereClause.Replace("WHERE IsDeleted = 0", "WHERE p.IsDeleted = 0")
                                                 .Replace("AND Category", "AND p.Category")
                                                 .Replace("AND Status", "AND p.Status")
                                                 .Replace("AND (Title", "AND (p.Title")
                                                 .Replace("OR Description", "OR p.Description")
                                                 .Replace("OR Location", "OR p.Location");
                var countQuery = "SELECT COUNT(*) FROM Projects p " + countQueryWhere;
                using (var countCmd = new SqlCommand(countQuery, connection))
                {
                    // Create new parameters for count command
                    foreach (var param in parameters)
                    {
                        countCmd.Parameters.Add(new SqlParameter(param.ParameterName, param.Value));
                    }
                    totalCount = (int)countCmd.ExecuteScalar();
                }

                // Get projects with pagination and category names
                var offset = (page - 1) * pageSize;
                var mainQueryWhere = whereClause.Replace("WHERE IsDeleted = 0", "WHERE p.IsDeleted = 0")
                                                .Replace("AND Category", "AND p.Category")
                                                .Replace("AND Status", "AND p.Status")
                                                .Replace("AND (Title", "AND (p.Title")
                                                .Replace("OR Description", "OR p.Description")
                                                .Replace("OR Location", "OR p.Location");
                var query = @"
                    SELECT p.*, pc.CategoryName 
                    FROM Projects p
                    LEFT JOIN ProjectCategories pc ON p.Category = pc.CategoryCode
                    " + mainQueryWhere + @"
                    ORDER BY p.CreatedDate DESC
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using (var cmd = new SqlCommand(query, connection))
                {
                    // Create new parameters for main query
                    foreach (var param in parameters)
                    {
                        cmd.Parameters.Add(new SqlParameter(param.ParameterName, param.Value));
                    }
                    cmd.Parameters.Add(new SqlParameter("@Offset", offset));
                    cmd.Parameters.Add(new SqlParameter("@PageSize", pageSize));

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            projects.Add(MapProjectFromReader(reader));
                        }
                    }
                }
                }
            }
            catch (Exception ex)
            {
                // Log error and return empty view with error message
                ViewBag.ErrorMessage = "Lỗi tải dữ liệu: " + ex.Message;
                ViewBag.DebugInfo = "Connection String: " + connectionString + " | Error: " + ex.ToString();
            }

            ViewBag.Projects = projects;
            ViewBag.TotalCount = totalCount;
            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = totalCount > 0 ? (int)Math.Ceiling((double)totalCount / pageSize) : 1;
            ViewBag.Category = category ?? "";
            ViewBag.Status = status ?? "";
            ViewBag.Search = search ?? "";

            // Add debug information - same as test page
            var debugInfo = new List<string>();
            debugInfo.Add("=== ADMIN PROJECTS FILTERING DEBUG ===");
            debugInfo.Add("Filter Parameters:");
            debugInfo.Add("- Category: '" + (category ?? "NULL") + "'");
            debugInfo.Add("- Status: '" + (status ?? "NULL") + "'");
            debugInfo.Add("- Search: '" + (search ?? "NULL") + "'");
            debugInfo.Add("- Page: " + page + ", PageSize: " + pageSize);
            debugInfo.Add("- Total Count: " + totalCount);
            debugInfo.Add("- Projects Loaded: " + projects.Count);
            
            // Build where clause info for debug
            var whereInfo = "WHERE IsDeleted = 0";
            if (!string.IsNullOrEmpty(category)) whereInfo += " AND Category = '" + category + "'";
            if (!string.IsNullOrEmpty(status)) whereInfo += " AND Status = '" + status + "'";
            if (!string.IsNullOrEmpty(search)) whereInfo += " AND (Title LIKE '%" + search + "%' OR ...)";
            debugInfo.Add("- Where Clause: " + whereInfo);

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Count projects in progress
                    var inProgressQuery = "SELECT COUNT(*) FROM Projects WHERE IsDeleted = 0 AND Status = 'in_progress'";
                    using (var cmd = new SqlCommand(inProgressQuery, connection))
                    {
                        ViewBag.StatsInProgress = (int)cmd.ExecuteScalar();
                    }

                    // Count completed projects
                    var completedQuery = "SELECT COUNT(*) FROM Projects WHERE IsDeleted = 0 AND Status = 'completed'";
                    using (var cmd = new SqlCommand(completedQuery, connection))
                    {
                        ViewBag.StatsCompleted = (int)cmd.ExecuteScalar();
                    }

                    // Calculate total value
                    var totalValueQuery = "SELECT ISNULL(SUM(ProjectValue), 0) FROM Projects WHERE IsDeleted = 0 AND ProjectValue IS NOT NULL";
                    using (var cmd = new SqlCommand(totalValueQuery, connection))
                    {
                        var totalValue = cmd.ExecuteScalar();
                        ViewBag.StatsTotalValue = totalValue != DBNull.Value ? Convert.ToDecimal(totalValue) / 1000000000 : 0; // Convert to billions
                    }

                    // Check category distribution for debugging
                    var categoryDistQuery = @"SELECT Category, COUNT(*) as Count 
                                            FROM Projects 
                                            WHERE IsDeleted = 0 
                                            GROUP BY Category 
                                            ORDER BY Count DESC";
                    using (var cmd = new SqlCommand(categoryDistQuery, connection))
                    using (var reader = cmd.ExecuteReader())
                    {
                        debugInfo.Add("Category Distribution:");
                        while (reader.Read())
                        {
                            var categoryValue = reader["Category"];
                            var cat = (categoryValue != null && categoryValue != DBNull.Value) ? categoryValue.ToString() : "NULL";
                            var count = reader["Count"].ToString();
                            debugInfo.Add("  - " + cat + ": " + count + " projects");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Set default values if stats calculation fails
                ViewBag.StatsInProgress = 0;
                ViewBag.StatsCompleted = 0;
                ViewBag.StatsTotalValue = 0;
                debugInfo.Add("Stats Error: " + ex.Message);
            }

            ViewBag.DebugInfo = string.Join("\n", debugInfo);

            // Load categories for dropdown - simplified approach
            ViewBag.Categories = null; // Will use hardcoded fallback in view

            return View(projects);
        }

        // GET: TestFilter - Test category filtering like test page
        public ActionResult TestFilter(string testCategory = "HTKT")
        {
            var results = new List<object>();
            var debugInfo = new List<string>();
            
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    
                    // Same query as test page
                    var sql = @"SELECT ProjectID, Title, Category, Status 
                               FROM Projects 
                               WHERE IsDeleted = 0 AND Category = @Category
                               ORDER BY CreatedDate DESC";
                    
                    using (var cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@Category", testCategory);
                        using (var reader = cmd.ExecuteReader())
                        {
                            int count = 0;
                            while (reader.Read())
                            {
                                count++;
                                results.Add(new {
                                    ProjectID = reader["ProjectID"],
                                    Title = reader["Title"],
                                    Category = reader["Category"],
                                    Status = reader["Status"]
                                });
                            }
                            debugInfo.Add("Total projects found: " + count);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                debugInfo.Add("Error: " + ex.Message);
            }
            
            ViewBag.TestCategory = testCategory;
            ViewBag.Results = results;
            ViewBag.DebugInfo = string.Join("\n", debugInfo);
            
            return View();
        }

        // GET: Test - Debug database connection
        public ActionResult Test()
        {
            var debugInfo = new List<string>();
            
            try
            {
                debugInfo.Add("Connection String: " + connectionString);
                
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    debugInfo.Add("✅ Database connection successful");
                    
                    // Check if Projects table exists
                    var checkTableQuery = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Projects'";
                    using (var cmd = new SqlCommand(checkTableQuery, connection))
                    {
                        var tableExists = (int)cmd.ExecuteScalar();
                        debugInfo.Add("Projects table exists: " + (tableExists > 0 ? "✅ YES" : "❌ NO"));
                        
                        if (tableExists > 0)
                        {
                            // Check table structure
                            var columnsQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects'";
                            using (var colCmd = new SqlCommand(columnsQuery, connection))
                            using (var reader = colCmd.ExecuteReader())
                            {
                                var columns = new List<string>();
                                while (reader.Read())
                                {
                                    columns.Add(reader.GetString(0));
                                }
                                debugInfo.Add("Table columns: " + string.Join(", ", columns));
                            }
                            
                            // Check record count
                            var countQuery = "SELECT COUNT(*) FROM Projects";
                            using (var countCmd = new SqlCommand(countQuery, connection))
                            {
                                var count = (int)countCmd.ExecuteScalar();
                                debugInfo.Add("Total records: " + count);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                debugInfo.Add("❌ Error: " + ex.Message);
                debugInfo.Add("Stack trace: " + ex.StackTrace);
            }
            
            return Content(string.Join("<br>", debugInfo));
        }

        // GET: Create
        public ActionResult Create()
        {
            ViewBag.Categories = GetProjectCategoriesList();
            return View();
        }

        // POST: Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Project project)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Handle multiple image uploads
                    var imageFiles = Request.Files.GetMultiple("imageFiles");
                    if (imageFiles != null && imageFiles.Count > 0)
                    {
                        if (imageFiles.Count > 5)
                        {
                            ModelState.AddModelError("", "Chỉ được upload tối đa 5 ảnh!");
                            ViewBag.Categories = GetProjectCategoriesList();
                            return View(project);
                        }
                        
                        var imagePaths = new List<string>();
                        foreach (var file in imageFiles)
                        {
                            if (file != null && file.ContentLength > 0)
                            {
                                var path = SaveUploadedFile(file, "images");
                                if (!string.IsNullOrEmpty(path))
                                {
                                    imagePaths.Add(path);
                                }
                            }
                        }
                        
                        if (imagePaths.Count > 0)
                        {
                            project.ImageUrl = string.Join(";", imagePaths);
                        }
                    }

                    // Handle multiple document uploads
                    var documentFiles = Request.Files.GetMultiple("documentFiles");
                    if (documentFiles != null && documentFiles.Count > 0)
                    {
                        if (documentFiles.Count > 3)
                        {
                            ModelState.AddModelError("", "Chỉ được upload tối đa 3 tài liệu!");
                            ViewBag.Categories = GetProjectCategoriesList();
                            return View(project);
                        }
                        
                        var documentPaths = new List<string>();
                        foreach (var file in documentFiles)
                        {
                            if (file != null && file.ContentLength > 0)
                            {
                                var path = SaveUploadedFile(file, "documents");
                                if (!string.IsNullOrEmpty(path))
                                {
                                    documentPaths.Add(path);
                                }
                            }
                        }
                        
                        if (documentPaths.Count > 0)
                        {
                            project.DocumentUrl = string.Join(";", documentPaths);
                        }
                    }

                    // Set audit fields
                    project.CreatedDate = DateTime.Now;
                    project.UpdatedDate = DateTime.Now;
                    project.CreatedBy = "Admin"; // Get from session
                    project.UpdatedBy = "Admin";

                    // Insert into database
                    using (var connection = new SqlConnection(connectionString))
                    {
                        connection.Open();
                        var query = @"
                            INSERT INTO Projects (Title, Description, Category, Location, Client, Contractor, 
                                ProjectValue, Currency, StartDate, EndDate, CompletionDate, Status, Progress,
                                ImageUrl, DocumentUrl, IsPublished, IsFeatured, Tags, 
                                CreatedDate, UpdatedDate, CreatedBy, UpdatedBy, IsDeleted)
                            VALUES (@Title, @Description, @Category, @Location, @Client, @Contractor,
                                @ProjectValue, @Currency, @StartDate, @EndDate, @CompletionDate, @Status, @Progress,
                                @ImageUrl, @DocumentUrl, @IsPublished, @IsFeatured, @Tags,
                                @CreatedDate, @UpdatedDate, @CreatedBy, @UpdatedBy, 0)";

                        using (var cmd = new SqlCommand(query, connection))
                        {
                            AddProjectParameters(cmd, project);
                            cmd.ExecuteNonQuery();
                        }
                    }

                    TempData["Success"] = "✅ Dự án mới đã được tạo thành công! Bạn có thể tiếp tục chỉnh sửa hoặc tạo dự án khác.";
                    return RedirectToAction("Index");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi tạo dự án: " + ex.Message);
                }
            }

            ViewBag.Categories = GetProjectCategoriesList();
            return View(project);
        }

        // GET: Edit
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                TempData["Error"] = "ID dự án không hợp lệ!";
                return RedirectToAction("Index");
            }

            var project = GetProjectById(id.Value);
            if (project == null)
            {
                TempData["Error"] = "Không tìm thấy dự án!";
                return RedirectToAction("Index");
            }

            ViewBag.Categories = GetProjectCategoriesList();
            return View(project);
        }

        // POST: Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Project project)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var existingProject = GetProjectById(project.ProjectID);
                    if (existingProject == null)
                    {
                        return HttpNotFound();
                    }

                    // Handle multiple image uploads
                    var imageFiles = Request.Files.GetMultiple("imageFiles");
                    if (imageFiles != null && imageFiles.Count > 0)
                    {
                        if (imageFiles.Count > 5)
                        {
                            ModelState.AddModelError("", "Chỉ được upload tối đa 5 ảnh!");
                            ViewBag.Categories = GetProjectCategoriesList();
                            return View(project);
                        }
                        
                        var imagePaths = new List<string>();
                        foreach (var file in imageFiles)
                        {
                            if (file != null && file.ContentLength > 0)
                            {
                                var path = SaveUploadedFile(file, "images");
                                if (!string.IsNullOrEmpty(path))
                                {
                                    imagePaths.Add(path);
                                }
                            }
                        }
                        
                        if (imagePaths.Count > 0)
                        {
                            project.ImageUrl = string.Join(";", imagePaths);
                        }
                        else
                        {
                            project.ImageUrl = existingProject.ImageUrl;
                        }
                    }
                    else
                    {
                        project.ImageUrl = existingProject.ImageUrl;
                    }

                    // Handle multiple document uploads
                    var documentFiles = Request.Files.GetMultiple("documentFiles");
                    if (documentFiles != null && documentFiles.Count > 0)
                    {
                        if (documentFiles.Count > 3)
                        {
                            ModelState.AddModelError("", "Chỉ được upload tối đa 3 tài liệu!");
                            ViewBag.Categories = GetProjectCategoriesList();
                            return View(project);
                        }
                        
                        var documentPaths = new List<string>();
                        foreach (var file in documentFiles)
                        {
                            if (file != null && file.ContentLength > 0)
                            {
                                var path = SaveUploadedFile(file, "documents");
                                if (!string.IsNullOrEmpty(path))
                                {
                                    documentPaths.Add(path);
                                }
                            }
                        }
                        
                        if (documentPaths.Count > 0)
                        {
                            project.DocumentUrl = string.Join(";", documentPaths);
                        }
                        else
                        {
                            project.DocumentUrl = existingProject.DocumentUrl;
                        }
                    }
                    else
                    {
                        project.DocumentUrl = existingProject.DocumentUrl;
                    }

                    // Set audit fields
                    project.CreatedDate = existingProject.CreatedDate;
                    project.CreatedBy = existingProject.CreatedBy;
                    project.UpdatedDate = DateTime.Now;
                    project.UpdatedBy = "Admin";

                    // Update database
                    using (var connection = new SqlConnection(connectionString))
                    {
                        connection.Open();
                        var query = @"
                            UPDATE Projects SET 
                                Title = @Title, Description = @Description, Category = @Category, 
                                Location = @Location, Client = @Client, Contractor = @Contractor,
                                ProjectValue = @ProjectValue, Currency = @Currency, 
                                StartDate = @StartDate, EndDate = @EndDate, CompletionDate = @CompletionDate,
                                Status = @Status, Progress = @Progress, ImageUrl = @ImageUrl, DocumentUrl = @DocumentUrl,
                                IsPublished = @IsPublished, IsFeatured = @IsFeatured, Tags = @Tags,
                                UpdatedDate = @UpdatedDate, UpdatedBy = @UpdatedBy
                            WHERE ProjectID = @ProjectID";

                        using (var cmd = new SqlCommand(query, connection))
                        {
                            AddProjectParameters(cmd, project);
                            cmd.Parameters.Add(new SqlParameter("@ProjectID", project.ProjectID));
                            cmd.ExecuteNonQuery();
                        }
                    }

                    TempData["Success"] = "💾 Dự án đã được cập nhật thành công! Tất cả thay đổi đã được lưu.";
                    return RedirectToAction("Index");
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi cập nhật dự án: " + ex.Message);
                }
            }

            ViewBag.Categories = GetProjectCategoriesList();
            return View(project);
        }


        // POST: Toggle Publish
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult TogglePublish(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = @"
                        UPDATE Projects SET 
                            IsPublished = CASE WHEN IsPublished = 1 THEN 0 ELSE 1 END,
                            UpdatedDate = @UpdatedDate,
                            UpdatedBy = @UpdatedBy
                        WHERE ProjectID = @ProjectID";

                    using (var cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.Add(new SqlParameter("@ProjectID", id));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedBy", "Admin"));
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { success = true, message = "Trạng thái xuất bản đã được cập nhật!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // POST: Toggle Featured
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult ToggleFeatured(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = @"
                        UPDATE Projects SET 
                            IsFeatured = CASE WHEN IsFeatured = 1 THEN 0 ELSE 1 END,
                            UpdatedDate = @UpdatedDate,
                            UpdatedBy = @UpdatedBy
                        WHERE ProjectID = @ProjectID";

                    using (var cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.Add(new SqlParameter("@ProjectID", id));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedBy", "Admin"));
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { success = true, message = "Trạng thái nổi bật đã được cập nhật!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // GET: ManageCategories
        public ActionResult ManageCategories()
        {
            return View();
        }

        // API: Get Project Categories
        public ActionResult GetProjectCategories()
        {
            var categories = GetProjectCategoriesList();
            return Json(categories, JsonRequestBehavior.AllowGet);
        }

        // POST: Delete Project (Soft Delete)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = @"
                        UPDATE Projects SET 
                            IsDeleted = 1,
                            UpdatedDate = @UpdatedDate,
                            UpdatedBy = @UpdatedBy
                        WHERE ProjectID = @ProjectID";

                    using (var cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.Add(new SqlParameter("@ProjectID", id));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedBy", "Admin"));
                        
                        int rowsAffected = cmd.ExecuteNonQuery();
                        
                        if (rowsAffected > 0)
                        {
                            TempData["Success"] = "🗑️ Dự án đã được xóa thành công! Dự án đã được chuyển vào thùng rác và có thể khôi phục sau này.";
                        }
                        else
                        {
                            TempData["Error"] = "❌ Không tìm thấy dự án để xóa! Vui lòng kiểm tra lại ID dự án.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "⚠️ Có lỗi xảy ra khi xóa dự án! " + ex.Message + " Vui lòng thử lại hoặc liên hệ quản trị viên.";
            }

            return RedirectToAction("Index");
        }

        // GET: DeleteConfirm - Direct delete without confirmation page
        public ActionResult DeleteConfirm(int? id)
        {
            if (id == null)
            {
                TempData["Error"] = "❌ ID dự án không hợp lệ!";
                return RedirectToAction("Index");
            }

            // Direct delete without confirmation page
            return Delete(id.Value);
        }

        // API: Get Project Category by ID
        public ActionResult GetProjectCategory(int id)
        {
            try
            {
                var category = GetProjectCategoryById(id);
                if (category != null)
                {
                    return Json(new { success = true, data = category }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { success = false, message = "Không tìm thấy danh mục" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // API: Create Project Category
        public ActionResult CreateProjectCategory(string categoryCode, string categoryName, string description, int displayOrder, bool isActive)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = @"
                        INSERT INTO ProjectCategories (CategoryCode, CategoryName, Description, DisplayOrder, IsActive, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy)
                        VALUES (@CategoryCode, @CategoryName, @Description, @DisplayOrder, @IsActive, @CreatedDate, @UpdatedDate, @CreatedBy, @UpdatedBy)";
                    
                    using (var cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.Add(new SqlParameter("@CategoryCode", categoryCode));
                        cmd.Parameters.Add(new SqlParameter("@CategoryName", categoryName));
                        cmd.Parameters.Add(new SqlParameter("@Description", description ?? ""));
                        cmd.Parameters.Add(new SqlParameter("@DisplayOrder", displayOrder));
                        cmd.Parameters.Add(new SqlParameter("@IsActive", isActive));
                        cmd.Parameters.Add(new SqlParameter("@CreatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@CreatedBy", "Admin"));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedBy", "Admin"));
                        
                        cmd.ExecuteNonQuery();
                    }
                }
                
                return Json(new { success = true, message = "Tạo danh mục thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // API: Update Project Category
        public ActionResult UpdateProjectCategory(int id, string categoryCode, string categoryName, string description, int displayOrder, bool isActive)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = @"
                        UPDATE ProjectCategories SET 
                            CategoryCode = @CategoryCode, CategoryName = @CategoryName, Description = @Description,
                            DisplayOrder = @DisplayOrder, IsActive = @IsActive, UpdatedDate = @UpdatedDate, UpdatedBy = @UpdatedBy
                        WHERE CategoryID = @CategoryID";
                    
                    using (var cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.Add(new SqlParameter("@CategoryID", id));
                        cmd.Parameters.Add(new SqlParameter("@CategoryCode", categoryCode));
                        cmd.Parameters.Add(new SqlParameter("@CategoryName", categoryName));
                        cmd.Parameters.Add(new SqlParameter("@Description", description ?? ""));
                        cmd.Parameters.Add(new SqlParameter("@DisplayOrder", displayOrder));
                        cmd.Parameters.Add(new SqlParameter("@IsActive", isActive));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedBy", "Admin"));
                        
                        var rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            return Json(new { success = true, message = "Cập nhật danh mục thành công" });
                        }
                        else
                        {
                            return Json(new { success = false, message = "Không tìm thấy danh mục để cập nhật" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // API: Delete Project Category
        public ActionResult DeleteProjectCategory(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = "DELETE FROM ProjectCategories WHERE CategoryID = @CategoryID";
                    
                    using (var cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.Add(new SqlParameter("@CategoryID", id));
                        var rowsAffected = cmd.ExecuteNonQuery();
                        
                        if (rowsAffected > 0)
                        {
                            return Json(new { success = true, message = "Xóa danh mục thành công" });
                        }
                        else
                        {
                            return Json(new { success = false, message = "Không tìm thấy danh mục để xóa" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // Helper methods
        private Project GetProjectById(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM Projects WHERE ProjectID = @ProjectID AND IsDeleted = 0";
                
                using (var cmd = new SqlCommand(query, connection))
                {
                    cmd.Parameters.Add(new SqlParameter("@ProjectID", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return MapProjectFromReader(reader);
                        }
                    }
                }
            }
            return null;
        }

        private Project MapProjectFromReader(SqlDataReader reader)
        {
            return new Project
            {
                ProjectID = Convert.ToInt32(reader["ProjectID"]),
                Title = reader["Title"].ToString(),
                Description = reader["Description"].ToString(),
                Category = reader["Category"].ToString(),
                // CategoryNameFromDB will be set separately if needed
                Location = reader["Location"].ToString(),
                Client = reader["Client"].ToString(),
                Contractor = reader["Contractor"].ToString(),
                ProjectValue = reader["ProjectValue"] != DBNull.Value ? Convert.ToDecimal(reader["ProjectValue"]) : (decimal?)null,
                Currency = reader["Currency"].ToString(),
                StartDate = reader["StartDate"] != DBNull.Value ? Convert.ToDateTime(reader["StartDate"]) : (DateTime?)null,
                EndDate = reader["EndDate"] != DBNull.Value ? Convert.ToDateTime(reader["EndDate"]) : (DateTime?)null,
                CompletionDate = reader["CompletionDate"] != DBNull.Value ? Convert.ToDateTime(reader["CompletionDate"]) : (DateTime?)null,
                Status = reader["Status"].ToString(),
                Progress = Convert.ToInt32(reader["Progress"]),
                ImageUrl = reader["ImageUrl"].ToString(),
                DocumentUrl = reader["DocumentUrl"].ToString(),
                IsPublished = Convert.ToBoolean(reader["IsPublished"]),
                IsFeatured = Convert.ToBoolean(reader["IsFeatured"]),
                ViewCount = Convert.ToInt32(reader["ViewCount"]),
                LikeCount = Convert.ToInt32(reader["LikeCount"]),
                Tags = reader["Tags"].ToString(),
                CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                UpdatedDate = Convert.ToDateTime(reader["UpdatedDate"]),
                CreatedBy = reader["CreatedBy"].ToString(),
                UpdatedBy = reader["UpdatedBy"].ToString(),
                IsDeleted = Convert.ToBoolean(reader["IsDeleted"])
            };
        }

        private void AddProjectParameters(SqlCommand cmd, Project project)
        {
            cmd.Parameters.Add(new SqlParameter("@Title", project.Title ?? ""));
            cmd.Parameters.Add(new SqlParameter("@Description", project.Description ?? ""));
            cmd.Parameters.Add(new SqlParameter("@Category", project.Category ?? ""));
            cmd.Parameters.Add(new SqlParameter("@Location", project.Location ?? ""));
            cmd.Parameters.Add(new SqlParameter("@Client", project.Client ?? ""));
            cmd.Parameters.Add(new SqlParameter("@Contractor", project.Contractor ?? ""));
            cmd.Parameters.Add(new SqlParameter("@ProjectValue", (object)project.ProjectValue ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Currency", project.Currency ?? "VND"));
            cmd.Parameters.Add(new SqlParameter("@StartDate", (object)project.StartDate ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EndDate", (object)project.EndDate ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@CompletionDate", (object)project.CompletionDate ?? DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Status", project.Status ?? ""));
            cmd.Parameters.Add(new SqlParameter("@Progress", project.Progress));
            cmd.Parameters.Add(new SqlParameter("@ImageUrl", project.ImageUrl ?? ""));
            cmd.Parameters.Add(new SqlParameter("@DocumentUrl", project.DocumentUrl ?? ""));
            cmd.Parameters.Add(new SqlParameter("@IsPublished", project.IsPublished));
            cmd.Parameters.Add(new SqlParameter("@IsFeatured", project.IsFeatured));
            cmd.Parameters.Add(new SqlParameter("@Tags", project.Tags ?? ""));
            cmd.Parameters.Add(new SqlParameter("@CreatedDate", project.CreatedDate));
            cmd.Parameters.Add(new SqlParameter("@UpdatedDate", project.UpdatedDate));
            cmd.Parameters.Add(new SqlParameter("@CreatedBy", project.CreatedBy ?? ""));
            cmd.Parameters.Add(new SqlParameter("@UpdatedBy", project.UpdatedBy ?? ""));
        }

        private List<ProjectCategory> GetProjectCategoriesList()
        {
            var categories = new List<ProjectCategory>();
            
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var query = "SELECT CategoryID, CategoryCode, CategoryName, Description, DisplayOrder, IsActive, CreatedDate, UpdatedDate FROM ProjectCategories WHERE IsActive = 1 ORDER BY CategoryName";
                    
                    using (var cmd = new SqlCommand(query, connection))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            categories.Add(new ProjectCategory
                            {
                                CategoryID = Convert.ToInt32(reader["CategoryID"]),
                                CategoryCode = reader["CategoryCode"].ToString(),
                                CategoryName = reader["CategoryName"].ToString(),
                                Description = reader["Description"].ToString(),
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"]),
                                IsActive = Convert.ToBoolean(reader["IsActive"]),
                                CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                                UpdatedDate = Convert.ToDateTime(reader["UpdatedDate"])
                            });
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Fallback to hardcoded categories if database fails
                categories.Add(new ProjectCategory { CategoryCode = "infrastructure", CategoryName = "Hạ tầng Kỹ thuật", IsActive = true });
                categories.Add(new ProjectCategory { CategoryCode = "construction", CategoryName = "Xây dựng Dân dụng", IsActive = true });
                categories.Add(new ProjectCategory { CategoryCode = "industrial", CategoryName = "Công nghiệp", IsActive = true });
                categories.Add(new ProjectCategory { CategoryCode = "environment", CategoryName = "Môi trường", IsActive = true });
                categories.Add(new ProjectCategory { CategoryCode = "energy", CategoryName = "Năng lượng", IsActive = true });
            }
            
            return categories;
        }

        private ProjectCategory GetProjectCategoryById(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var query = "SELECT * FROM ProjectCategories WHERE CategoryID = @CategoryID";
                
                using (var cmd = new SqlCommand(query, connection))
                {
                    cmd.Parameters.Add(new SqlParameter("@CategoryID", id));
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new ProjectCategory
                            {
                                CategoryID = Convert.ToInt32(reader["CategoryID"]),
                                CategoryCode = reader["CategoryCode"].ToString(),
                                CategoryName = reader["CategoryName"].ToString(),
                                Description = reader["Description"].ToString(),
                                DisplayOrder = Convert.ToInt32(reader["DisplayOrder"]),
                                IsActive = Convert.ToBoolean(reader["IsActive"]),
                                CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                                UpdatedDate = Convert.ToDateTime(reader["UpdatedDate"])
                            };
                        }
                    }
                }
            }
            return null;
        }

        private string SaveUploadedFile(HttpPostedFileBase file, string folder)
        {
            try
            {
                if (file == null || file.ContentLength == 0)
                    return null;

                // Validate file size
                int maxSize = folder == "images" ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for images, 10MB for documents
                if (file.ContentLength > maxSize)
                {
                    throw new Exception(string.Format("File quá lớn. Kích thước tối đa: {0}MB", maxSize / 1024 / 1024));
                }

                // Validate file extension
                string extension = Path.GetExtension(file.FileName).ToLower();
                string[] allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg" };
                string[] allowedDocExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };
                
                if (folder == "images" && !Array.Exists(allowedImageExtensions, ext => ext == extension))
                {
                    throw new Exception("Định dạng hình ảnh không hợp lệ. Chỉ chấp nhận: " + string.Join(", ", allowedImageExtensions));
                }
                
                if (folder == "documents" && !Array.Exists(allowedDocExtensions, ext => ext == extension))
                {
                    throw new Exception("Định dạng tài liệu không hợp lệ. Chỉ chấp nhận: " + string.Join(", ", allowedDocExtensions));
                }

                // Create upload directory if not exists - đồng nhất với AdminActivity
                string uploadPath = Server.MapPath("~/Content/uploads/projects/" + folder);
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate unique filename - đồng nhất với AdminActivity
                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                string uniqueId = Guid.NewGuid().ToString("N").Substring(0, 8);
                string fileName = string.Format("{0}_{1}{2}", timestamp, uniqueId, extension);
                string filePath = Path.Combine(uploadPath, fileName);

                // Save file
                file.SaveAs(filePath);

                // Return relative URL - đồng nhất với AdminActivity
                return string.Format("/Content/uploads/projects/{0}/{1}", folder, fileName);
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi lưu file: " + ex.Message);
            }
        }
    }
}
