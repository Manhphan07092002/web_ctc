using System;
using System.ComponentModel.DataAnnotations;

namespace Cubetech.Website.Models
{
    public class Project
    {
        public int ProjectID { get; set; }
        
        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(500, ErrorMessage = "Tiêu đề không được vượt quá 500 ký tự")]
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        [StringLength(100, ErrorMessage = "Danh mục không được vượt quá 100 ký tự")]
        public string Category { get; set; }
        
        // Category name from database (not mapped to database)
        public string CategoryNameFromDB { get; set; }
        
        [StringLength(300, ErrorMessage = "Địa điểm không được vượt quá 300 ký tự")]
        public string Location { get; set; }
        
        [StringLength(300, ErrorMessage = "Chủ đầu tư không được vượt quá 300 ký tự")]
        public string Client { get; set; }
        
        [StringLength(300, ErrorMessage = "Nhà thầu không được vượt quá 300 ký tự")]
        public string Contractor { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "Giá trị dự án phải lớn hơn 0")]
        public decimal? ProjectValue { get; set; }
        
        [StringLength(10, ErrorMessage = "Đơn vị tiền tệ không được vượt quá 10 ký tự")]
        public string Currency { get; set; }
        
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        
        [StringLength(50, ErrorMessage = "Trạng thái không được vượt quá 50 ký tự")]
        public string Status { get; set; }
        
        [Range(0, 100, ErrorMessage = "Tiến độ phải từ 0 đến 100")]
        public int Progress { get; set; }
        
        [StringLength(500, ErrorMessage = "URL hình ảnh không được vượt quá 500 ký tự")]
        public string ImageUrl { get; set; }
        
        [StringLength(500, ErrorMessage = "URL tài liệu không được vượt quá 500 ký tự")]
        public string DocumentUrl { get; set; }
        
        public bool IsPublished { get; set; }
        public bool IsFeatured { get; set; }
        
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        
        [StringLength(500, ErrorMessage = "Tags không được vượt quá 500 ký tự")]
        public string Tags { get; set; }
        
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        
        [StringLength(100, ErrorMessage = "Người tạo không được vượt quá 100 ký tự")]
        public string CreatedBy { get; set; }
        
        [StringLength(100, ErrorMessage = "Người cập nhật không được vượt quá 100 ký tự")]
        public string UpdatedBy { get; set; }
        
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        
        [StringLength(100, ErrorMessage = "Người xóa không được vượt quá 100 ký tự")]
        public string DeletedBy { get; set; }

        // Constructor
        public Project()
        {
            Currency = "VND";
            Progress = 0;
            IsPublished = false;
            IsFeatured = false;
            ViewCount = 0;
            LikeCount = 0;
            IsDeleted = false;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }

        // Computed Properties
        public string StatusText
        {
            get
            {
                if (string.IsNullOrEmpty(Status)) return "Chưa xác định";
                
                switch (Status.ToLower())
                {
                    case "planning": return "Đang lập kế hoạch";
                    case "in_progress": return "Đang thực hiện";
                    case "completed": return "Hoàn thành";
                    case "on_hold": return "Tạm dừng";
                    case "cancelled": return "Đã hủy";
                    default: return Status;
                }
            }
        }

        public string CategoryText
        {
            get
            {
                // Use CategoryName from database if available
                if (!string.IsNullOrEmpty(CategoryNameFromDB))
                {
                    return CategoryNameFromDB;
                }
                
                // Fallback to hardcoded mapping if database name not available
                if (string.IsNullOrEmpty(Category)) return "Chưa phân loại";
                
                switch (Category.ToUpper())
                {
                    case "HTKT": return "Hạ tầng kỹ thuật";
                    case "XDDD": return "Xây dựng dân dụng";
                    case "HTTT": return "Hạ tầng thông tin - viễn thông";
                    case "TM": return "Hợp đồng thương mại";
                    case "NLMT": return "Năng lượng mặt trời / Điện gió";
                    case "BT": return "Bảo trì - bảo dưỡng";
                    case "KSTK": return "Khảo sát - thiết kế - chế tạo";
                    default: return Category; // Show the code if not found
                }
            }
        }

        public string FormattedValue
        {
            get
            {
                if (!ProjectValue.HasValue) return "Chưa xác định";
                
                if (ProjectValue.Value >= 1000000000) // >= 1 tỷ
                {
                    return (ProjectValue.Value / 1000000000).ToString("N1") + " tỷ " + Currency;
                }
                else if (ProjectValue.Value >= 1000000) // >= 1 triệu
                {
                    return (ProjectValue.Value / 1000000).ToString("N1") + " triệu " + Currency;
                }
                else if (ProjectValue.Value >= 1000) // >= 1 nghìn
                {
                    return (ProjectValue.Value / 1000).ToString("N0") + " nghìn " + Currency;
                }
                else
                {
                    return ProjectValue.Value.ToString("N0") + " " + Currency;
                }
            }
        }

        public string ProgressText
        {
            get
            {
                return Progress.ToString() + "%";
            }
        }

        public string ProgressColor
        {
            get
            {
                if (Progress >= 100) return "success";
                if (Progress >= 75) return "info";
                if (Progress >= 50) return "warning";
                if (Progress >= 25) return "primary";
                return "danger";
            }
        }

        public string RelativeTime
        {
            get
            {
                var timeSpan = DateTime.Now - CreatedDate;
                
                if (timeSpan.Days > 365)
                {
                    int years = timeSpan.Days / 365;
                    return years.ToString() + " năm trước";
                }
                else if (timeSpan.Days > 30)
                {
                    int months = timeSpan.Days / 30;
                    return months.ToString() + " tháng trước";
                }
                else if (timeSpan.Days > 0)
                {
                    return timeSpan.Days.ToString() + " ngày trước";
                }
                else if (timeSpan.Hours > 0)
                {
                    return timeSpan.Hours.ToString() + " giờ trước";
                }
                else if (timeSpan.Minutes > 0)
                {
                    return timeSpan.Minutes.ToString() + " phút trước";
                }
                else
                {
                    return "Vừa xong";
                }
            }
        }

        public string DurationText
        {
            get
            {
                if (!StartDate.HasValue || !EndDate.HasValue) return "Chưa xác định";
                
                var duration = EndDate.Value - StartDate.Value;
                
                if (duration.Days > 365)
                {
                    int years = duration.Days / 365;
                    int remainingDays = duration.Days % 365;
                    if (remainingDays > 30)
                    {
                        int months = remainingDays / 30;
                        return years.ToString() + " năm " + months.ToString() + " tháng";
                    }
                    return years.ToString() + " năm";
                }
                else if (duration.Days > 30)
                {
                    int months = duration.Days / 30;
                    return months.ToString() + " tháng";
                }
                else
                {
                    return duration.Days.ToString() + " ngày";
                }
            }
        }

        public bool HasImage
        {
            get { return !string.IsNullOrEmpty(ImageUrl); }
        }

        public bool HasDocument
        {
            get { return !string.IsNullOrEmpty(DocumentUrl); }
        }
    }
}
