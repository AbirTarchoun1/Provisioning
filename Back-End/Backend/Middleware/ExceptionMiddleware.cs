using Newtonsoft.Json;
using Serilog.Context;
using System;
using System.Net;

namespace Backend.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;


        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> _logger)
        {
            _next = next;
            this._logger = _logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            string controllerName = context.Request.RouteValues["controller"].ToString();
            string actionName = context.Request.RouteValues["action"].ToString();
            //  _logger.LogInformation("Action '{action}' was executed", "this is test");
            _logger.LogError(controllerName + "/" + actionName +"-->" + exception.Message);
         
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            return context.Response.WriteAsync(JsonConvert.SerializeObject(new 
            {
                Status = (int)HttpStatusCode.InternalServerError,
                Message = "Something went wrong, please contact admin",
                Data = exception.Message
            }));
        }
    }
  
}
