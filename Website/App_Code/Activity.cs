using System;

namespace Cubetech.Website.Models
{
    public class Activity
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

        // Constructor
        public Activity()
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

        // Computed properties
        public string TypeLabel
        {
            get
            {
                if (string.IsNullOrEmpty(ActivityType))
                    return "";
                    
                switch (ActivityType.ToLower())
                {
                    case "news": return "Tin tức";
                    case "events": return "Sự kiện";
                    case "training": return "Đào tạo";
                    case "projects": return "Dự án";
                    case "meeting": return "Họp";
                    default: return ActivityType;
                }
            }
        }

        public string FormattedStartDate
        {
            get
            {
                return StartDate.HasValue ? StartDate.Value.ToString("dd/MM/yyyy") : "";
            }
        }

        public string FormattedEndDate
        {
            get
            {
                return EndDate.HasValue ? EndDate.Value.ToString("dd/MM/yyyy") : "";
            }
        }

        public string StatusText
        {
            get
            {
                if (!IsPublished) return "Chưa xuất bản";
                if (StartDate.HasValue && StartDate > DateTime.Now) return "Sắp diễn ra";
                if (StartDate.HasValue && EndDate.HasValue && DateTime.Now >= StartDate && DateTime.Now <= EndDate) return "Đang diễn ra";
                if (EndDate.HasValue && EndDate < DateTime.Now) return "Đã kết thúc";
                return "Đang hoạt động";
            }
        }

        public string RelativeTime
        {
            get
            {
                var timeSpan = DateTime.Now - CreatedDate;
                
                if (timeSpan.TotalMinutes < 1)
                    return "Vừa xong";
                if (timeSpan.TotalMinutes < 60)
                    return string.Format("{0} phút trước", (int)timeSpan.TotalMinutes);
                if (timeSpan.TotalHours < 24)
                    return string.Format("{0} giờ trước", (int)timeSpan.TotalHours);
                if (timeSpan.TotalDays < 30)
                    return string.Format("{0} ngày trước", (int)timeSpan.TotalDays);
                
                return CreatedDate.ToString("dd/MM/yyyy");
            }
        }
    }
}
