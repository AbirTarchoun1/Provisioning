using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{



    [Table("Products")]
    public class Product
    {
       
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductVersion { get; set; }
        public DateTime PublishDate { get; set; }
        public string Description { get; set; }
        public string CodProd { get; set; }
        public bool ProductStatus { get; set; }

      
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
       
        public string CreatedBy { get; set; }

        public string LogoFilePath { get; set; }
        public string FileName { get; set; }
        [NotMapped]
        public IFormFile Image { get; set; }

      
        public virtual ICollection<Module> Modules { get; set; }

        public Product()
        {
            Modules = new HashSet<Module>();
        }

    }


    
}
