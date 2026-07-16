using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using Website.Models;

namespace Website.Controllers
{
    public class AdminController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Admin Dashboard
        public ActionResult Dashboard()
        {
            ViewBag.TotalActivities = db.Activities.Count();
            ViewBag.TotalEvents = db.Activities.Where(a => a.Type == "event").Count();
            ViewBag.TotalNotifications = db.Activities.Where(a => a.Type == "notification").Count();
            ViewBag.RecentActivities = db.Activities.OrderByDescending(a => a.CreatedDate).Take(5).ToList();
            
            return View();
        }

        // GET: Admin/Activities
        public ActionResult Activities()
        {
            var activities = db.Activities.OrderByDescending(a => a.CreatedDate).ToList();
            return View(activities);
        }

        // GET: Admin/Activities/Create
        public ActionResult CreateActivity()
        {
            return View();
        }

        // POST: Admin/Activities/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CreateActivity(Activity activity)
        {
            if (ModelState.IsValid)
            {
                activity.Id = Guid.NewGuid().ToString();
                activity.CreatedDate = DateTime.Now;
                activity.UpdatedDate = DateTime.Now;
                activity.CreatedBy = User.Identity.Name ?? "Admin";
                
                db.Activities.Add(activity);
                db.SaveChanges();
                
                return Json(new { success = true, message = "Hoạt động đã được tạo thành công!" });
            }
            
            return Json(new { success = false, message = "Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin." });
        }

        // GET: Admin/Activities/Edit/5
        public ActionResult EditActivity(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);
            }
            
            Activity activity = db.Activities.Find(id);
            if (activity == null)
            {
                return HttpNotFound();
            }
            
            return View(activity);
        }

        // POST: Admin/Activities/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditActivity(Activity activity)
        {
            if (ModelState.IsValid)
            {
                activity.UpdatedDate = DateTime.Now;
                db.Entry(activity).State = EntityState.Modified;
                db.SaveChanges();
                
                return Json(new { success = true, message = "Hoạt động đã được cập nhật thành công!" });
            }
            
            return Json(new { success = false, message = "Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin." });
        }

        // POST: Admin/Activities/Delete/5
        [HttpPost]
        public ActionResult DeleteActivity(string id)
        {
            try
            {
                Activity activity = db.Activities.Find(id);
                if (activity != null)
                {
                    db.Activities.Remove(activity);
                    db.SaveChanges();
                    return Json(new { success = true, message = "Hoạt động đã được xóa thành công!" });
                }
                
                return Json(new { success = false, message = "Không tìm thấy hoạt động!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        // API: Get Activities for DataTable
        [HttpPost]
        public ActionResult GetActivitiesData()
        {
            var activities = db.Activities.Select(a => new {
                id = a.Id,
                title = a.Title,
                type = a.Type,
                date = a.Date,
                location = a.Location,
                status = a.Status,
                createdDate = a.CreatedDate
            }).OrderByDescending(a => a.createdDate).ToList();

            return Json(new { data = activities });
        }

        // API: Get Dashboard Statistics
        [HttpGet]
        public ActionResult GetDashboardStats()
        {
            var stats = new
            {
                totalActivities = db.Activities.Count(),
                totalEvents = db.Activities.Where(a => a.Type == "event").Count(),
                totalNotifications = db.Activities.Where(a => a.Type == "notification").Count(),
                totalSchedules = db.Activities.Where(a => a.Type == "schedule").Count(),
                recentActivities = db.Activities.OrderByDescending(a => a.CreatedDate).Take(10).Select(a => new {
                    id = a.Id,
                    title = a.Title,
                    type = a.Type,
                    date = a.Date,
                    status = a.Status
                }).ToList(),
                monthlyStats = db.Activities
                    .Where(a => a.CreatedDate.Month == DateTime.Now.Month && a.CreatedDate.Year == DateTime.Now.Year)
                    .GroupBy(a => a.Type)
                    .Select(g => new { type = g.Key, count = g.Count() })
                    .ToList()
            };

            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        // API: Bulk Operations
        [HttpPost]
        public ActionResult BulkDelete(string[] ids)
        {
            try
            {
                var activities = db.Activities.Where(a => ids.Contains(a.Id)).ToList();
                db.Activities.RemoveRange(activities);
                db.SaveChanges();
                
                return Json(new { success = true, message = $"Đã xóa {activities.Count} hoạt động thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        [HttpPost]
        public ActionResult BulkUpdateStatus(string[] ids, string status)
        {
            try
            {
                var activities = db.Activities.Where(a => ids.Contains(a.Id)).ToList();
                foreach (var activity in activities)
                {
                    activity.Status = status;
                    activity.UpdatedDate = DateTime.Now;
                }
                db.SaveChanges();
                
                return Json(new { success = true, message = $"Đã cập nhật trạng thái {activities.Count} hoạt động thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message });
            }
        }

        // GET: Admin/GetActivityDetails
        [HttpGet]
        public ActionResult GetActivityDetails(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return Json(new { success = false, message = "ID không hợp lệ" }, JsonRequestBehavior.AllowGet);
                }

                Activity activity = db.Activities.Find(id);
                if (activity == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy hoạt động" }, JsonRequestBehavior.AllowGet);
                }

                var activityData = new
                {
                    ActivityID = activity.Id,
                    Title = activity.Title,
                    Description = activity.Description,
                    ActivityType = activity.Type,
                    Location = activity.Location,
                    ImageUrl = activity.ImageUrl,
                    StartDate = activity.Date,
                    IsPublished = activity.Status == "published",
                    IsFeatured = activity.IsFeatured,
                    CreatedDate = activity.CreatedDate,
                    ViewCount = activity.ViewCount
                };

                return Json(new { success = true, activity = activityData }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
