using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{



    [Table("Modules")]
    public class Module
    {


        [Key]
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string Description { get; set; }
        public string ModulePackage { get; set; }

        public string CodMod { get; set; }
        public string CodModPack { get; set; }

        public bool ModuleStatus { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime LastModificatedDate { get; set; } = DateTime.Now;

        public string CreatedBy { get; set; }

        public Product Product { get; set; }
        // for added
      // public int AccessId { get; set; }

        public Access Access { get; set; }


    }
}
