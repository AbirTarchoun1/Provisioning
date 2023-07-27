using Backend.DbContextBD;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AccessRepository : IAccessRepository
    {

        private readonly DataContext _context;

        public AccessRepository (DataContext context)
        {
            _context = context;
        }

        public async Task<bool> ModuleExistsAsync(string accessName)
        {
            return await _context.Accesss.AnyAsync(u => u.AccessName == accessName);
        }

        public async Task AddModuleAsync(Access access)
        {
            _context.Accesss.Add(access);
            await _context.SaveChangesAsync();
        }
    }
}
