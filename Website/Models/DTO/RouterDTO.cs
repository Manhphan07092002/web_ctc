using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace Cubetech.Website.Models.DTO
{
    public class RouterDTO
    {
        public RouterDTO()
        {

        }
        public string ObjectID { get; set; }
        public string ObjectClass { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }

        public object RouterModel { get; set; }
        public string Url { get; set; }

        public Route Route { get; set; }
    }
}