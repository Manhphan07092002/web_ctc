using System;
using System.ComponentModel.DataAnnotations;

namespace Cubetech.Website.Models
{
    public class ProjectCategory
    {
        public int CategoryID { get; set; }
        
        [Required(ErrorMessage = "Mã danh mục là bắt buộc")]
        [StringLength(50, ErrorMessage = "Mã danh mục không được vượt quá 50 ký tự")]
        public string CategoryCode { get; set; }
        
        [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên danh mục không được vượt quá 200 ký tự")]
        public string CategoryName { get; set; }
        
        [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
        public string Description { get; set; }
        
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        
        [StringLength(100, ErrorMessage = "Người tạo không được vượt quá 100 ký tự")]
        public string CreatedBy { get; set; }
        
        [StringLength(100, ErrorMessage = "Người cập nhật không được vượt quá 100 ký tự")]
        public string UpdatedBy { get; set; }

        // Constructor
        public ProjectCategory()
        {
            DisplayOrder = 0;
            IsActive = true;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }
    }
}
