using System.Web.Http;

namespace Website
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            
            // Web API routes
            config.MapHttpAttributeRoutes();

            // Default API route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Activities API specific routes
            config.Routes.MapHttpRoute(
                name: "ActivitiesApi",
                routeTemplate: "api/ActivitiesApi/{action}",
                defaults: new { controller = "ActivitiesApi" }
            );

            // Enable JSON formatter
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(
                new System.Net.Http.Headers.MediaTypeHeaderValue("text/html"));
        }
    }
}
