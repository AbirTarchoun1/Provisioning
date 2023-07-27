using PasswordGenerator;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.DbContextBD;
namespace Backend.Models
{



    [Table("Users")]
    public class User
    {
       
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        [Required]
        public string Email { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }
        public string UserStatus { get; set; }
        public string Level { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? VerifiedAt { get; set; }


        public DateTime SubscribtionDate { get; set; } = DateTime.Now;
        public string PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }


        public string Username { get; set; }
        public byte[] PasswordHash { get; set; } = new byte[32];
        public byte[] PasswordSalt { get; set; } = new byte[32];
       

        public int FiscalCode { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        public virtual List<License> Licenses { get; set; }
       
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime LastModificatedDate { get; set; } = DateTime.Now;

        public string CreatedBy { get; set; }

        public ICollection<LoginHistory> LoginHistory { get; set; }
    }
}
