using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cubetech.Website.Models.DTO
{
    public class CategoryExDTO :Category
    {
        public int Level { get; set; }
    }
}