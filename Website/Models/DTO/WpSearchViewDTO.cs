using Cubetech.Website.Models.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cubetech.Website.Models.DTO
{
    public class WpSearchViewDTO
    {
        public string Mode;
        public string SearchCategory;
        public Category Cate;
        public string Info;

        public int Showfilter = -1;

        public List<Category> LstSubCate;
        public List<Category> LstParrentCate;

        public SmartSearchForm Form { get; set; }
    }
}