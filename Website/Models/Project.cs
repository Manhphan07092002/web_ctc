using System;
using System.ComponentModel.DataAnnotations;

namespace Website.Models
{
    public class Project
    {
        public int ProjectID { get; set; }
        
        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(500, ErrorMessage = "Tiêu đề không được vượt quá 500 ký tự")]
        [Display(Name = "Tiêu đề dự án")]
        public string Title { get; set; }
        
        [Display(Name = "Mô tả")]
        public string Description { get; set; }
        
        [StringLength(100, ErrorMessage = "Danh mục không được vượt quá 100 ký tự")]
        [Display(Name = "Danh mục")]
        public string Category { get; set; }
        
        [StringLength(300, ErrorMessage = "Địa điểm không được vượt quá 300 ký tự")]
        [Display(Name = "Địa điểm")]
        public string Location { get; set; }
        
        [StringLength(300, ErrorMessage = "Chủ đầu tư không được vượt quá 300 ký tự")]
        [Display(Name = "Chủ đầu tư")]
        public string Client { get; set; }
        
        [StringLength(300, ErrorMessage = "Nhà thầu không được vượt quá 300 ký tự")]
        [Display(Name = "Nhà thầu")]
        public string Contractor { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "Giá trị dự án phải lớn hơn 0")]
        [Display(Name = "Giá trị dự án")]
        public decimal? ProjectValue { get; set; }
        
        [StringLength(10, ErrorMessage = "Đơn vị tiền tệ không được vượt quá 10 ký tự")]
        [Display(Name = "Đơn vị tiền tệ")]
        public string Currency { get; set; }
        
        [Display(Name = "Ngày bắt đầu")]
        [DataType(DataType.Date)]
        public DateTime? StartDate { get; set; }
        
        [Display(Name = "Ngày kết thúc")]
        [DataType(DataType.Date)]
        public DateTime? EndDate { get; set; }
        
        [Display(Name = "Ngày hoàn thành")]
        [DataType(DataType.Date)]
        public DateTime? CompletionDate { get; set; }
        
        [StringLength(50, ErrorMessage = "Trạng thái không được vượt quá 50 ký tự")]
        [Display(Name = "Trạng thái")]
        public string Status { get; set; }
        
        [Range(0, 100, ErrorMessage = "Tiến độ phải từ 0 đến 100")]
        [Display(Name = "Tiến độ (%)")]
        public int Progress { get; set; }
        
        [StringLength(500, ErrorMessage = "URL hình ảnh không được vượt quá 500 ký tự")]
        [Display(Name = "Hình ảnh")]
        public string ImageUrl { get; set; }
        
        [StringLength(500, ErrorMessage = "URL tài liệu không được vượt quá 500 ký tự")]
        [Display(Name = "Tài liệu")]
        public string DocumentUrl { get; set; }
        
        [Display(Name = "Đã xuất bản")]
        public bool IsPublished { get; set; }
        
        [Display(Name = "Nổi bật")]
        public bool IsFeatured { get; set; }
        
        [Display(Name = "Lượt xem")]
        public int ViewCount { get; set; }
        
        [Display(Name = "Lượt thích")]
        public int LikeCount { get; set; }
        
        [StringLength(500, ErrorMessage = "Tags không được vượt quá 500 ký tự")]
        [Display(Name = "Tags")]
        public string Tags { get; set; }
        
        [Display(Name = "Ngày tạo")]
        public DateTime CreatedDate { get; set; }
        
        [Display(Name = "Ngày cập nhật")]
        public DateTime UpdatedDate { get; set; }
        
        [StringLength(100, ErrorMessage = "Người tạo không được vượt quá 100 ký tự")]
        [Display(Name = "Người tạo")]
        public string CreatedBy { get; set; }
        
        [StringLength(100, ErrorMessage = "Người cập nhật không được vượt quá 100 ký tự")]
        [Display(Name = "Người cập nhật")]
        public string UpdatedBy { get; set; }
        
        [Display(Name = "Đã xóa")]
        public bool IsDeleted { get; set; }
        
        [Display(Name = "Ngày xóa")]
        public DateTime? DeletedDate { get; set; }
        
        [StringLength(100, ErrorMessage = "Người xóa không được vượt quá 100 ký tự")]
        [Display(Name = "Người xóa")]
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
                if (string.IsNullOrEmpty(Category)) return "Chưa phân loại";
                
                switch (Category.ToLower())
                {
                    case "infrastructure": return "Hạ tầng Kỹ thuật";
                    case "construction": return "Xây dựng Dân dụng";
                    case "industrial": return "Công nghiệp";
                    case "environment": return "Môi trường";
                    case "energy": return "Năng lượng";
                    default: return Category;
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

        public bool HasImage
        {
            get { return !string.IsNullOrEmpty(ImageUrl); }
        }

        public bool HasDocument
        {
            get { return !string.IsNullOrEmpty(DocumentUrl); }
        }
    }

    public class ProjectCategory
    {
        public int CategoryID { get; set; }
        
        [Required(ErrorMessage = "Mã danh mục là bắt buộc")]
        [StringLength(50, ErrorMessage = "Mã danh mục không được vượt quá 50 ký tự")]
        [Display(Name = "Mã danh mục")]
        public string CategoryCode { get; set; }
        
        [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên danh mục không được vượt quá 200 ký tự")]
        [Display(Name = "Tên danh mục")]
        public string CategoryName { get; set; }
        
        [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
        [Display(Name = "Mô tả")]
        public string Description { get; set; }
        
        [Display(Name = "Thứ tự hiển thị")]
        public int DisplayOrder { get; set; }
        
        [Display(Name = "Kích hoạt")]
        public bool IsActive { get; set; }
        
        [Display(Name = "Ngày tạo")]
        public DateTime CreatedDate { get; set; }
        
        [Display(Name = "Ngày cập nhật")]
        public DateTime UpdatedDate { get; set; }
        
        [StringLength(100, ErrorMessage = "Người tạo không được vượt quá 100 ký tự")]
        [Display(Name = "Người tạo")]
        public string CreatedBy { get; set; }
        
        [StringLength(100, ErrorMessage = "Người cập nhật không được vượt quá 100 ký tự")]
        [Display(Name = "Người cập nhật")]
        public string UpdatedBy { get; set; }

        public ProjectCategory()
        {
            IsActive = true;
            DisplayOrder = 0;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }
    }
}
