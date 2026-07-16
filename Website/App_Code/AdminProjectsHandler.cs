using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ProjectModel = Cubetech.Website.Models.Project;

namespace Cubetech.Website.Handlers
{
    // Project class definition for handler use
    public class ProjectHandlerModel
    {
        public int ProjectID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Location { get; set; }
        public string Client { get; set; }
        public string Contractor { get; set; }
        public decimal? ProjectValue { get; set; }
        public string Currency { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string Status { get; set; }
        public int Progress { get; set; }
        public string ImageUrl { get; set; }
        public string DocumentUrl { get; set; }
        public bool IsPublished { get; set; }
        public bool IsFeatured { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public string Tags { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public ProjectHandlerModel()
        {
            Title = "";
            Description = "";
            Category = "";
            Location = "";
            Client = "";
            Contractor = "";
            Currency = "VND";
            Status = "";
            Progress = 0;
            ImageUrl = "";
            DocumentUrl = "";
            Tags = "";
            IsPublished = false;
            IsFeatured = false;
            ViewCount = 0;
            LikeCount = 0;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }
    }

    public class AdminProjectsHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                // Security Check: Only allow admin access
                if (!IsAdminAuthenticated(context))
                {
                    RedirectToLogin(context);
                    return;
                }
                
                var path = context.Request.Path.ToLower();
                var method = context.Request.HttpMethod.ToUpper();
                
                // Create controller instance
                var controller = new Cubetech.Website.AppCode.AdminProjectController();
                
                // Create controller context
                var httpContext = new HttpContextWrapper(context);
                var routeData = new RouteData();
                routeData.Values["controller"] = "AdminProject";
                
                // Parse path and determine action
                string action = "Index";
                string id = null;
                
                if (path == "/admin/projects")
                {
                    action = "Index";
                }
                else if (path == "/admin/projects/test")
                {
                    action = "Test";
                }
                else if (path == "/admin/projects/create")
                {
                    action = "Create";
                }
                else if (path == "/admin/projects/manage-categories")
                {
                    action = "ManageCategories";
                }
                else if (path == "/admin/projects/api/project-categories" && method == "GET")
                {
                    action = "GetProjectCategories";
                }
                else if (path.StartsWith("/admin/projects/api/project-categories/") && method == "GET")
                {
                    action = "GetProjectCategory";
                    id = path.Substring("/admin/projects/api/project-categories/".Length);
                }
                else if (path == "/admin/projects/api/project-categories" && method == "POST")
                {
                    action = "CreateProjectCategory";
                }
                else if (path.StartsWith("/admin/projects/api/project-categories/") && method == "PUT")
                {
                    action = "UpdateProjectCategory";
                    id = path.Substring("/admin/projects/api/project-categories/".Length);
                }
                else if (path.StartsWith("/admin/projects/api/project-categories/") && method == "DELETE")
                {
                    action = "DeleteProjectCategory";
                    id = path.Substring("/admin/projects/api/project-categories/".Length);
                }
                else if (path.StartsWith("/admin/projects/edit/"))
                {
                    action = "Edit";
                    id = path.Substring("/admin/projects/edit/".Length);
                }
                else if (path == "/admin/projects/edit")
                {
                    action = "Edit";
                    id = context.Request.QueryString["id"];
                }
                else if (path.StartsWith("/admin/projects/delete/"))
                {
                    action = "Delete";
                    id = path.Substring("/admin/projects/delete/".Length);
                }
                else if (path == "/admin/projects/delete")
                {
                    action = "Delete";
                    id = context.Request.QueryString["id"];
                }
                else if (path.StartsWith("/admin/projects/toggle-publish/"))
                {
                    action = "TogglePublish";
                    id = path.Substring("/admin/projects/toggle-publish/".Length);
                }
                else if (path.StartsWith("/admin/projects/toggle-featured/"))
                {
                    action = "ToggleFeatured";
                    id = path.Substring("/admin/projects/toggle-featured/".Length);
                }
                else
                {
                    context.Response.StatusCode = 404;
                    context.Response.Write("404 - Not Found: " + path);
                    return;
                }
                
                routeData.Values["action"] = action;
                if (!string.IsNullOrEmpty(id))
                {
                    routeData.Values["id"] = id;
                }
                
                var controllerContext = new ControllerContext(httpContext, routeData, controller);
                controller.ControllerContext = controllerContext;
                
                // Execute action based on method and action
                ActionResult result = null;
                
                if (action == "Index")
                {
                    // Parse query parameters for filtering
                    int p;
                    int ps;
                    var page = int.TryParse(context.Request.QueryString["page"], out p) ? p : 1;
                    var pageSize = int.TryParse(context.Request.QueryString["pageSize"], out ps) ? ps : 10;
                    var search = context.Request.QueryString["search"] ?? "";
                    var category = context.Request.QueryString["category"] ?? "";
                    var status = context.Request.QueryString["status"] ?? "";
                    
                    result = controller.Index(category, status, search, page, pageSize);
                }
                else if (action == "Test")
                {
                    result = controller.Test();
                }
                else if (action == "ManageCategories")
                {
                    result = controller.ManageCategories();
                }
                else if (action == "GetProjectCategories")
                {
                    result = controller.GetProjectCategories();
                }
                else if (action == "GetProjectCategory" && !string.IsNullOrEmpty(id))
                {
                    int categoryId;
                    if (int.TryParse(id, out categoryId))
                    {
                        result = controller.GetProjectCategory(categoryId);
                    }
                }
                else if (action == "CreateProjectCategory" && method == "POST")
                {
                    // Read JSON from request body
                    var jsonData = ReadRequestBody(context);
                    var data = ParseJson(jsonData);
                    
                    var categoryCode = GetJsonValue(data, "CategoryCode");
                    var categoryName = GetJsonValue(data, "CategoryName");
                    var description = GetJsonValue(data, "Description");
                    int displayOrder;
                    int.TryParse(GetJsonValue(data, "DisplayOrder"), out displayOrder);
                    bool isActive = GetJsonValue(data, "IsActive") == "True" || GetJsonValue(data, "IsActive") == "true";
                    
                    result = controller.CreateProjectCategory(categoryCode, categoryName, description, displayOrder, isActive);
                }
                else if (action == "UpdateProjectCategory" && method == "PUT" && !string.IsNullOrEmpty(id))
                {
                    int categoryId;
                    if (int.TryParse(id, out categoryId))
                    {
                        // Read JSON from request body
                        var jsonData = ReadRequestBody(context);
                        var data = ParseJson(jsonData);
                        
                        var categoryCode = GetJsonValue(data, "CategoryCode");
                        var categoryName = GetJsonValue(data, "CategoryName");
                        var description = GetJsonValue(data, "Description");
                        int displayOrder;
                        int.TryParse(GetJsonValue(data, "DisplayOrder"), out displayOrder);
                        bool isActive = GetJsonValue(data, "IsActive") == "True" || GetJsonValue(data, "IsActive") == "true";
                        
                        result = controller.UpdateProjectCategory(categoryId, categoryCode, categoryName, description, displayOrder, isActive);
                    }
                }
                else if (action == "DeleteProjectCategory" && method == "DELETE" && !string.IsNullOrEmpty(id))
                {
                    int categoryId;
                    if (int.TryParse(id, out categoryId))
                    {
                        result = controller.DeleteProjectCategory(categoryId);
                    }
                }
                else if (action == "Create")
                {
                    if (method == "GET")
                    {
                        result = controller.Create();
                    }
                    else if (method == "POST")
                    {
                        // For POST, we need to handle form data
                        var model = new ProjectHandlerModel();
                        model.Title = context.Request.Form["Title"] ?? "";
                        model.Description = context.Request.Form["Description"] ?? "";
                        model.Category = context.Request.Form["Category"] ?? "";
                        model.Location = context.Request.Form["Location"] ?? "";
                        model.Client = context.Request.Form["Client"] ?? "";
                        model.Contractor = context.Request.Form["Contractor"] ?? "";
                        
                        DateTime startDate;
                        DateTime endDate;
                        DateTime completionDate;
                        decimal projectValue;
                        int progress;
                        
                        if (DateTime.TryParse(context.Request.Form["StartDate"], out startDate))
                            model.StartDate = startDate;
                        if (DateTime.TryParse(context.Request.Form["EndDate"], out endDate))
                            model.EndDate = endDate;
                        if (DateTime.TryParse(context.Request.Form["CompletionDate"], out completionDate))
                            model.CompletionDate = completionDate;
                        if (decimal.TryParse(context.Request.Form["ProjectValue"], out projectValue))
                            model.ProjectValue = projectValue;
                        if (int.TryParse(context.Request.Form["Progress"], out progress))
                            model.Progress = progress;
                        
                        model.Currency = context.Request.Form["Currency"] ?? "VND";
                        model.Status = context.Request.Form["Status"] ?? "planning";
                        model.Tags = context.Request.Form["Tags"] ?? "";
                        model.IsPublished = context.Request.Form["IsPublished"] == "true";
                        model.IsFeatured = context.Request.Form["IsFeatured"] == "true";
                        
                        // Create project without files first, then handle files separately
                        var project = ConvertToProject(model);
                        
                        // Handle file uploads manually - convert HttpPostedFile to HttpPostedFileBase
                        // Files are now handled directly in the controller via Request.Files
                        result = controller.Create(project);
                    }
                }
                else if (action == "Edit" && !string.IsNullOrEmpty(id))
                {
                    int projectId;
                    if (int.TryParse(id, out projectId))
                    {
                        if (method == "GET")
                        {
                            result = controller.Edit((int?)projectId);
                        }
                        else if (method == "POST")
                        {
                            // Similar form parsing for edit
                            var model = new ProjectHandlerModel();
                            model.ProjectID = projectId;
                            model.Title = context.Request.Form["Title"] ?? "";
                            model.Description = context.Request.Form["Description"] ?? "";
                            model.Category = context.Request.Form["Category"] ?? "";
                            model.Location = context.Request.Form["Location"] ?? "";
                            model.Client = context.Request.Form["Client"] ?? "";
                            model.Contractor = context.Request.Form["Contractor"] ?? "";
                            
                            DateTime startDate;
                            DateTime endDate;
                            DateTime completionDate;
                            decimal projectValue;
                            int progress;
                            
                            if (DateTime.TryParse(context.Request.Form["StartDate"], out startDate))
                                model.StartDate = startDate;
                            if (DateTime.TryParse(context.Request.Form["EndDate"], out endDate))
                                model.EndDate = endDate;
                            if (DateTime.TryParse(context.Request.Form["CompletionDate"], out completionDate))
                                model.CompletionDate = completionDate;
                            if (decimal.TryParse(context.Request.Form["ProjectValue"], out projectValue))
                                model.ProjectValue = projectValue;
                            if (int.TryParse(context.Request.Form["Progress"], out progress))
                                model.Progress = progress;
                            
                            model.Currency = context.Request.Form["Currency"] ?? "VND";
                            model.Status = context.Request.Form["Status"] ?? "planning";
                            model.Tags = context.Request.Form["Tags"] ?? "";
                            model.IsPublished = context.Request.Form["IsPublished"] == "true";
                            model.IsFeatured = context.Request.Form["IsFeatured"] == "true";
                            
                            // Create project without files first, then handle files separately
                            var project = ConvertToProject(model);
                            
                            // Files are now handled directly in the controller via Request.Files
                            result = controller.Edit(project);
                        }
                    }
                }
                else if (action == "Delete" && !string.IsNullOrEmpty(id))
                {
                    int projectId;
                    if (int.TryParse(id, out projectId))
                    {
                        if (method == "GET")
                        {
                            result = controller.DeleteConfirm((int?)projectId);
                        }
                        else if (method == "POST")
                        {
                            result = controller.Delete(projectId);
                        }
                    }
                }
                else if (action == "TogglePublish" && !string.IsNullOrEmpty(id) && method == "POST")
                {
                    int projectId;
                    if (int.TryParse(id, out projectId))
                    {
                        result = controller.TogglePublish(projectId);
                    }
                }
                else if (action == "ToggleFeatured" && !string.IsNullOrEmpty(id) && method == "POST")
                {
                    int projectId;
                    if (int.TryParse(id, out projectId))
                    {
                        result = controller.ToggleFeatured(projectId);
                    }
                }
                
                if (result == null)
                {
                    context.Response.StatusCode = 404;
                    context.Response.Write("404 - Action result is null");
                    return;
                }
                
                // Execute result
                result.ExecuteResult(controllerContext);
            }
            catch (Exception ex)
            {
                context.Response.Write("Handler Error: " + ex.Message + "<br><br>Stack Trace: " + ex.StackTrace);
                context.Response.StatusCode = 500;
            }
        }

        // Helper method to convert ProjectHandlerModel to Project
        private ProjectModel ConvertToProject(ProjectHandlerModel model)
        {
            var project = new ProjectModel();
            project.ProjectID = model.ProjectID;
            project.Title = model.Title;
            project.Description = model.Description;
            project.Category = model.Category;
            project.Location = model.Location;
            project.Client = model.Client;
            project.Contractor = model.Contractor;
            project.ProjectValue = model.ProjectValue;
            project.Currency = model.Currency;
            project.StartDate = model.StartDate;
            project.EndDate = model.EndDate;
            project.CompletionDate = model.CompletionDate;
            project.Status = model.Status;
            project.Progress = model.Progress;
            project.ImageUrl = model.ImageUrl;
            project.DocumentUrl = model.DocumentUrl;
            project.IsPublished = model.IsPublished;
            project.IsFeatured = model.IsFeatured;
            project.ViewCount = model.ViewCount;
            project.LikeCount = model.LikeCount;
            project.Tags = model.Tags;
            project.CreatedDate = model.CreatedDate;
            project.UpdatedDate = model.UpdatedDate;
            project.CreatedBy = "Admin";
            project.UpdatedBy = "Admin";
            
            return project;
        }

        // Helper method to read request body
        private string ReadRequestBody(HttpContext context)
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                context.Request.InputStream.Position = 0;
                return reader.ReadToEnd();
            }
        }

        // Simple JSON parser (basic implementation)
        private System.Collections.Generic.Dictionary<string, string> ParseJson(string json)
        {
            var result = new System.Collections.Generic.Dictionary<string, string>();
            
            if (string.IsNullOrEmpty(json))
                return result;
            
            // Remove { and }
            json = json.Trim().TrimStart('{').TrimEnd('}');
            
            // Split by comma (simple approach)
            var pairs = json.Split(',');
            foreach (var pair in pairs)
            {
                var keyValue = pair.Split(':');
                if (keyValue.Length == 2)
                {
                    var key = keyValue[0].Trim().Trim('"');
                    var value = keyValue[1].Trim().Trim('"');
                    result[key] = value;
                }
            }
            
            return result;
        }

        // Helper to get JSON value
        private string GetJsonValue(System.Collections.Generic.Dictionary<string, string> data, string key)
        {
            return data.ContainsKey(key) ? data[key] : "";
        }

        // Security: Check if user is authenticated admin
        private bool IsAdminAuthenticated(HttpContext context)
        {
            try
            {
                // Use SecurityHelper to check admin status
                return Cubetech.Website.Common.SecurityHelper.IsCurrentUserAdmin();
            }
            catch (Exception ex)
            {
                // Log error if needed
                System.Diagnostics.Debug.WriteLine("Admin auth check failed: " + ex.Message);
                return false;
            }
        }

        // Security: Redirect to login page
        private void RedirectToLogin(HttpContext context)
        {
            try
            {
                // Store the original URL for redirect after login
                var returnUrl = context.Request.Url.ToString();
                var loginUrl = "/Login?returnUrl=" + HttpUtility.UrlEncode(returnUrl);
                
                context.Response.StatusCode = 302;
                context.Response.RedirectLocation = loginUrl;
                context.Response.Write("<script>window.location.href='" + loginUrl + "';</script>");
                context.Response.End();
            }
            catch
            {
                // Fallback: Simple unauthorized message
                context.Response.StatusCode = 401;
                context.Response.Write(@"
                    <html>
                    <head><title>Unauthorized Access</title></head>
                    <body style='font-family: Arial; text-align: center; margin-top: 100px;'>
                        <h2>🔒 Truy cập bị từ chối</h2>
                        <p>Bạn cần đăng nhập với quyền Admin để truy cập trang này.</p>
                        <a href='/Login' style='color: #007bff; text-decoration: none;'>
                            👉 Đăng nhập ngay
                        </a>
                    </body>
                    </html>
                ");
            }
        }
    }
}
