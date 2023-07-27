using System.ComponentModel.DataAnnotations;
namespace Backend.Requests
{
    public class UserUpdateRequest
    {

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
       public string Username { get; set; }
     
        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
    }
}
