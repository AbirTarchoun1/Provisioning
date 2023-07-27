using Backend.Models;
namespace Backend.Dtos
{
   
    public class ModuleDTO
    {
        public string ModuleName { get; set; }
        public string Description { get; set; }
        public string ModulePackage { get; set; }

        public string? CodMod { get; set; }
        public string? CodModPack { get; set; }

        public bool ModuleStatus { get; set; }
       

        public string CreatedBy { get; set; }
        public  int ProductId { get; set; }
        public int AccessId { get; set; }

    }
}
