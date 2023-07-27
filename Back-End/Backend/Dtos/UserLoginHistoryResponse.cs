namespace Backend.Dtos
{
    public class UserLoginHistoryResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public List<Models.LoginHistory> LoginHistory { get; set; }
    }
}
