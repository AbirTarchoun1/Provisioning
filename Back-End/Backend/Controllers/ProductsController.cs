using Backend.DbContextBD;
using Backend.Dtos;
using Backend.Models;
using Backend.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly DataContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;


        public ProductsController(DataContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;

        }

        /**************************************
        * 
        * Add New Product with Upload Image
        * 
        * ***************/

        [HttpPost("addNewProduct")]
        public async Task<ActionResult<Product>> Create(ProductAddRequest request)
        {
            if (_context.Products.Any(u => u.ProductName == request.ProductName))

                return BadRequest(new
                {
                    Message = "Product already exists.!"
                });
            var product = new Product
            {
                ProductName = request.ProductName,
                ProductVersion = request.ProductVersion,
                Description = request.Description,
                CodProd = request.ProductName.Substring(0, 4),
                PublishDate = request.PublishDate = DateTime.Now,
                LastModificatedDate = request.LastModificatedDate = DateTime.Now,
                CreatedDate = request.CreatedDate = DateTime.Now,

                ProductStatus = request.ProductStatus,


            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(request);
        }


        [HttpPost("createNewProduct")]
        public async Task<ActionResult<Product>> CreateNewProduct([FromForm] ProductDto product)
        {

            try
            {
                // tarchoun Abir
                if (_context.Products.Any(u => u.ProductName == product.ProductName))
                    return BadRequest(new
                    {
                        Message = "Product already exists.!"
                    });



                if (product.File is not null)
                {
                    if (product.File.Length > (10 * 1024 * 1024))  // ici pour ne pas uploder file suppérieur à 10 M  
                        return BadRequest(new { msg = "maxFileSize" });
                    string logo = Guid.NewGuid().ToString() + Path.GetExtension(product.File.FileName);  // new guid plus extension mta3 file ok?
                    var fileStream = new FileStream(Path.Combine(@"wwwroot/", "images/logo", logo), FileMode.Create);
                    product.File.CopyTo(fileStream);
                    fileStream.Close();
                    product.FileName = logo;
                }


                var Newproduct = new Product
                {
                    ProductName = product.ProductName,
                    ProductVersion = product.ProductVersion,
                    Description = product.Description,
                    CodProd = product.ProductName.Substring(0, 4),
                    PublishDate = product.PublishDate = DateTime.Now,
                    LastModificatedDate = product.LastModificatedDate = DateTime.Now,
                    CreatedDate = DateTime.Now,

                    ProductStatus = product.ProductStatus,
                    LogoFilePath = "wwwroot/images/logo/" + product.FileName,
                    FileName = product.FileName

                };

                _context.Products.Add(Newproduct);
                await _context.SaveChangesAsync();

                return Ok(Newproduct);



            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }

        }

        /**************************************
               * 
               * Display All Products
               * 
               * ***************/

        [HttpGet("GetAllProducts")]
        public async Task<ActionResult<List<Product>>> index()
        {
            //Test
            // int.Parse("dsfas");
            return Ok(await _context.Products.ToListAsync());
        }


        /**************************************
        * 
 ,      * Find Product By Name
        * @author Tarchoun Abir
        * 
        * ****/

        [HttpGet("GetProductByName")]
        public async Task<ActionResult<Product>> GetProductByName(string productName)
        {
            var product = await _context.Products.FirstOrDefaultAsync(u => u.ProductName == productName);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }


        /**************************************
               * 
               * Display One Product
               * 
               * ***************/
        [HttpGet("{id} GetProductByOne")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            return Ok(product);
        }

        /**************************************
               * 
               * Update Product
               * 
               * ***************/


        [HttpPut("UpdateProduct/{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, ProductUpdateRequest request)
        {
            var findProduct = await _context.Products.FindAsync(id);

            if (findProduct == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            findProduct.ProductName = request.ProductName;
            findProduct.ProductVersion = request.ProductVersion;

            findProduct.Description = request.Description;

            findProduct.ProductStatus = request.ProductStatus;

            findProduct.LastModificatedDate = request.LastModificatedDate = DateTime.Now;



            _context.Entry(findProduct).State = EntityState.Modified;

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

            return Ok(findProduct);
        }


        /**************************************
               * 
               * Delete Product
               * 
               * ***************/

        [HttpDelete("DeleteProduct/{id}")]

        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Products == null)
            {
                return Problem("Entity set 'MyDbContext.Products'  is null.");
            }
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        /******************************
         * 
         * Most Active Product
         * 
         * ***************************/
        [HttpGet("GetMostActiveProduct")]
        public ActionResult<Product> GetMostActiveProduct()
        {
            // Fetch all products along with their associated modules
            var products = _context.Products
                .Include(p => p.Modules)
                .ToList();

            // Find the product with the highest number of modules
            var mostActiveProduct = products.OrderByDescending(p => p.Modules.Count).FirstOrDefault();

            if (mostActiveProduct == null)
            {
                return NotFound(); // If no products are found, return 404 Not Found
            }

            // Display the name of each active module for the most active product
            var activeModules = mostActiveProduct.Modules.Where(m => m.ModuleStatus).ToList();

            // Create a new Product object to hold the result with only active modules
            var resultProduct = new Product
            {
                ProductId = mostActiveProduct.ProductId,
                ProductName = mostActiveProduct.ProductName,
                Modules = activeModules
            };

            return Ok(resultProduct);
        }
    }

    }

