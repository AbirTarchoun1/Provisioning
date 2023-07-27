using Backend.DbContextBD;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly DataContext _context;

        public StatisticsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public IActionResult GetUsersStatistics()
        {
            var usersCount = _context.Users.Count();
            var activeUsersCount = _context.Users.Count(u => u.UserStatus == "ACTIVE");
            var inactiveUsersCount = usersCount - activeUsersCount;
            var usersStatistics = new UsersStatisticsDto
            {
                UsersCount = usersCount,
                ActiveUsersCount = activeUsersCount,
                InactiveUsersCount = inactiveUsersCount
            };
            return Ok(usersStatistics);
        }

        [HttpGet("modules")]
        public IActionResult GetModulesStatistics()
        {
            var modulesCount = _context.Modules.Count();
            var activeModulesCount = _context.Modules.Count(m => m.ModuleStatus);
            var inactiveModulesCount = modulesCount - activeModulesCount;
            var modulesStatistics = new ModulesStatisticsDto
            {
                ModulesCount = modulesCount,
                ActiveModulesCount = activeModulesCount,
                InactiveModulesCount = inactiveModulesCount
            };
            return Ok(modulesStatistics);
        }

        [HttpGet("products")]
        public IActionResult GetProductsStatistics()
        {
            var productsCount = _context.Products.Count();
            var activeProductsCount = _context.Products.Count(p => p.ProductStatus);
            var inactiveProductsCount = productsCount - activeProductsCount;
            var productsStatistics = new ProductsStatisticsDto
            {
                ProductsCount = productsCount,
                ActiveProductsCount = activeProductsCount,
                InactiveProductsCount = inactiveProductsCount
            };
            return Ok(productsStatistics);
        }

        [HttpGet("licenses")]
        public IActionResult GetLicensesStatistics()
        {
            var licensesCount = _context.Licenses.Count();
            var activeLicensesCount = _context.Licenses.Count(l => l.LicenseStatus);
            var inactiveLicensesCount = licensesCount - activeLicensesCount;
            var licensesStatistics = new LicensesStatisticsDto
            {
                LicensesCount = licensesCount,
                ActiveLicensesCount = activeLicensesCount,
                InactiveLicensesCount = inactiveLicensesCount
            };
            return Ok(licensesStatistics);
        }

        [HttpGet("progress")]
        public async Task<ActionResult<IEnumerable<ProductsStatisticsDto>>> GetProductProgress()
        {
            var productProgress = await _context.Products
                .GroupBy(p => new { Month = p.PublishDate.Month, Year = p.PublishDate.Year })
                .Select(g => new ProductsStatisticsDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Count = g.Count()
                })
                .ToListAsync();

            return productProgress;
        }

        [HttpGet("productsPercentage")]
        public async Task<ActionResult<double>> GetProductsPercentage()
        {
            var totalProductsCount = await _context.Products.CountAsync();
            var namedProductsCount = await _context.Products.CountAsync(p => !string.IsNullOrEmpty(p.ProductName));
            var percentage = namedProductsCount * 100.0 / totalProductsCount;
            return Ok(percentage);
        }

    }

}
