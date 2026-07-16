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
    // Extension method for getting multiple files
    public static class HttpFileCollectionExtensions
    {
        public static List<HttpPostedFileBase> GetMultiple(this HttpFileCollectionBase files, string name)
        {
            var result = new List<HttpPostedFileBase>();
            
            // Get all files with the specified name
            for (int i = 0; i < files.Count; i++)
            {
                var key = files.AllKeys[i];
                if (key == name)
                {
                    var file = files[i];
                    if (file != null && file.ContentLength > 0)
                    {
                        // files[i] returns HttpPostedFileBase directly from HttpFileCollectionBase
                        result.Add(file);
                    }
                }
            }
            
            return result;
        }
    }
    
    // Admin Activity Controller - Updated for file upload with Security
    public class AdminActivityController : Controller
    {
        private readonly string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        // Security: Check admin access before each action
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!IsAdminUser())
            {
                // Redirect to login or show unauthorized
                filterContext.Result = new RedirectResult("/Login");
                return;
            }
            base.OnActionExecuting(filterContext);
        }

        // Security: Check if current user is admin
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

        // GET: AdminActivity
        public ActionResult Index(int page = 1, int pageSize = 10, string search = "", string type = "", string status = "")
        {
            try
            {
                var activities = GetActivitiesPaged(page, pageSize, search, type, status);
                var totalCount = GetActivitiesCount(search, type, status);
                var stats = GetActivityStatistics();
                
                ViewBag.CurrentPage = page;
                ViewBag.PageSize = pageSize;
                ViewBag.TotalCount = totalCount;
                ViewBag.TotalPages = totalCount > 0 ? (int)Math.Ceiling((double)totalCount / pageSize) : 1;
                ViewBag.Search = search ?? "";
                ViewBag.Type = type ?? "";
                ViewBag.Status = status ?? "";
                
                // Pass statistics as separate ViewBag items for easier access
                ViewBag.StatsTotal = stats != null ? ((dynamic)stats).Total : 0;
                ViewBag.StatsPublished = stats != null ? ((dynamic)stats).Published : 0;
                ViewBag.StatsFeatured = stats != null ? ((dynamic)stats).Featured : 0;
                ViewBag.StatsTotalViews = stats != null ? ((dynamic)stats).TotalViews : 0;
                
                return View(activities);
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Lỗi tải dữ liệu: " + ex.Message;
                ViewBag.StatsTotal = 0;
                ViewBag.StatsPublished = 0;
                ViewBag.StatsFeatured = 0;
                ViewBag.StatsTotalViews = 0;
                return View(new List<Activity>());
            }
        }

        // GET: AdminActivity/Create
        public ActionResult Create()
        {
            try
            {
                var model = new Activity();
                ViewBag.ActivityTypes = GetActivityTypesForDropdown();
                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Lỗi tải form: " + ex.Message;
                return View(new Activity());
            }
        }

        // POST: AdminActivity/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Activity model)
        {
            try
            {
                // Handle checkbox values - if not checked, they won't be in form data
                var form = Request.Form;
                model.IsPublished = form["IsPublished"] == "true";
                model.IsFeatured = form["IsFeatured"] == "true";
                
                // Handle multiple image uploads
                var imageFiles = Request.Files.GetMultiple("ImageFiles");
                if (imageFiles != null && imageFiles.Count > 0)
                {
                    var imagePaths = new List<string>();
                    foreach (HttpPostedFileBase file in imageFiles)
                    {
                        if (file != null && file.ContentLength > 0)
                        {
                            string path = SaveUploadedFile(file, "images");
                            if (!string.IsNullOrEmpty(path))
                            {
                                imagePaths.Add(path);
                            }
                        }
                    }
                    
                    // Store multiple paths separated by semicolon
                    if (imagePaths.Count > 0)
                    {
                        model.ImageUrl = string.Join(";", imagePaths);
                    }
                }
                
                // Handle multiple document uploads
                var documentFiles = Request.Files.GetMultiple("DocumentFiles");
                if (documentFiles != null && documentFiles.Count > 0)
                {
                    var documentPaths = new List<string>();
                    foreach (HttpPostedFileBase file in documentFiles)
                    {
                        if (file != null && file.ContentLength > 0)
                        {
                            string path = SaveUploadedFile(file, "documents");
                            if (!string.IsNullOrEmpty(path))
                            {
                                documentPaths.Add(path);
                            }
                        }
                    }
                    
                    // Store multiple paths separated by semicolon
                    if (documentPaths.Count > 0)
                    {
                        model.DocumentUrl = string.Join(";", documentPaths);
                    }
                }
                
                if (ModelState.IsValid)
                {
                    CreateActivity(model);
                    TempData["SuccessMessage"] = "Tạo hoạt động thành công!";
                    return RedirectToAction("Index");
                }
                
                ViewBag.ActivityTypes = GetActivityTypesForDropdown();
                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Lỗi tạo hoạt động: " + ex.Message;
                ViewBag.ActivityTypes = GetActivityTypesForDropdown();
                return View(model);
            }
        }

        // GET: AdminActivity/Edit/5
        public ActionResult Edit(int id)
        {
            try
            {
                var activity = GetActivityById(id);
                if (activity == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy hoạt động!";
                    return RedirectToAction("Index");
                }
                
                ViewBag.ActivityTypes = GetActivityTypesForDropdown();
                return View(activity);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Lỗi tải hoạt động: " + ex.Message;
                return RedirectToAction("Index");
            }
        }

        // POST: AdminActivity/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Activity model)
        {
            try
            {
                // Handle checkbox values - if not checked, they won't be in form data
                var form = Request.Form;
                model.IsPublished = form["IsPublished"] == "true";
                model.IsFeatured = form["IsFeatured"] == "true";
                
                // Handle delete requests
                bool deleteImage = form["DeleteImage"] == "true";
                bool deleteDocument = form["DeleteDocument"] == "true";
                
                if (deleteImage)
                {
                    model.ImageUrl = null;
                }
                
                if (deleteDocument)
                {
                    model.DocumentUrl = null;
                }
                
                // Handle multiple image uploads
                var imageFiles = Request.Files.GetMultiple("ImageFiles");
                if (imageFiles != null && imageFiles.Count > 0)
                {
                    var imagePaths = new List<string>();
                    foreach (HttpPostedFileBase file in imageFiles)
                    {
                        if (file != null && file.ContentLength > 0)
                        {
                            string path = SaveUploadedFile(file, "images");
                            if (!string.IsNullOrEmpty(path))
                            {
                                imagePaths.Add(path);
                            }
                        }
                    }
                    
                    // Store multiple paths separated by semicolon
                    if (imagePaths.Count > 0)
                    {
                        model.ImageUrl = string.Join(";", imagePaths);
                    }
                }
                
                // Handle multiple document uploads
                var documentFiles = Request.Files.GetMultiple("DocumentFiles");
                if (documentFiles != null && documentFiles.Count > 0)
                {
                    var documentPaths = new List<string>();
                    foreach (HttpPostedFileBase file in documentFiles)
                    {
                        if (file != null && file.ContentLength > 0)
                        {
                            string path = SaveUploadedFile(file, "documents");
                            if (!string.IsNullOrEmpty(path))
                            {
                                documentPaths.Add(path);
                            }
                        }
                    }
                    
                    // Store multiple paths separated by semicolon
                    if (documentPaths.Count > 0)
                    {
                        model.DocumentUrl = string.Join(";", documentPaths);
                    }
                }
                
                if (ModelState.IsValid)
                {
                    UpdateActivity(model);
                    TempData["SuccessMessage"] = "Cập nhật hoạt động thành công!";
                    return RedirectToAction("Index");
                }
                
                ViewBag.ActivityTypes = GetActivityTypesForDropdown();
                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Lỗi cập nhật hoạt động: " + ex.Message;
                ViewBag.ActivityTypes = GetActivityTypesForDropdown();
                return View(model);
            }
        }

        // POST: AdminActivity/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            try
            {
                DeleteActivity(id);
                TempData["SuccessMessage"] = "Xóa hoạt động thành công!";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Lỗi xóa hoạt động: " + ex.Message;
            }
            
            return RedirectToAction("Index");
        }

        // Test action
        public ActionResult Test()
        {
            return Content("AdminActivity Controller is working! Time: " + DateTime.Now.ToString());
        }

        // GET: AdminActivity/ManageTypes
        public ActionResult ManageTypes()
        {
            return View();
        }

        // API: Get all activity types
        [HttpGet]
        public JsonResult GetActivityTypes()
        {
            var types = new List<object>();
            
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var sql = "SELECT TypeID, TypeCode, TypeName, Description, IsActive, DisplayOrder, CreatedDate FROM ActivityTypes ORDER BY DisplayOrder";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                types.Add(new
                                {
                                    TypeID = reader.GetInt32(0),
                                    TypeCode = reader.GetString(1),
                                    TypeName = reader.GetString(2),
                                    Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                                    IsActive = reader.GetBoolean(4),
                                    DisplayOrder = reader.GetInt32(5),
                                    CreatedDate = reader.GetDateTime(6)
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            
            return Json(types, JsonRequestBehavior.AllowGet);
        }

        // API: Get single activity type
        [HttpGet]
        public JsonResult GetActivityType(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var sql = "SELECT TypeID, TypeCode, TypeName, Description, IsActive, DisplayOrder FROM ActivityTypes WHERE TypeID = @id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var type = new
                                {
                                    TypeID = reader.GetInt32(0),
                                    TypeCode = reader.GetString(1),
                                    TypeName = reader.GetString(2),
                                    Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                                    IsActive = reader.GetBoolean(4),
                                    DisplayOrder = reader.GetInt32(5)
                                };
                                return Json(type, JsonRequestBehavior.AllowGet);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
            
            return Json(new { success = false, message = "Không tìm thấy" }, JsonRequestBehavior.AllowGet);
        }

        // API: Create activity type
        [HttpPost]
        public JsonResult CreateActivityType(string TypeCode, string TypeName, string Description, int DisplayOrder, bool IsActive)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var sql = @"INSERT INTO ActivityTypes (TypeCode, TypeName, Description, IsActive, DisplayOrder, CreatedDate)
                               VALUES (@code, @name, @desc, @active, @order, GETDATE())";
                    
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@code", TypeCode);
                        command.Parameters.AddWithValue("@name", TypeName);
                        command.Parameters.AddWithValue("@desc", (object)Description ?? DBNull.Value);
                        command.Parameters.AddWithValue("@active", IsActive);
                        command.Parameters.AddWithValue("@order", DisplayOrder);
                        
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
                
                return Json(new { success = true, message = "Thêm mới thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // API: Update activity type
        [HttpPost]
        public JsonResult UpdateActivityType(int TypeID, string TypeCode, string TypeName, string Description, int DisplayOrder, bool IsActive)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var sql = @"UPDATE ActivityTypes 
                               SET TypeCode = @code, TypeName = @name, Description = @desc, 
                                   IsActive = @active, DisplayOrder = @order
                               WHERE TypeID = @id";
                    
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", TypeID);
                        command.Parameters.AddWithValue("@code", TypeCode);
                        command.Parameters.AddWithValue("@name", TypeName);
                        command.Parameters.AddWithValue("@desc", (object)Description ?? DBNull.Value);
                        command.Parameters.AddWithValue("@active", IsActive);
                        command.Parameters.AddWithValue("@order", DisplayOrder);
                        
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
                
                return Json(new { success = true, message = "Cập nhật thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // API: Delete activity type
        [HttpPost]
        public JsonResult DeleteActivityType(int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var sql = "DELETE FROM ActivityTypes WHERE TypeID = @id";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
                
                return Json(new { success = true, message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        #region Private Methods

        private List<Activity> GetActivitiesPaged(int page, int pageSize, string search, string type, string status)
        {
            var activities = new List<Activity>();
            
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = @"
                    SELECT ActivityID, Title, Description, ActivityType, ImageUrl, DocumentUrl, 
                           StartDate, EndDate, Location, Participants, IsPublished, IsFeatured, 
                           ViewCount, CreatedDate, UpdatedDate
                    FROM Activities 
                    WHERE 1=1";
                
                var parameters = new List<SqlParameter>();
                
                if (!string.IsNullOrEmpty(search))
                {
                    sql += " AND (Title LIKE @search OR Description LIKE @search)";
                    parameters.Add(new SqlParameter("@search", "%" + search + "%"));
                }
                
                if (!string.IsNullOrEmpty(type))
                {
                    sql += " AND ActivityType = @type";
                    parameters.Add(new SqlParameter("@type", type));
                }
                
                if (!string.IsNullOrEmpty(status))
                {
                    if (status == "published")
                        sql += " AND IsPublished = 1";
                    else if (status == "draft")
                        sql += " AND IsPublished = 0";
                }
                
                sql += " ORDER BY CreatedDate DESC";
                sql += " OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";
                
                parameters.Add(new SqlParameter("@offset", (page - 1) * pageSize));
                parameters.Add(new SqlParameter("@pageSize", pageSize));
                
                using (var command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddRange(parameters.ToArray());
                    connection.Open();
                    
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            activities.Add(MapReaderToActivity(reader));
                        }
                    }
                }
            }
            
            return activities;
        }

        private int GetActivitiesCount(string search, string type, string status)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = "SELECT COUNT(*) FROM Activities WHERE 1=1";
                var parameters = new List<SqlParameter>();
                
                if (!string.IsNullOrEmpty(search))
                {
                    sql += " AND (Title LIKE @search OR Description LIKE @search)";
                    parameters.Add(new SqlParameter("@search", "%" + search + "%"));
                }
                
                if (!string.IsNullOrEmpty(type))
                {
                    sql += " AND ActivityType = @type";
                    parameters.Add(new SqlParameter("@type", type));
                }
                
                if (!string.IsNullOrEmpty(status))
                {
                    if (status == "published")
                        sql += " AND IsPublished = 1";
                    else if (status == "draft")
                        sql += " AND IsPublished = 0";
                }
                
                using (var command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddRange(parameters.ToArray());
                    connection.Open();
                    return (int)command.ExecuteScalar();
                }
            }
        }

        private Activity GetActivityById(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = @"
                    SELECT ActivityID, Title, Description, ActivityType, ImageUrl, DocumentUrl, 
                           StartDate, EndDate, Location, Participants, IsPublished, IsFeatured, 
                           ViewCount, CreatedDate, UpdatedDate
                    FROM Activities 
                    WHERE ActivityID = @id";
                
                using (var command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return MapReaderToActivity(reader);
                        }
                    }
                }
            }
            
            return null;
        }

        private void CreateActivity(Activity activity)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = @"
                    INSERT INTO Activities (Title, Description, ActivityType, ImageUrl, DocumentUrl, 
                                          StartDate, EndDate, Location, Participants, IsPublished, 
                                          IsFeatured, ViewCount, CreatedDate, UpdatedDate)
                    VALUES (@Title, @Description, @ActivityType, @ImageUrl, @DocumentUrl, 
                            @StartDate, @EndDate, @Location, @Participants, @IsPublished, 
                            @IsFeatured, 0, GETDATE(), GETDATE())";
                
                using (var command = new SqlCommand(sql, connection))
                {
                    AddActivityParameters(command, activity);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }

        private void UpdateActivity(Activity activity)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = @"
                    UPDATE Activities 
                    SET Title = @Title, Description = @Description, ActivityType = @ActivityType, 
                        ImageUrl = @ImageUrl, DocumentUrl = @DocumentUrl, StartDate = @StartDate, 
                        EndDate = @EndDate, Location = @Location, Participants = @Participants, 
                        IsPublished = @IsPublished, IsFeatured = @IsFeatured, UpdatedDate = GETDATE()
                    WHERE ActivityID = @ActivityID";
                
                using (var command = new SqlCommand(sql, connection))
                {
                    AddActivityParameters(command, activity);
                    command.Parameters.AddWithValue("@ActivityID", activity.ActivityID);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }

        private void DeleteActivity(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = "DELETE FROM Activities WHERE ActivityID = @id";
                
                using (var command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }

        private object GetActivityStatistics()
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var sql = @"
                    SELECT 
                        COUNT(*) as Total,
                        SUM(CASE WHEN IsPublished = 1 THEN 1 ELSE 0 END) as Published,
                        SUM(CASE WHEN IsFeatured = 1 THEN 1 ELSE 0 END) as Featured,
                        SUM(ViewCount) as TotalViews
                    FROM Activities";
                
                using (var command = new SqlCommand(sql, connection))
                {
                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new
                            {
                                Total = reader.GetInt32(0),
                                Published = reader.GetInt32(1),
                                Featured = reader.GetInt32(2),
                                TotalViews = reader.GetInt32(3)
                            };
                        }
                    }
                }
            }
            
            return new { Total = 0, Published = 0, Featured = 0, TotalViews = 0 };
        }

        private List<SelectListItem> GetActivityTypesForDropdown()
        {
            var types = new List<SelectListItem>();
            types.Add(new SelectListItem { Value = "", Text = "-- Chọn loại hoạt động --" });
            
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var sql = @"SELECT TypeCode, TypeName 
                               FROM ActivityTypes 
                               WHERE IsActive = 1 
                               ORDER BY DisplayOrder";
                    
                    using (var command = new SqlCommand(sql, connection))
                    {
                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                types.Add(new SelectListItem
                                {
                                    Value = reader.GetString(0),  // TypeCode
                                    Text = reader.GetString(1)     // TypeName
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Fallback to hardcoded values if table doesn't exist
                types.Add(new SelectListItem { Value = "news", Text = "Tin tức" });
                types.Add(new SelectListItem { Value = "events", Text = "Sự kiện" });
                types.Add(new SelectListItem { Value = "training", Text = "Đào tạo" });
                types.Add(new SelectListItem { Value = "projects", Text = "Dự án" });
                types.Add(new SelectListItem { Value = "meeting", Text = "Họp" });
            }
            
            return types;
        }

        private Activity MapReaderToActivity(SqlDataReader reader)
        {
            return new Activity
            {
                ActivityID = reader.GetInt32(0),
                Title = reader.IsDBNull(1) ? "" : reader.GetString(1),
                Description = reader.IsDBNull(2) ? "" : reader.GetString(2),
                ActivityType = reader.IsDBNull(3) ? "" : reader.GetString(3),
                ImageUrl = reader.IsDBNull(4) ? "" : reader.GetString(4),
                DocumentUrl = reader.IsDBNull(5) ? "" : reader.GetString(5),
                StartDate = reader.IsDBNull(6) ? (DateTime?)null : reader.GetDateTime(6),
                EndDate = reader.IsDBNull(7) ? (DateTime?)null : reader.GetDateTime(7),
                Location = reader.IsDBNull(8) ? "" : reader.GetString(8),
                Participants = reader.IsDBNull(9) ? (int?)null : reader.GetInt32(9),
                IsPublished = reader.GetBoolean(10),
                IsFeatured = reader.GetBoolean(11),
                ViewCount = reader.GetInt32(12),
                CreatedDate = reader.GetDateTime(13),
                UpdatedDate = reader.GetDateTime(14)
            };
        }

        private void AddActivityParameters(SqlCommand command, Activity activity)
        {
            command.Parameters.AddWithValue("@Title", activity.Title ?? "");
            command.Parameters.AddWithValue("@Description", activity.Description ?? "");
            command.Parameters.AddWithValue("@ActivityType", activity.ActivityType ?? "");
            command.Parameters.AddWithValue("@ImageUrl", activity.ImageUrl ?? "");
            command.Parameters.AddWithValue("@DocumentUrl", activity.DocumentUrl ?? "");
            command.Parameters.AddWithValue("@StartDate", (object)activity.StartDate ?? DBNull.Value);
            command.Parameters.AddWithValue("@EndDate", (object)activity.EndDate ?? DBNull.Value);
            command.Parameters.AddWithValue("@Location", activity.Location ?? "");
            command.Parameters.AddWithValue("@Participants", (object)activity.Participants ?? DBNull.Value);
            command.Parameters.AddWithValue("@IsPublished", activity.IsPublished);
            command.Parameters.AddWithValue("@IsFeatured", activity.IsFeatured);
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
                string[] allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp" };
                string[] allowedDocExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx" };
                
                if (folder == "images" && !Array.Exists(allowedImageExtensions, ext => ext == extension))
                {
                    throw new Exception("Định dạng hình ảnh không hợp lệ");
                }
                
                if (folder == "documents" && !Array.Exists(allowedDocExtensions, ext => ext == extension))
                {
                    throw new Exception("Định dạng tài liệu không hợp lệ");
                }

                // Create upload directory if not exists
                string uploadPath = Server.MapPath("~/Content/uploads/activities/" + folder);
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Generate unique filename
                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                string uniqueId = Guid.NewGuid().ToString("N").Substring(0, 8);
                string fileName = string.Format("{0}_{1}{2}", timestamp, uniqueId, extension);
                string filePath = Path.Combine(uploadPath, fileName);

                // Save file
                file.SaveAs(filePath);

                // Return relative URL
                return string.Format("/Content/uploads/activities/{0}/{1}", folder, fileName);
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi upload file: " + ex.Message);
            }
        }

        #endregion
    }
}
