namespace Backend.Dtos
{
    public class LogModelDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Message { get; set; }
        public string Action { get; set; }
        public string Username { get; set; }

    }
}
