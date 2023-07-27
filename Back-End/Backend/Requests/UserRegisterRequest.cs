 using System.ComponentModel.DataAnnotations;
using PasswordGenerator;

using System.ComponentModel.DataAnnotations.Schema;


namespace Backend.Requests
{
    public class UserRegisterRequest 
    {

        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string UserStatus { get; set; }
        public string Level { get; set; }
        public string PhoneNumber { get; set; }
        public int ProductId { get; set; }
        public string passwordHash { get; set; }
        public string passwordSalt { get; set; }
        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
