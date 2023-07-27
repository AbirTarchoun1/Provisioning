using Backend.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Requests
{
    public class ModuleAddRequest
    {

        public string ModuleName { get; set; }
        public string Description { get; set; }
        public string ModulePackage { get; set; }
        public bool ModuleStatut { get; set; } 
        public DateTime CreatedDate { get; set; }
        public string CodMod { get; set; }
        public string CodModPack { get; set; }

        public DateTime LastModificatedDate { get; set; }
        
     


    }
}
