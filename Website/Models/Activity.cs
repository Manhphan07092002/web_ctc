using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cubetech.Website.Models
{
    [Table("Activities")]
    public class Activity
    {
        [Key]
        [Column("ActivityID")]
        public int ActivityID { get; set; }

        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(300, ErrorMessage = "Tiêu đề không được vượt quá 300 ký tự")]
        [Display(Name = "Tiêu đề")]
        [Column("Title")]
        public string Title { get; set; }

        [Display(Name = "Mô tả")]
        [Column("Description")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Loại hoạt động là bắt buộc")]
        [StringLength(50)]
        [Display(Name = "Loại")]
        [Column("ActivityType")]
        public string ActivityType { get; set; } // news, events, training, projects

        [Display(Name = "Hình ảnh")]
        [StringLength(255)]
        [Column("ImageUrl")]
        public string ImageUrl { get; set; }

        [Display(Name = "Tài liệu")]
        [StringLength(255)]
        [Column("DocumentUrl")]
        public string DocumentUrl { get; set; }

        [Display(Name = "Ngày bắt đầu")]
        [Column("StartDate")]
        public DateTime? StartDate { get; set; }

        [Display(Name = "Ngày kết thúc")]
        [Column("EndDate")]
        public DateTime? EndDate { get; set; }

        [StringLength(200, ErrorMessage = "Địa điểm không được vượt quá 200 ký tự")]
        [Display(Name = "Địa điểm")]
        [Column("Location")]
        public string Location { get; set; }

        [Display(Name = "Số người tham gia")]
        [Column("Participants")]
        public int? Participants { get; set; }

        [Display(Name = "Đã xuất bản")]
        [Column("IsPublished")]
        public bool IsPublished { get; set; } = false;

        [Display(Name = "Nổi bật")]
        [Column("IsFeatured")]
        public bool IsFeatured { get; set; } = false;

        [Display(Name = "Lượt xem")]
        [Column("ViewCount")]
        public int ViewCount { get; set; } = 0;

        [Display(Name = "Ngày tạo")]
        [Column("CreatedDate")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Display(Name = "Ngày cập nhật")]
        [Column("UpdatedDate")]
        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        // Computed properties
        [NotMapped]
        public string TypeLabel
        {
            get
            {
                switch (ActivityType?.ToLower())
                {
                    case "news": return "Tin tức";
                    case "events": return "Sự kiện";
                    case "training": return "Đào tạo";
                    case "projects": return "Dự án";
                    default: return ActivityType;
                }
            }
        }

        [NotMapped]
        public string FormattedStartDate
        {
            get
            {
                return StartDate?.ToString("dd/MM/yyyy") ?? "";
            }
        }

        [NotMapped]
        public string FormattedEndDate
        {
            get
            {
                return EndDate?.ToString("dd/MM/yyyy") ?? "";
            }
        }

        [NotMapped]
        public string FormattedStartDateTime
        {
            get
            {
                return StartDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
            }
        }

        [NotMapped]
        public string FormattedEndDateTime
        {
            get
            {
                return EndDate?.ToString("dd/MM/yyyy HH:mm") ?? "";
            }
        }

        [NotMapped]
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

        [NotMapped]
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
