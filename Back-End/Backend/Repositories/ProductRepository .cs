using Backend.DbContextBD;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;

        public ProductRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Product> GetFirstProductAsync()
        {
            return await _context.Products.FirstOrDefaultAsync();
        }
        public async Task AddProductAsync(Product product)
        {
           await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            var product= await _context.Products.FirstOrDefaultAsync(x=>x.ProductId==id);

            return product; 
        }
    }
}