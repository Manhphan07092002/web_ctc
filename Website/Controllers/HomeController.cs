using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cubetech.Website.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        // GET: Home/Contact
        public ActionResult Contact()
        {
            return View();
        }

        // GET: Home/test - Simple test
        public string test()
        {
            return "Hello World from Home/test";
        }

        // GET: Home/test2 - ActionResult version
        public ActionResult test2()
        {
            return Content("Hello from test2");
        }
    }
}
