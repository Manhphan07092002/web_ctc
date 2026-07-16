using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cubetech.Website.Models.DTO
{
    public class ProductDTO : Product
    {
        public string CategoryName { get; set; }
        public string UnitName { get; set; }
        public string StandardName { get; set; }
        public int? ChildCount { get; set; }
        public string WebUrl { get; set; }
    }
}