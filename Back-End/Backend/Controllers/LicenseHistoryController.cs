using Backend.DbContextBD;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class LicenseHistoryController : ControllerBase
    {

        private readonly DataContext _context;

        public LicenseHistoryController(DataContext context)
        {
            _context = context;
        }






        /**************************************
         * 
         * Delete License History
         * 
         * ***************/

        [HttpGet("gethistories")]
        public async Task<ActionResult<List<License>>> Indecx()
        {
            var currentDate = DateTime.UtcNow; // Use UTC time instead of local time

            var licenses = await _context.Licenses.ToListAsync();
            if (licenses == null)
            {
                return NotFound();
            }

            var res = await _context.Licenses
                .Include(a => a.Access)
                .ThenInclude(l => l.Modules)
                .ThenInclude(m => m.Product)
                .Where(l => l.EndDate < currentDate) // Filter licenses with end date less than current date
                .Select(l => new
                {
                    l.LicenseId,
                    //l.StartDate,
                    //l.LicenseStatus,
                    EndDate = l.EndDate.ToUniversalTime(),
                    l.User.Username,
                    Access = new
                    {
                        AccessName = l.Access.AccessName,
                        Modules = l.Access.Modules.Select(x => x.ModuleName),
                        Product = l.Access.Modules.Select(x => x.Product.ProductName).FirstOrDefault()
                    }
                })
                .ToListAsync();

            return Ok(res);

        }
    }
}
