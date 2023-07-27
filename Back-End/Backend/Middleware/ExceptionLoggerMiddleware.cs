namespace Backend.Middleware
{
    public class ExceptionLoggerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionLoggerMiddleware> _logger;

        public ExceptionLoggerMiddleware(RequestDelegate next, ILogger<ExceptionLoggerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Invoke in every request
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);

            }
            catch (Exception ex)
            {
                //If exception, then log in database.               
                _logger.LogError(exception: ex, ex.Message);
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ExceptionLoggerMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionLoggerMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionLoggerMiddleware>();
        }
    }
}
