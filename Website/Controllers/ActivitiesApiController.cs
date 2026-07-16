using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Website.Models;

namespace Website.Controllers
{
    public class ActivitiesApiController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/ActivitiesApi/GetActivities
        [HttpGet]
        public IHttpActionResult GetActivities()
        {
            try
            {
                var activities = db.Activities
                    .Where(a => a.IsPublished)
                    .OrderByDescending(a => a.IsFeatured)
                    .ThenByDescending(a => a.StartDate ?? a.CreatedDate)
                    .Select(a => new
                    {
                        id = a.ActivityID,
                        title = a.Title,
                        description = a.Description,
                        type = a.ActivityType,
                        startDate = a.StartDate != null ? a.StartDate.Value.ToString("yyyy-MM-dd") : "",
                        endDate = a.EndDate != null ? a.EndDate.Value.ToString("yyyy-MM-dd") : "",
                        location = a.Location ?? "",
                        participants = a.Participants ?? 0,
                        image = !string.IsNullOrEmpty(a.ImageUrl) ? a.ImageUrl : GetDefaultImage(a.ActivityType),
                        isFeatured = a.IsFeatured,
                        viewCount = a.ViewCount,
                        formattedStartDate = a.StartDate != null ? a.StartDate.Value.ToString("dd/MM/yyyy") : "",
                        formattedEndDate = a.EndDate != null ? a.EndDate.Value.ToString("dd/MM/yyyy") : "",
                        formattedStartDateTime = a.StartDate != null ? a.StartDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                        typeLabel = GetTypeLabel(a.ActivityType),
                        statusText = GetStatusText(a.IsPublished, a.StartDate, a.EndDate),
                        relativeTime = GetRelativeTime(a.CreatedDate)
                    })
                    .ToList();

                return Ok(new { success = true, data = activities });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải danh sách hoạt động: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/GetNotifications
        [HttpGet]
        public IHttpActionResult GetNotifications()
        {
            try
            {
                var notifications = db.Activities
                    .Where(a => a.IsActive && a.Type == "notification")
                    .OrderByDescending(a => a.CreatedDate)
                    .Take(10)
                    .Select(a => new
                    {
                        id = a.Id,
                        type = GetNotificationType(a.Priority),
                        title = a.Title,
                        message = a.Description.Length > 100 ? 
                                 a.Description.Substring(0, 100) + "..." : 
                                 a.Description,
                        time = GetRelativeTime(a.CreatedDate),
                        icon = GetNotificationIcon(a.Priority),
                        read = false // Default to unread
                    })
                    .ToList();

                return Ok(new { success = true, data = notifications });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải thông báo: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/GetEvents
        [HttpGet]
        public IHttpActionResult GetEvents()
        {
            try
            {
                var events = db.Activities
                    .Where(a => a.IsActive && (a.Type == "event" || a.Type == "schedule"))
                    .OrderBy(a => a.Date)
                    .Take(20)
                    .Select(a => new
                    {
                        id = a.Id,
                        date = a.Date.ToString("yyyy-MM-dd"),
                        title = a.Title,
                        description = a.Description.Length > 150 ? 
                                     a.Description.Substring(0, 150) + "..." : 
                                     a.Description,
                        type = a.Type,
                        status = a.Status
                    })
                    .ToList();

                return Ok(new { success = true, data = events });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải sự kiện: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/GetStats
        [HttpGet]
        public IHttpActionResult GetStats()
        {
            try
            {
                var totalActivities = db.Activities.Count(a => a.IsActive);
                var totalEvents = db.Activities.Count(a => a.IsActive && a.Type == "event");
                var totalNotifications = db.Activities.Count(a => a.IsActive && a.Type == "notification");
                var totalSchedules = db.Activities.Count(a => a.IsActive && a.Type == "schedule");
                var upcomingActivities = db.Activities.Count(a => a.IsActive && a.Status == "upcoming");
                var ongoingActivities = db.Activities.Count(a => a.IsActive && a.Status == "ongoing");

                var stats = new
                {
                    totalActivities = totalActivities,
                    totalEvents = totalEvents,
                    totalNotifications = totalNotifications,
                    totalSchedules = totalSchedules,
                    upcomingActivities = upcomingActivities,
                    ongoingActivities = ongoingActivities,
                    completedActivities = db.Activities.Count(a => a.IsActive && a.Status == "completed")
                };

                return Ok(new { success = true, data = stats });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải thống kê: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/GetActivityFeed
        [HttpGet]
        public IHttpActionResult GetActivityFeed()
        {
            try
            {
                var activityFeed = db.Activities
                    .Where(a => a.IsActive)
                    .OrderByDescending(a => a.CreatedDate)
                    .Take(15)
                    .Select(a => new
                    {
                        id = a.Id,
                        author = a.CreatedBy ?? "Ban Giám đốc",
                        avatar = GetAuthorAvatar(a.CreatedBy),
                        time = GetRelativeTime(a.CreatedDate),
                        content = a.Title,
                        type = a.Type,
                        status = a.Status
                    })
                    .ToList();

                return Ok(new { success = true, data = activityFeed });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải activity feed: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/Search?query=...
        [HttpGet]
        public IHttpActionResult Search(string query = "")
        {
            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    return GetActivities();
                }

                var searchResults = db.Activities
                    .Where(a => a.IsActive && 
                               (a.Title.Contains(query) || 
                                a.Description.Contains(query) ||
                                a.Tags.Contains(query) ||
                                a.Location.Contains(query)))
                    .OrderByDescending(a => a.Date)
                    .Select(a => new
                    {
                        id = a.Id,
                        title = a.Title,
                        description = a.Description,
                        type = a.Type,
                        date = a.Date.ToString("yyyy-MM-dd"),
                        time = a.Time != null ? a.Time.ToString() : "",
                        location = a.Location ?? "",
                        image = !string.IsNullOrEmpty(a.Image) ? a.Image : GetDefaultImage(a.Type),
                        status = a.Status,
                        priority = a.Priority ?? "medium",
                        isFeatured = a.IsFeatured,
                        tags = a.Tags ?? "",
                        formattedDate = a.Date.ToString("dd/MM/yyyy"),
                        typeLabel = GetTypeLabel(a.Type),
                        statusLabel = GetStatusLabel(a.Status)
                    })
                    .ToList();

                return Ok(new { success = true, data = searchResults, query = query });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Lỗi tìm kiếm: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/Filter?type=...
        [HttpGet]
        public IHttpActionResult Filter(string type = "")
        {
            try
            {
                var query = db.Activities.Where(a => a.IsPublished);

                if (!string.IsNullOrEmpty(type) && type != "all")
                {
                    query = query.Where(a => a.ActivityType == type);
                }

                var results = query
                    .OrderByDescending(a => a.IsFeatured)
                    .ThenByDescending(a => a.StartDate ?? a.CreatedDate)
                    .Select(a => new
                    {
                        id = a.ActivityID,
                        title = a.Title,
                        description = a.Description,
                        type = a.ActivityType,
                        startDate = a.StartDate != null ? a.StartDate.Value.ToString("yyyy-MM-dd") : "",
                        endDate = a.EndDate != null ? a.EndDate.Value.ToString("yyyy-MM-dd") : "",
                        location = a.Location ?? "",
                        participants = a.Participants ?? 0,
                        image = !string.IsNullOrEmpty(a.ImageUrl) ? a.ImageUrl : GetDefaultImage(a.ActivityType),
                        isFeatured = a.IsFeatured,
                        viewCount = a.ViewCount,
                        formattedStartDate = a.StartDate != null ? a.StartDate.Value.ToString("dd/MM/yyyy") : "",
                        formattedEndDate = a.EndDate != null ? a.EndDate.Value.ToString("dd/MM/yyyy") : "",
                        typeLabel = GetTypeLabel(a.ActivityType),
                        statusText = GetStatusText(a.IsPublished, a.StartDate, a.EndDate),
                        relativeTime = GetRelativeTime(a.CreatedDate)
                    })
                    .ToList();

                return Ok(new { success = true, data = results, filterType = type });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Lỗi lọc dữ liệu: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/GetActivityDetail/5
        [HttpGet]
        public IHttpActionResult GetActivityDetail(int id)
        {
            try
            {
                var activity = db.Activities
                    .Where(a => a.ActivityID == id && a.IsPublished)
                    .Select(a => new
                    {
                        id = a.ActivityID,
                        title = a.Title,
                        description = a.Description,
                        type = a.ActivityType,
                        startDate = a.StartDate != null ? a.StartDate.Value.ToString("yyyy-MM-dd") : "",
                        endDate = a.EndDate != null ? a.EndDate.Value.ToString("yyyy-MM-dd") : "",
                        location = a.Location ?? "",
                        participants = a.Participants ?? 0,
                        image = !string.IsNullOrEmpty(a.ImageUrl) ? a.ImageUrl : GetDefaultImage(a.ActivityType),
                        isFeatured = a.IsFeatured,
                        viewCount = a.ViewCount,
                        createdDate = a.CreatedDate.ToString("yyyy-MM-dd"),
                        updatedDate = a.UpdatedDate.ToString("yyyy-MM-dd"),
                        formattedStartDate = a.StartDate != null ? a.StartDate.Value.ToString("dd/MM/yyyy") : "",
                        formattedEndDate = a.EndDate != null ? a.EndDate.Value.ToString("dd/MM/yyyy") : "",
                        formattedStartDateTime = a.StartDate != null ? a.StartDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                        formattedEndDateTime = a.EndDate != null ? a.EndDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                        typeLabel = GetTypeLabel(a.ActivityType),
                        statusText = GetStatusText(a.IsPublished, a.StartDate, a.EndDate),
                        relativeTime = GetRelativeTime(a.CreatedDate)
                    })
                    .FirstOrDefault();

                if (activity == null)
                {
                    return NotFound();
                }

                // Cập nhật lượt xem
                var activityEntity = db.Activities.Find(id);
                if (activityEntity != null)
                {
                    activityEntity.ViewCount++;
                    activityEntity.UpdatedDate = DateTime.Now;
                    db.SaveChanges();
                }

                return Ok(new { success = true, data = activity });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải chi tiết hoạt động: " + ex.Message));
            }
        }

        // GET: api/ActivitiesApi/GetRelatedActivities/5
        [HttpGet]
        public IHttpActionResult GetRelatedActivities(int id, int count = 4)
        {
            try
            {
                var currentActivity = db.Activities.Find(id);
                if (currentActivity == null)
                {
                    return NotFound();
                }

                var relatedActivities = db.Activities
                    .Where(a => a.ActivityID != id && 
                               a.IsPublished && 
                               a.ActivityType == currentActivity.ActivityType)
                    .OrderByDescending(a => a.IsFeatured)
                    .ThenByDescending(a => a.ViewCount)
                    .ThenByDescending(a => a.StartDate ?? a.CreatedDate)
                    .Take(count)
                    .Select(a => new
                    {
                        id = a.ActivityID,
                        title = a.Title,
                        description = a.Description.Length > 100 ? 
                                     a.Description.Substring(0, 100) + "..." : 
                                     a.Description,
                        type = a.ActivityType,
                        startDate = a.StartDate != null ? a.StartDate.Value.ToString("yyyy-MM-dd") : "",
                        image = !string.IsNullOrEmpty(a.ImageUrl) ? a.ImageUrl : GetDefaultImage(a.ActivityType),
                        viewCount = a.ViewCount,
                        formattedStartDate = a.StartDate != null ? a.StartDate.Value.ToString("dd/MM/yyyy") : "",
                        typeLabel = GetTypeLabel(a.ActivityType),
                        relativeTime = GetRelativeTime(a.CreatedDate)
                    })
                    .ToList();

                return Ok(new { success = true, data = relatedActivities });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Không thể tải hoạt động liên quan: " + ex.Message));
            }
        }

        // Helper methods
        private string GetDefaultImage(string type)
        {
            switch (type?.ToLower())
            {
                case "news":
                    return "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop";
                case "events":
                    return "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop";
                case "training":
                    return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop";
                case "projects":
                    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop";
                default:
                    return "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop";
            }
        }

        private string GetTypeLabel(string type)
        {
            switch (type?.ToLower())
            {
                case "news": return "Tin tức";
                case "events": return "Sự kiện";
                case "training": return "Đào tạo";
                case "projects": return "Dự án";
                default: return type;
            }
        }

        private string GetStatusText(bool isPublished, DateTime? startDate, DateTime? endDate)
        {
            if (!isPublished) return "Chưa xuất bản";
            if (startDate.HasValue && startDate > DateTime.Now) return "Sắp diễn ra";
            if (startDate.HasValue && endDate.HasValue && DateTime.Now >= startDate && DateTime.Now <= endDate) return "Đang diễn ra";
            if (endDate.HasValue && endDate < DateTime.Now) return "Đã kết thúc";
            return "Đang hoạt động";
        }

        private string GetNotificationType(string priority)
        {
            switch (priority?.ToLower())
            {
                case "high": return "warning";
                case "medium": return "info";
                case "low": return "success";
                default: return "info";
            }
        }

        private string GetNotificationIcon(string priority)
        {
            switch (priority?.ToLower())
            {
                case "high": return "fas fa-exclamation-triangle";
                case "medium": return "fas fa-info-circle";
                case "low": return "fas fa-check-circle";
                default: return "fas fa-bell";
            }
        }

        private string GetAuthorAvatar(string author)
        {
            if (string.IsNullOrEmpty(author)) return "BGĐ";
            
            var words = author.Split(' ');
            if (words.Length >= 2)
            {
                return words[0].Substring(0, 1) + words[words.Length - 1].Substring(0, 1);
            }
            return author.Substring(0, Math.Min(2, author.Length));
        }

        private string GetRelativeTime(DateTime dateTime)
        {
            var timeSpan = DateTime.Now - dateTime;
            
            if (timeSpan.TotalMinutes < 1)
                return "Vừa xong";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} phút trước";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} giờ trước";
            if (timeSpan.TotalDays < 30)
                return $"{(int)timeSpan.TotalDays} ngày trước";
            
            return dateTime.ToString("dd/MM/yyyy");
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
