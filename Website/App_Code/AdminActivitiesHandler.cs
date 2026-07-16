using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Cubetech.Website.Models;

namespace Cubetech.Website.Handlers
{
    // Activity class definition for handler use
    public class ActivityModel
    {
        public int ActivityID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ActivityType { get; set; }
        public string ImageUrl { get; set; }
        public string DocumentUrl { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Location { get; set; }
        public int? Participants { get; set; }
        public bool IsPublished { get; set; }
        public bool IsFeatured { get; set; }
        public int ViewCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public ActivityModel()
        {
            Title = "";
            Description = "";
            ActivityType = "";
            ImageUrl = "";
            DocumentUrl = "";
            Location = "";
            IsPublished = false;
            IsFeatured = false;
            ViewCount = 0;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }
    }

    public class AdminActivitiesHandler : IHttpHandler
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
                var controller = new Cubetech.Website.AppCode.AdminActivityController();
                
                // Create controller context
                var httpContext = new HttpContextWrapper(context);
                var routeData = new RouteData();
                routeData.Values["controller"] = "AdminActivity";
                
                // Parse path and determine action
                string action = "Index";
                string id = null;
                
                if (path == "/admin/activities")
                {
                    action = "Index";
                }
                else if (path == "/admin/activities/test")
                {
                    action = "Test";
                }
                else if (path == "/admin/activities/create")
                {
                    action = "Create";
                }
                else if (path == "/admin/activities/manage-types")
                {
                    action = "ManageTypes";
                }
                else if (path == "/admin/activities/api/activity-types" && method == "GET")
                {
                    action = "GetActivityTypes";
                }
                else if (path.StartsWith("/admin/activities/api/activity-types/") && method == "GET")
                {
                    action = "GetActivityType";
                    id = path.Substring("/admin/activities/api/activity-types/".Length);
                }
                else if (path == "/admin/activities/api/activity-types" && method == "POST")
                {
                    action = "CreateActivityType";
                }
                else if (path.StartsWith("/admin/activities/api/activity-types/") && method == "PUT")
                {
                    action = "UpdateActivityType";
                    id = path.Substring("/admin/activities/api/activity-types/".Length);
                }
                else if (path.StartsWith("/admin/activities/api/activity-types/") && method == "DELETE")
                {
                    action = "DeleteActivityType";
                    id = path.Substring("/admin/activities/api/activity-types/".Length);
                }
                else if (path.StartsWith("/admin/activities/edit/"))
                {
                    action = "Edit";
                    id = path.Substring("/admin/activities/edit/".Length);
                }
                else if (path.StartsWith("/admin/activities/delete/"))
                {
                    action = "Delete";
                    id = path.Substring("/admin/activities/delete/".Length);
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
                    var type = context.Request.QueryString["type"] ?? "";
                    var status = context.Request.QueryString["status"] ?? "";
                    
                    result = controller.Index(page, pageSize, search, type, status);
                }
                else if (action == "Test")
                {
                    result = controller.Test();
                }
                else if (action == "ManageTypes")
                {
                    result = controller.ManageTypes();
                }
                else if (action == "GetActivityTypes")
                {
                    result = controller.GetActivityTypes();
                }
                else if (action == "GetActivityType" && !string.IsNullOrEmpty(id))
                {
                    int typeId;
                    if (int.TryParse(id, out typeId))
                    {
                        result = controller.GetActivityType(typeId);
                    }
                }
                else if (action == "CreateActivityType" && method == "POST")
                {
                    // Read JSON from request body
                    var jsonData = ReadRequestBody(context);
                    var data = ParseJson(jsonData);
                    
                    var typeCode = GetJsonValue(data, "TypeCode");
                    var typeName = GetJsonValue(data, "TypeName");
                    var description = GetJsonValue(data, "Description");
                    int displayOrder;
                    int.TryParse(GetJsonValue(data, "DisplayOrder"), out displayOrder);
                    bool isActive = GetJsonValue(data, "IsActive") == "True" || GetJsonValue(data, "IsActive") == "true";
                    
                    result = controller.CreateActivityType(typeCode, typeName, description, displayOrder, isActive);
                }
                else if (action == "UpdateActivityType" && method == "PUT" && !string.IsNullOrEmpty(id))
                {
                    int typeId;
                    if (int.TryParse(id, out typeId))
                    {
                        // Read JSON from request body
                        var jsonData = ReadRequestBody(context);
                        var data = ParseJson(jsonData);
                        
                        var typeCode = GetJsonValue(data, "TypeCode");
                        var typeName = GetJsonValue(data, "TypeName");
                        var description = GetJsonValue(data, "Description");
                        int displayOrder;
                        int.TryParse(GetJsonValue(data, "DisplayOrder"), out displayOrder);
                        bool isActive = GetJsonValue(data, "IsActive") == "True" || GetJsonValue(data, "IsActive") == "true";
                        
                        result = controller.UpdateActivityType(typeId, typeCode, typeName, description, displayOrder, isActive);
                    }
                }
                else if (action == "DeleteActivityType" && method == "DELETE" && !string.IsNullOrEmpty(id))
                {
                    int typeId;
                    if (int.TryParse(id, out typeId))
                    {
                        result = controller.DeleteActivityType(typeId);
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
                        // This is simplified - in real scenario you'd need proper model binding
                        var model = new ActivityModel();
                        // Basic form parsing (you might want to improve this)
                        model.Title = context.Request.Form["Title"] ?? "";
                        model.Description = context.Request.Form["Description"] ?? "";
                        model.ActivityType = context.Request.Form["ActivityType"] ?? "";
                        model.Location = context.Request.Form["Location"] ?? "";
                        
                        DateTime startDate;
                        DateTime endDate;
                        int participants;
                        
                        if (DateTime.TryParse(context.Request.Form["StartDate"], out startDate))
                            model.StartDate = startDate;
                        if (DateTime.TryParse(context.Request.Form["EndDate"], out endDate))
                            model.EndDate = endDate;
                        if (int.TryParse(context.Request.Form["Participants"], out participants))
                            model.Participants = participants;
                        
                        model.IsPublished = context.Request.Form["IsPublished"] == "true";
                        model.IsFeatured = context.Request.Form["IsFeatured"] == "true";
                        
                        // Note: File uploads are handled directly in Controller via Request.Files
                        // No need to pass files as parameters anymore
                        
                        result = controller.Create(ConvertToActivity(model));
                    }
                }
                else if (action == "Edit" && !string.IsNullOrEmpty(id))
                {
                    int activityId;
                    if (int.TryParse(id, out activityId))
                    {
                        if (method == "GET")
                        {
                            result = controller.Edit(activityId);
                        }
                        else if (method == "POST")
                        {
                            // Similar form parsing for edit
                            var model = new ActivityModel();
                            model.ActivityID = activityId;
                            model.Title = context.Request.Form["Title"] ?? "";
                            model.Description = context.Request.Form["Description"] ?? "";
                            model.ActivityType = context.Request.Form["ActivityType"] ?? "";
                            model.Location = context.Request.Form["Location"] ?? "";
                            
                            DateTime startDate;
                            DateTime endDate;
                            int participants;
                            
                            if (DateTime.TryParse(context.Request.Form["StartDate"], out startDate))
                                model.StartDate = startDate;
                            if (DateTime.TryParse(context.Request.Form["EndDate"], out endDate))
                                model.EndDate = endDate;
                            if (int.TryParse(context.Request.Form["Participants"], out participants))
                                model.Participants = participants;
                            
                            model.IsPublished = context.Request.Form["IsPublished"] == "true";
                            model.IsFeatured = context.Request.Form["IsFeatured"] == "true";
                            
                            // Note: File uploads are handled directly in Controller via Request.Files
                            // No need to pass files as parameters anymore
                            
                            result = controller.Edit(ConvertToActivity(model));
                        }
                    }
                }
                else if (action == "Delete" && !string.IsNullOrEmpty(id) && method == "POST")
                {
                    int activityId;
                    if (int.TryParse(id, out activityId))
                    {
                        result = controller.Delete(activityId);
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

        // Helper method to convert ActivityModel to Activity
        private Activity ConvertToActivity(ActivityModel model)
        {
            var activity = new Activity();
            activity.ActivityID = model.ActivityID;
            activity.Title = model.Title;
            activity.Description = model.Description;
            activity.ActivityType = model.ActivityType;
            activity.ImageUrl = model.ImageUrl;
            activity.DocumentUrl = model.DocumentUrl;
            activity.StartDate = model.StartDate;
            activity.EndDate = model.EndDate;
            activity.Location = model.Location;
            activity.Participants = model.Participants;
            activity.IsPublished = model.IsPublished;
            activity.IsFeatured = model.IsFeatured;
            activity.ViewCount = model.ViewCount;
            activity.CreatedDate = model.CreatedDate;
            activity.UpdatedDate = model.UpdatedDate;
            return activity;
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
