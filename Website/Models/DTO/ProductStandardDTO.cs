using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cubetech.Website.Models.DTO
{
    public class ProductStandardDTO : ProductStandard
    {
        public Nullable<System.Int32> ChildCount { get; set; }
        public Nullable<System.Int32> ProductStandardID { get; set; }
        public string DisplayName { get; set; }
        public bool? IsSmartSearch { get; set; }
        public string Prefix { get; set; }
    }
}