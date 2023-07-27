using Backend.Models;
namespace Backend.Repositories
{
    public interface IModuleRepository
    {

        Task<bool> ModuleExistsAsync(string moduleName);
        Task AddModuleAsync(Module module);
        Task UpdateModuleAsync(Module module);
        Task<Module> GetModuleByIdAsync(int id);
    }
}