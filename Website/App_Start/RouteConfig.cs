using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cubetech.Website
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            
            // Debug: Write to trace to see if this method is called
            System.Diagnostics.Trace.WriteLine("RouteConfig.RegisterRoutes called at " + DateTime.Now.ToString());

            // FilePicker routes - MUST BE FIRST
            routes.MapRoute(
                name: "FilePickerTest",
                url: "filepicker/test",
                defaults: new { controller = "FilePicker", action = "Test" }
            );
            
            routes.MapRoute(
                name: "FilePickerTestAlt",
                url: "FilePicker/Test",
                defaults: new { controller = "FilePicker", action = "Test" }
            );
            
            routes.MapRoute(
                name: "FilePickerIndex",
                url: "filepicker/index",
                defaults: new { controller = "FilePicker", action = "Index" }
            );
            
            routes.MapRoute(
                name: "FilePickerList",
                url: "filepicker/List",
                defaults: new { controller = "FilePicker", action = "List" }
            );
            
            routes.MapRoute(
                name: "FilePickerCreateFolder",
                url: "filepicker/createfolder",
                defaults: new { controller = "FilePicker", action = "CreateFolder" }
            );
            
            routes.MapRoute(
                name: "FilePickerUploadImage",
                url: "filepicker/UploadImage",
                defaults: new { controller = "FilePicker", action = "UploadImage" }
            );
            
            routes.MapRoute(
                name: "FilePickerRemoveFolder",
                url: "filepicker/RemoveFolder",
                defaults: new { controller = "FilePicker", action = "RemoveFolder" }
            );
            
            routes.MapRoute(
                name: "FilePickerRemoveFile",
                url: "filepicker/RemoveFile",
                defaults: new { controller = "FilePicker", action = "RemoveFile" }
            );

            // Admin Activity routes
            routes.MapRoute(
                name: "AdminActivitiesTest",
                url: "admin/activities/test",
                defaults: new { controller = "AdminActivity", action = "Test" }
            );
            
            routes.MapRoute(
                name: "AdminActivitiesIndex",
                url: "admin/activities",
                defaults: new { controller = "AdminActivity", action = "Index" }
            );

            // Custom route for gioi_thieu
            routes.MapRoute(
                name: "GioiThieu",
                url: "gioi_thieu",
                defaults: new { controller = "WProducts", action = "List", category = "-6" }
            );

            // Add CompanyIntro route (alias for GioiThieu)
            routes.MapRoute(
                name: "CompanyIntro",
                url: "company-intro",
                defaults: new { controller = "WProducts", action = "List", category = "-6" }
            );

            // Custom route for dich_vu
            routes.MapRoute(
                name: "DichVu",
                url: "dich_vu",
                defaults: new { controller = "WProducts", action = "List", category = "-2" }
            );

            // Custom route for du_an
            routes.MapRoute(
                name: "DuAn",
                url: "du_an",
                defaults: new { controller = "WProducts", action = "List", category = "-4" }
            );

            // Custom route for hoat_dong
            routes.MapRoute(
                name: "HoatDong",
                url: "hoat_dong",
                defaults: new { controller = "WProducts", action = "List", category = "-10" }
            );
            
            // Custom route for lien_he
            routes.MapRoute(
                name: "LienHe",
                url: "Lien_he",
                defaults: new { controller = "WProducts", action = "List", category = "-14" }
            );
            
            // Custom route for du_an_chi_tiet
            routes.MapRoute(
                name: "DuAnChiTiet",
                url: "du_an_chi_tiet",
                defaults: new { controller = "WProducts", action = "List", category = "-16" }
            );
            
            // Custom route for hoat_dong_chi_tiet
            routes.MapRoute(
                name: "HoatDongChiTiet",
                url: "hoat_dong_chi_tiet",
                defaults: new { controller = "WProducts", action = "List", category = "-18" }
            );
            
            // Default route
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
