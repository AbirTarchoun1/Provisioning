using System.ComponentModel.DataAnnotations;

namespace Backend.Requests
{
    public class UserLoginRequest
    {


        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;

    }
}