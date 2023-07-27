using Azure.Core;
using Backend.DbContextBD;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;
using Backend.Requests;
//using Microsoft.AspNetCore.Components;
//using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;

namespace Backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ModuleController : ControllerBase
    {

        private readonly DataContext _context;
        private ProductsController ProductsController;
        private readonly IModuleRepository _moduleRepository;
        private readonly IProductRepository _productRepository;

        public ModuleController(DataContext context, IModuleRepository _moduleRepository,
            IProductRepository _productRepository)
        {
            this._context = context;
            this._moduleRepository = _moduleRepository;
            this._productRepository = _productRepository;
        }



        /***********************************************
        * 
        * Add new Module with select multiple ProductIds 
        * 
        * ***************/


        [HttpPost("addModule")]
        public async Task<IActionResult> AddModule(ModuleDTO input)
        {

            var product = await this._productRepository.GetProductByIdAsync(input.ProductId);

            if (product == null)
            {
                throw new InvalidOperationException("error");
            }

            // var prductname = _context.Products.FirstOrDefault();
            var newModule = new Module
            {
                ModuleName = input.ModuleName,
                Description = input.Description,
                ModulePackage = input.ModulePackage,
                ModuleStatus = input.ModuleStatus,
                //AccessId = input.AccessId,
                CodMod = product.CodProd + input.ModuleName.Substring(0, Math.Min(4, input.ModuleName.Length)),
                CodModPack = (product.CodProd + input.ModuleName.Substring(0, Math.Min(4, input.ModuleName.Length))) +
               input.ModulePackage.Substring(0, Math.Min(4, input.ModulePackage.Length)),
                CreatedDate = DateTime.Now,
                LastModificatedDate = DateTime.Now,
                Product = product
            };
            try
            {
                await _moduleRepository.AddModuleAsync(newModule);
            }
            catch
            {

            }



            return Ok();
        }



        /**************************************
               * 
               * Display All Modules
               * 
               * ***************/


        [HttpGet("GetProductNames")]
        public async Task<IActionResult> GetAllModulesWithProductNames()
        {
            var modulesWithProductNames = await _context.Modules
                .Include(m => m.Product)
                .Select(m => new
                {
                    Module = m,
                    ProductName = m.Product.ProductName
                })
                .ToListAsync();

            return Ok(modulesWithProductNames);
        }



        [HttpGet("GetAllModules")]
        public async Task<ActionResult<List<Module>>> index()
        {
            return Ok(await _context.Modules.ToListAsync());
        }

        /**************************************
               * 
               * Display One Module
               * 
               * ***************/

        [HttpGet("{id} GetModuleByOne")]
        public async Task<ActionResult<Module>> GetById(int id)
        {
            var module = await _context.Modules.FindAsync(id);

            return Ok(module);
        }


        /**************************************
        * 
        * UpDate Module
        * 
        * ***************/


        //[HttpPut("updateModule/{id}")]
        //public async Task<IActionResult> UpdateModule(int id, ModuleDTO input)
        //{
        //    var product = await this._productRepository.GetProductByIdAsync(input.ProductId);

        //    if (product == null)
        //    {
        //        throw new InvalidOperationException("error");
        //    }

        //    var module = await _moduleRepository.GetModuleByIdAsync(id);

        //    if (module == null)
        //    {
        //        throw new InvalidOperationException("Module not found");
        //    }

        //    module.ModuleName = input.ModuleName;
        //   // module.Description = input.Description;
        //    //module.ModulePackage = input.ModulePackage;
        //    module.ModuleStatus = input.ModuleStatus;
        //    //module.CodMod = product.CodProd + input.ModuleName.Substring(0, Math.Min(4, input.ModuleName.Length));
        //    //module.CodModPack = (product.CodProd + input.ModuleName.Substring(0, Math.Min(4, input.ModuleName.Length))) +
        //    //    input.ModulePackage.Substring(0, Math.Min(4, input.ModulePackage.Length));
        //    //module.LastModificatedDate = DateTime.Now;
        //    module.Product = product;

        //    try
        //    {
        //        await _moduleRepository.UpdateModuleAsync(module);
        //    }
        //    catch
        //    {
        //        // Handle any exceptions or errors that occur during the update process
        //    }

        //    return Ok();
        //}

        [HttpPut("UpdateModule/{id}")]
        public async Task<ActionResult<Module>> UpdateModule(int id, ModuleUpdateRequest request)
        {
            var findModule = await _context.Modules.FindAsync(id);

            if (findModule == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }




            findModule.ModuleStatus = request.ModuleStatus;



            _context.Entry(findModule).State = EntityState.Modified;

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

            return Ok(findModule);
        }


        /**************************************
               * 
               * Delete Modules
               * 
               * ***************/
        [HttpDelete("DeleteModule/{id}")]

        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Modules == null)
            {
                return Problem("Entity set 'MyDbContext.Module'  is null.");
            }
            var module = await _context.Modules.FindAsync(id);
            if (module != null)
            {
                _context.Modules.Remove(module);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }


        //[HttpGet("GetModulesbyname")]
        //public async Task<IActionResult>GetModuleBySearchString([FromQuery] string searchTerm)
        //{

        //    var res; //paginati in if and in else

        //    if (!string.IsNullOrEmpty(searchTerm))
        //    { 
        //         res=await _context.Modules.Where(x => x.ModuleName.Contains(searchTerm)).ToListAsync();

        //    }
        //    else
        //    {
        //         res = await _context.Modules.ToListAsync();

        //    }





        //    return Ok(res);
        //}




        [HttpGet("GetModulesByProductId/{id}")]
        public async Task<ActionResult<List<Module>>> GetModulesByProductId(int id)
        {
            return Ok(await _context.Modules.Where(x => x.Product.ProductId == id).ToListAsync());
        }

        //[Http
        //
        //("GetModulesByAccessId/{id}")]
        //public async Task<ActionResult<List<Module>>> GetModulesByAccessId(int id)
        //{
        //    return Ok(await _context.Modules.Where(x => x.Access.AccessId == id).ToListAsync());
        //}


    }
}

