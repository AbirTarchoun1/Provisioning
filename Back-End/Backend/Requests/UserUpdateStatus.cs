namespace Backend.Requests
{
    public class UserUpdateStatus
    {
        public string UserStatus { get; set; }
        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
       
    }
}
