using Backend.DbContextBD;
using Backend.Dtos;
using Backend.Models;
using Backend.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Versioning;
using ServiceStack.Text;
using System.ComponentModel.DataAnnotations;
using Zaabee.Extensions;

namespace Backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AccessController : ControllerBase
    {

        private readonly DataContext _context;
        private static readonly object _lockObject = new object();
        private Access _mostActiveAccess;

        public AccessController(DataContext context)
        {
            _context = context;
        }

        /**************************************
              * 
              * Add  new Access 
              * 
              * ***************/

        [HttpPost("addNewAccess")]
        public async Task<ActionResult> AddAccess(AccessDTO input)
        {


            // Check if the access with the given name already exists

            if (await _context.Accesss.AnyAsync(p => p.AccessName == input.AccessName))
            {
                return BadRequest(new
                {
                    Message = "Role already exists!"
                });
            }
            var product = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == input.ProductId);

            // Create a new list to store the modules that will be associated with the access
            var moduleList = new List<Module>();


            if (!string.IsNullOrEmpty(input.ModuleName))
            {
                var moduleNames = input.ModuleName.Split(',');
                foreach (var moduleName in moduleNames)
                {
                    // Try parsing the moduleName to an int, assuming it's the ModuleId
                    if (int.TryParse(moduleName, out int moduleId))
                    {
                        var module = await _context.Modules.FirstOrDefaultAsync(m => m.ModuleId == moduleId);
                        if (module != null)
                        {
                            // Associate the module with the product
                            module.Product = product;

                            // Add the module to the list of modules for this access
                            moduleList.Add(module);
                        }
                    }
                }
            }

            // Create a new Access entity and set its properties
            var access = new Access
            {
                AccessName = input.AccessName,
                CreatedDate = DateTime.Now,
                LastModificatedDate = DateTime.Now,
                Modules = moduleList
            };

            // Add the new Access entity to the context and save changes
            _context.Accesss.Add(access);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Access added successfully!"
            });
        }


        /**************************************
         * 
         * Display All Accesss
         * 
         * ***************/
        [HttpGet("GetAllAccess")]
        public async Task<ActionResult<List<AccessDTO>>> Index()
        {
            var accessWithModuleAndProductNames1 = await _context.Accesss
                .Include(a => a.Modules)
                .ThenInclude(m => m.Product)
                .ToListAsync();

            var module = await _context.Modules.Where(x => x.ModuleId == 1).ToListAsync();

            var accessWithModuleAndProductNames = await _context.Accesss
                .Include(a => a.Modules)
                .ThenInclude(m => m.Product)
                .Select(a => new AccessDTO
                {
                    AccessId = a.AccessId,
                    AccessName = a.AccessName,
                    LastModificatedDate = a.LastModificatedDate,
                    ModuleName = string.Join(",", a.Modules.Select(m => m.ModuleName)),
                    ProductName = a.Modules.Select(m => m.Product.ProductName).First()
                })
                .ToListAsync();

            return Ok(accessWithModuleAndProductNames);
        }




        /**************************************
        * 
        * Display One Access
        * 
        * ***************/
        [HttpGet("{id} GetAccessByOne")]
        public async Task<ActionResult<Access>> GetById(int id)
        {
            var access = await _context.Accesss.FindAsync(id);

            return Ok(access);
        }


        /**************************************
         * 
         * Delete Access
         * 
         * ***************/

        [HttpDelete("DeleteAccess/{id}")]

        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Accesss == null)
            {
                return Problem("Entity set 'MyDbContext.Accesss'  is null.");
            }
            var access = await _context.Accesss.FindAsync(id);
            if (access != null)
            {
                _context.Accesss.Remove(access);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        /***********************************
         * 
         * Most Active Access
         * 
         * ********************/

        [HttpGet("GetMostActiveAccess")]
        public ActionResult<Access> GetMostActiveAccess()
        {
            // Fetch all accesses along with their associated licenses
            var accesses = _context.Accesss
                .Include(a => a.Licenses)
                .ToList();

            // Update the NumberOfLicenses property for each access
            foreach (var access in accesses)
            {
                access.NumberOfLicenses = access.Licenses.Count;
            }

            // Find the access with the highest number of licenses
            var mostActiveAccess = accesses.OrderByDescending(a => a.NumberOfLicenses).FirstOrDefault();

            if (mostActiveAccess == null)
            {
                return NotFound(); // If no accesses are found, return 404 Not Found
            }

            // Synchronize access to the _mostActiveAccess field
            lock (_lockObject)
            {
                // Check if the new most active access has more licenses than the previous one
                if (_mostActiveAccess == null || mostActiveAccess.NumberOfLicenses >= _mostActiveAccess.NumberOfLicenses)
                {
                    _mostActiveAccess = mostActiveAccess; // Update the private field with the new most active access
                }
            }

            return Ok(_mostActiveAccess); // Return the most active access from the private field
        }
    }

    }


