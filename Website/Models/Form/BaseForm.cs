using Cubetech.Website.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cubetech.Website.Models.Form
{
    public class BaseForm
    {
        public int StartRow { get; set; }
        public int Lenght { get; set; }
        public string SortCol { get; set; }
        public string SortType { get; set; }

        private string info;
        public string Info { get { return Utility.RemoveSign4VietnameseString(info); } set { info = value; } }
    }
}