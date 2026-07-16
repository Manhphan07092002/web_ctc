using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cubetech.Website.Models.DTO
{
    public class MenuDTO : Menu
    {
        public List<MenuDTO> ListSubMenu { get; set; }
        public int LevelDisPlay { get; set; }
    }
}