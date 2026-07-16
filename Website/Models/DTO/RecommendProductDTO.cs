namespace Cubetech.Website.Models.DTO
{
    /// <summary>
    /// Data Transfer Object cho Sản phẩm/Báo cáo đề xuất.
    /// Đảm bảo các thuộc tính này khớp với dữ liệu bạn lấy từ DAO.
    /// </summary>
    public class RecommendProductDTO
    {
        public string Name { get; set; }
        public string BasicInfo { get; set; } // Chứa mô tả, có thể là HTML
        public string Image { get; set; }     // Đường dẫn đến hình ảnh
        public string LinkUrl { get; set; }   // Đường dẫn chi tiết (nếu có, ví dụ cho nút 'Xem thêm')
        // Thêm các thuộc tính khác nếu cần
    }
}