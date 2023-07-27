using Backend.DbContextBD;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly DataContext _context;

        public ModuleRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> ModuleExistsAsync(string moduleName)
        {
            return await _context.Modules.AnyAsync(u => u.ModuleName == moduleName);
        }

        public async Task<Module> GetModuleByIdAsync(int id)
        {
            return await _context.Modules.FindAsync(id);
        }

        public async Task UpdateModuleAsyncc(Module module)
        {
            _context.Modules.Update(module);
            await _context.SaveChangesAsync();
        }

        public async Task AddModuleAsync(Module module)
        {
            _context.Modules.Add(module);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateModuleAsync(Module module)
        {
            _context.Modules.Update(module);
            await _context.SaveChangesAsync();
        }


    }

}
