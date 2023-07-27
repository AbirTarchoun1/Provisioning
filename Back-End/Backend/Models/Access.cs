using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Razor.Language.Extensions;

namespace Backend.Models
{



    [Table("Accesss")]
    public class Access
    {
       
        [Key]
        public int AccessId { get; set; }
        public string AccessName { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime LastModificatedDate { get; set; } = DateTime.Now;

        public string CreatedBy { get; set; }

        //public int ModuleId { get; set; }
        public List <License> Licenses { get;  set; }
       
        public List<Module> Modules { get; set; }

        [NotMapped]
        public int NumberOfLicenses { get; set; }
    }
}
