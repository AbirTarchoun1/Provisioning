namespace Backend.Requests
{
    //add user
    public class UserAddRequest
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string UserStatus { get; set; }
        public string Level { get; set; }
        //public int ProductId { get; set; }
        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string CreatedBy { get; set; }


    }
}
