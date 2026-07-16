using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Cubetech.Website.Models.DTO;
using Cubetech.Website.Models;

namespace Cubetech.Website.Controllers
{
    public class WProductsController : Controller
    {
        // GET: WProducts/List
        public ActionResult List(string category = "", string info = "", string mode = "page")
        {
            // Debug logging
            System.Diagnostics.Trace.WriteLine($"WProductsController.List called: category={category}, info={info}, mode={mode}");
            
            try
            {
                // Create model for the view
                var model = new WpSearchViewDTO
                {
                    SearchCategory = category,
                    Info = info,
                    Mode = mode,
                    Cate = null,
                    LstSubCate = new List<Category>(),
                    LstParrentCate = new List<Category>()
                };

                // Set ViewBag for debugging
                ViewBag.Category = category;
                ViewBag.Info = info;
                ViewBag.Mode = mode;
                ViewBag.Debug = $"WProductsController.List called with category={category}, info={info}, mode={mode}";

                return View(model);
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Error in WProductsController.List: " + ex.Message;
                
                // Create fallback model
                var fallbackModel = new WpSearchViewDTO
                {
                    SearchCategory = category ?? "",
                    Info = info ?? "",
                    Mode = mode ?? "page",
                    Cate = null,
                    LstSubCate = new List<Category>(),
                    LstParrentCate = new List<Category>()
                };

                return View(fallbackModel);
            }
        }

        // GET: WProducts/HoatDongChiTiet
        public ActionResult HoatDongChiTiet(int? id)
        {
            System.Diagnostics.Trace.WriteLine($"WProductsController.HoatDongChiTiet called with id={id}");
            
            var model = new WpSearchViewDTO
            {
                SearchCategory = "-18",
                Info = "",
                Mode = "page",
                Cate = null,
                LstSubCate = new List<Category>(),
                LstParrentCate = new List<Category>()
            };

            ViewBag.ActivityId = id;
            return View("List", model);
        }

        // GET: WProducts/HoatDong
        public ActionResult HoatDong()
        {
            System.Diagnostics.Trace.WriteLine("WProductsController.HoatDong called");
            
            var model = new WpSearchViewDTO
            {
                SearchCategory = "-10",
                Info = "",
                Mode = "page",
                Cate = null,
                LstSubCate = new List<Category>(),
                LstParrentCate = new List<Category>()
            };

            return View("List", model);
        }

        // GET: WProducts/Test - Simple test action
        public ActionResult Test()
        {
            return Content("WProductsController is working! Time: " + DateTime.Now.ToString());
        }

        // GET: WProducts/TestLike - Test like endpoint accessibility
        public ActionResult TestLike()
        {
            return Content("ToggleLike endpoint is accessible! Time: " + DateTime.Now.ToString());
        }

        // GET: WProducts/ToggleLike - Test endpoint
        public ActionResult ToggleLike()
        {
            if (Request.HttpMethod == "GET")
            {
                return Content("ToggleLike POST endpoint is ready! Time: " + DateTime.Now.ToString());
            }
            
            // POST: WProducts/ToggleLike - Toggle like for activity
            try
            {
                System.Diagnostics.Trace.WriteLine("ToggleLike called");
                
                // Read JSON from request body
                Request.InputStream.Position = 0;
                var reader = new System.IO.StreamReader(Request.InputStream);
                var json = reader.ReadToEnd();
                
                System.Diagnostics.Trace.WriteLine("Received JSON: " + json);
                
                // Simple JSON parsing without Newtonsoft (for .NET 4.0 compatibility)
                int activityId = 0;
                bool isLiked = false;
                
                // Parse JSON manually
                if (json.Contains("activityId"))
                {
                    var activityIdStart = json.IndexOf("\"activityId\":") + 13;
                    var activityIdEnd = json.IndexOf(",", activityIdStart);
                    if (activityIdEnd == -1) activityIdEnd = json.IndexOf("}", activityIdStart);
                    var activityIdStr = json.Substring(activityIdStart, activityIdEnd - activityIdStart).Trim();
                    int.TryParse(activityIdStr, out activityId);
                }
                
                if (json.Contains("isLiked"))
                {
                    isLiked = json.Contains("\"isLiked\":true");
                }
                
                System.Diagnostics.Trace.WriteLine("Parsed - ActivityId: " + activityId + ", IsLiked: " + isLiked);
                
                using (var connection = new System.Data.SqlClient.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
                {
                    connection.Open();
                    
                    string query;
                    if (isLiked)
                    {
                        // Increase like count
                        query = "UPDATE Activities SET LikeCount = ISNULL(LikeCount, 0) + 1 WHERE ActivityID = @activityId";
                    }
                    else
                    {
                        // Decrease like count (minimum 0)
                        query = "UPDATE Activities SET LikeCount = CASE WHEN ISNULL(LikeCount, 0) > 0 THEN LikeCount - 1 ELSE 0 END WHERE ActivityID = @activityId";
                    }
                    
                    using (var cmd = new System.Data.SqlClient.SqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@activityId", activityId);
                        cmd.ExecuteNonQuery();
                    }
                    
                    // Get updated like count
                    var selectQuery = "SELECT ISNULL(LikeCount, 0) FROM Activities WHERE ActivityID = @activityId";
                    using (var cmd = new System.Data.SqlClient.SqlCommand(selectQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@activityId", activityId);
                        var likeCount = Convert.ToInt32(cmd.ExecuteScalar());
                        
                        return Json(new { success = true, likeCount = likeCount });
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine("Error in ToggleLike: " + ex.Message);
                return Json(new { success = false, error = ex.Message });
            }
        }

        // GET: WProducts/SmartSearchProducts (for AJAX)
        [HttpPost]
        public ActionResult SmartSearchProducts()
        {
            // This would handle AJAX product search
            // For now, return empty result
            return Content("");
        }
    }
}
