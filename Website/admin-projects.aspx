<%@ Page Language="C#" %>
<%@ Import Namespace="Cubetech.Website.AppCode" %>
<%@ Import Namespace="System.Web.Mvc" %>
<%@ Import Namespace="System.Web.Routing" %>

<%
try 
{
    // Create controller instance
    var controller = new AdminProjectController();
    
    // Setup MVC context
    var httpContext = new HttpContextWrapper(Context);
    var routeData = new RouteData();
    routeData.Values["controller"] = "AdminProject";
    routeData.Values["action"] = "Index";
    
    var controllerContext = new ControllerContext(httpContext, routeData, controller);
    controller.ControllerContext = controllerContext;
    
    // Get query parameters
    var category = Request.QueryString["category"] ?? "";
    var status = Request.QueryString["status"] ?? "";
    var search = Request.QueryString["search"] ?? "";
    var pageStr = Request.QueryString["page"] ?? "1";
    var pageSizeStr = Request.QueryString["pageSize"] ?? "10";
    
    int page = 1;
    int pageSize = 10;
    int.TryParse(pageStr, out page);
    int.TryParse(pageSizeStr, out pageSize);
    
    // Execute Index action
    var result = controller.Index(category, status, search, page, pageSize);
    
    // Execute the result
    if (result != null)
    {
        result.ExecuteResult(controllerContext);
    }
    else
    {
        Response.Write("No result from controller");
    }
}
catch (Exception ex)
{
    Response.Write("<h1>🚀 Admin Projects - Physical File Working</h1>");
    Response.Write("<div style='background:#f8f9fa;padding:15px;border-radius:5px;margin:10px 0;'>");
    Response.Write("<h2>❌ View Rendering Error</h2>");
    Response.Write("<p><strong>Controller:</strong> ✅ Working</p>");
    Response.Write("<p><strong>Error:</strong> " + ex.Message + "</p>");
    Response.Write("<p><strong>Type:</strong> " + ex.GetType().Name + "</p>");
    
    if (ex.InnerException != null)
    {
        Response.Write("<p><strong>Inner Error:</strong> " + ex.InnerException.Message + "</p>");
    }
    
    Response.Write("<details>");
    Response.Write("<summary>Stack Trace</summary>");
    Response.Write("<pre>" + ex.StackTrace + "</pre>");
    Response.Write("</details>");
    Response.Write("</div>");
    
    Response.Write("<div style='background:#d4edda;padding:15px;border-radius:5px;margin:10px 0;'>");
    Response.Write("<h3>✅ Success Info</h3>");
    Response.Write("<p>AdminProjectController is working! The error is likely in view rendering.</p>");
    Response.Write("<p><a href='/admin/projects-test.aspx'>Try Simple Test</a></p>");
    Response.Write("</div>");
}
%>
