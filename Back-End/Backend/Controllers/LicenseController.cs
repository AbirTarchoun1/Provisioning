using Backend.DbContextBD;
using Backend.Models;
using Backend.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseController : Controller
    {
        private readonly DataContext _context;

        public LicenseController(DataContext context)
        {
            _context = context;
        }


        /**************************************
         * 
         * Add new License 
         * 
         * ***************/
        [HttpPost("addLicense")]
        public async Task<IActionResult> Create(License license)
        {
            // Get the user by user ID
            var user = _context.Users.FirstOrDefault(x => x.UserId == license.UserId);

            if (user == null)
            {
                return Problem($"User with ID {license.UserId} was not found in the database.");
            }

            // Get the access record from the database
            var access = await _context.Accesss.FirstOrDefaultAsync(a => a.AccessId == license.AccessId);

            if (access == null)
            {
                return Problem($"Access record with ID {license.AccessId} was not found in the database.");
            }

            // Create a new license key
            license.LastModificatedDate = DateTime.UtcNow;
            license.LicenseKey = Guid.NewGuid().ToString();

            switch (license.ActivationMonths)
            {
                case 3:
                    license.EndDate = license.StartDate.AddMonths(3);
                    break;
                case 6:
                    license.EndDate = license.StartDate.AddMonths(6);
                    break;
                case 12:
                    license.EndDate = license.StartDate.AddMonths(12);
                    break;
                default:
                    return BadRequest("Invalid activation period selected.");
            }

            // Serialize the license object to JSON
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve,
            };

            var json = JsonSerializer.Serialize(license, options);

            if (ModelState.IsValid)
            {
                _context.Add(license);
                await _context.SaveChangesAsync();
            }

            // Set the EndDate property as non-editable
            var readOnlyLicense = new
            {
                license.LicenseId,
                license.UserId,
                license.AccessId,
                license.StartDate,
                license.LastModificatedDate,
                license.LicenseKey,
                license.ActivationMonths,
                EndDate = license.EndDate.ToString("yyyy-MM-dd"), // Format the date as string
            };

            return Ok(readOnlyLicense);
        }


        /**************************************
        * 
        * Display All Licenses
        * 
        * ***************/

        [HttpGet("GetAllLicense")]
        public async Task<ActionResult<List<License>>> index()
        {
            var licence = await _context.Licenses
                .Include(a => a.Access)
                .ThenInclude(b => b.Modules)
                .ToListAsync();



            return Ok(licence);
        }




        /**************************************
         * 
         * Display One License 
         * 
         * ***************/

        [HttpGet("secondGetLicensess")]
        public async Task<ActionResult<List<License>>> Index()
        {
            var licenses = await _context.Licenses.ToListAsync();
            if (licenses == null)
            {
                return NotFound();
            }

            var res = await _context.Licenses
                .Include(a => a.Access)
                .ThenInclude(l => l.Modules)
                .ThenInclude(m => m.Product)
                .Select(l => new
                {
                    l.LicenseId,
                    l.StartDate,
                    l.LicenseStatus,
                    l.EndDate,
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

        //*********************************

        [HttpGet("getLicenses")]
        public async Task<ActionResult<List<License>>> Indexx()
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
                .Where(l => l.EndDate > currentDate) // Filter licenses with end date greater than current date
                .Select(l => new
                {
                    l.LicenseId,
                    StartDate = l.StartDate.ToUniversalTime(), // Convert to UTC
                    l.LicenseStatus,
                    EndDate = l.EndDate.ToUniversalTime(), // Convert to UTC
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


        /**************************************
        * 
        * Update License 
        * 
        * ***************/

        [HttpPut("UpdateLicense/{id}")]
        public async Task<ActionResult<License>> UpdateLicense(int id, LicenseUpdateRequest license)
        {
            var findLicense = await _context.Licenses.FindAsync(id);

            if (findLicense == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            findLicense.StartDate = license.StartDate;
            findLicense.EndDate = license.EndDate;
            findLicense.LicenseStatus = license.LicenseStatus;
            findLicense.RenewMode = license.RenewMode;
            findLicense.LastModificatedDate = license.LastModificatedDate = DateTime.Now;


            _context.Entry(findLicense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                ModelState.AddModelError("", "Unable to save change. " +
                        "Try Again, if you have problem persists, " +
                        "Contact your system administrator");
            }

            return Ok(findLicense);
        }

        private bool LicenceExists(int id)
        {
            return _context.Licenses.Any(e => e.LicenseId == id);
        }



        /**************************************
          * 
          * Delete License 
          * 
          * ***************/
        [HttpDelete("DeleteLicense/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Licenses == null)
            {
                return Problem("Entity set 'MyDbContext.License'  is null.");
            }
            var license = await _context.Licenses.FindAsync(id);
            if (license != null)
            {
                _context.Licenses.Remove(license);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }



        [HttpGet]
        [Route("api/check-license")]
        public ActionResult<string> CheckLicense(string licenseKey, string username, string moduleName, string productName, string roleName)
        {
            // Step 1: Validate License
            var license = _context.Licenses.FirstOrDefault(l => l.LicenseKey == licenseKey);
            if (license == null)
            {
                return Unauthorized("Invalid license Key.");
            }
            if (!license.LicenseStatus)
            {
                return Unauthorized("License not active.");
            }
            else if (license.EndDate < DateTime.UtcNow)
            {
                return Unauthorized("License experied.");
            }

            // Step 2: Verify Product and Module
            var product = _context.Products.FirstOrDefault(p => p.ProductName == productName);
            if (product == null)
            {
                return BadRequest("Product not found.");
            }
            else if (!product.ProductStatus)
            {
                return BadRequest("Product is not active.");
            }

            var module = _context.Modules.FirstOrDefault(m => m.ModuleName == moduleName);
            if (module == null)
            {
                return BadRequest("Module not found.");
            }
            else if (!module.ModuleStatus)
            {
                return BadRequest("Module is not active.");
            }


            // Step 3: Verify User's 
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return Unauthorized("User does not exist.");
            }
            else if (user.UserStatus != "ACTIVE")
            {
                return Unauthorized("User status is not active.");
            }

            // Step 4: Verify User's Access
            var userAccess = _context.Licenses
                .Include(a => a.Access)
                .Include(a => a.User)
                .FirstOrDefault(a => a.Access.AccessName == roleName && a.LicenseId == license.LicenseId && a.User.Username == username);
            if (userAccess == null)
            {
                return Unauthorized($"User {user.Username} does not have access to the app {product.ProductName} with the module name {moduleName} and the provided package name {roleName}.");
            }

            // Step 5: Generate Response
            var response = $"Hello {product.ProductName}, the user  {user.Username} 😄 Request has a valid license for this {roleName} package including the {moduleName} module.";

            // Step 6: Return Response
            return Ok(response);


        }
    }
}