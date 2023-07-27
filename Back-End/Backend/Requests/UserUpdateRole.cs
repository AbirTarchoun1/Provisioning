namespace Backend.Requests
{
    public class UserUpdateRole
    {
        public string Level { get; set; }
        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
    }
}
