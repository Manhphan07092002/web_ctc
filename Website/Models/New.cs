// File: ~/Models/New.cs

using System;

namespace YourProjectName.Models // <-- Thay "YourProjectName" bằng tên namespace dự án của bạn
{
    /// <summary>
    /// Đại diện cho một bài tin tức được lấy từ RSS Feed.
    /// </summary>
    public class New
    {
        /// <summary>
        /// Tiêu đề bài viết.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Đường dẫn URL đến bài viết gốc.
        /// </summary>
        public string Link { get; set; }

        /// <summary>
        /// Mô tả ngắn hoặc tóm tắt của bài viết.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Đường dẫn URL đến hình ảnh đại diện (thumbnail).
        /// </summary>
        public string ImageUrl { get; set; }

        /// <summary>
        /// Ngày giờ đăng bài.
        /// </summary>
        public DateTime PublishDate { get; set; }
    }
}