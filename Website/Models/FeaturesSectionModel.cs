using Cubetech.Website.Models.DTO;
using System.Collections.Generic;

namespace Cubetech.Website.Models
{
    /// <summary>
    /// ViewModel cho khu vực Tính năng nổi bật.
    /// </summary>
    public class FeaturesSectionModel
    {
        /// <summary>
        /// Danh sách các báo cáo tài chính / sản phẩm đề xuất.
        /// </summary>
        public List<RecommendProductDTO> FinancialReports { get; set; }

        /// <summary>
        /// Khởi tạo ViewModel.
        /// </summary>
        public FeaturesSectionModel()
        {
            // Luôn khởi tạo danh sách để tránh lỗi null
            FinancialReports = new List<RecommendProductDTO>();
        }
    }
}