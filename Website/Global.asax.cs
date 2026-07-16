using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.SessionState;

namespace Cubetech.Website
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Force recompilation - timestamp: 2025-11-08 10:00 - Fix delete permissions
            try
            {
                // Clear all existing routes first
                RouteTable.Routes.Clear();
                
                // Add FilePicker routes FIRST (highest priority)
                RouteTable.Routes.MapRoute(
                    name: "FilePickerTest",
                    url: "filepicker/test",
                    defaults: new { controller = "FilePicker", action = "Test" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "FilePickerIndex",
                    url: "filepicker/index",
                    defaults: new { controller = "FilePicker", action = "Index" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "FilePickerList",
                    url: "filepicker/List",
                    defaults: new { controller = "FilePicker", action = "List" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "FilePickerCreateFolder",
                    url: "filepicker/createfolder",
                    defaults: new { controller = "FilePicker", action = "CreateFolder" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "FilePickerUploadImage",
                    url: "filepicker/UploadImage",
                    defaults: new { controller = "FilePicker", action = "UploadImage" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "FilePickerRemoveFolder",
                    url: "filepicker/RemoveFolder",
                    defaults: new { controller = "FilePicker", action = "RemoveFolder" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "FilePickerRemoveFile",
                    url: "filepicker/RemoveFile",
                    defaults: new { controller = "FilePicker", action = "RemoveFile" }
                );
                
                // Add our admin routes
                RouteTable.Routes.MapRoute(
                    name: "AdminActivitiesTest",
                    url: "admin/activities/test",
                    defaults: new { controller = "AdminActivity", action = "Test" }
                );
                
                RouteTable.Routes.MapRoute(
                    name: "AdminActivitiesIndex",
                    url: "admin/activities",
                    defaults: new { controller = "AdminActivity", action = "Index" }
                );
                
                // Add hoat_dong_chi_tiet route directly
                RouteTable.Routes.MapRoute(
                    name: "HoatDongChiTiet",
                    url: "hoat_dong_chi_tiet",
                    defaults: new { controller = "WProducts", action = "HoatDongChiTiet", id = UrlParameter.Optional }
                );
                
                // Add hoat_dong route directly
                RouteTable.Routes.MapRoute(
                    name: "HoatDong",
                    url: "hoat_dong",
                    defaults: new { controller = "WProducts", action = "HoatDong" }
                );
                
                // Add ToggleLike route
                RouteTable.Routes.MapRoute(
                    name: "ToggleLike",
                    url: "WProducts/ToggleLike",
                    defaults: new { controller = "WProducts", action = "ToggleLike" }
                );
                
                // Then load all other routes from RouteConfig
                RouteConfig.RegisterRoutes(RouteTable.Routes);
                
                // Log successful registration
                System.Diagnostics.Trace.WriteLine("Admin routes added first at " + DateTime.Now + ". Total routes: " + RouteTable.Routes.Count);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine("Error in Application_Start: " + ex.Message);
                throw;
            }
        }
    }
}
// Force restart - cleaned up code, removed unused functions and styles - v44
