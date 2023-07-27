
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    [Table("Contacts")]
    public class Contact
    {

        [Key]
        public int ContactId { get; set; }
        public string Email { get; set; }
        public string Object { get; set; }
        public string Text { get; set; }
        public string CompanyName { get; set; }
        public DateTimeOffset LastModificatedDate { get; set; }
        public DateTimeOffset CreatedDate { get; set; }

    }
}





