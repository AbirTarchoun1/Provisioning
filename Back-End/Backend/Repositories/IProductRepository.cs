using Backend.Models;

namespace Backend.Repositories
{
    public interface IProductRepository
    {
        Task<Product> GetFirstProductAsync();
        Task<Product> GetProductByIdAsync(int id);
    }
}