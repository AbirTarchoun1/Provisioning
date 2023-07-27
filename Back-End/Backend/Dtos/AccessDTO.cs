namespace Backend.Dtos
{
    public class AccessDTO
    {
        public int AccessId { get; set; }
        public string AccessName { get; set; }
        public DateTime LastModificatedDate { get; set; }
        
        //public string CreatedBy { get; set; }
        public string ProductName { get; set; }
        public int ProductId { get; set; }
        public string ModuleName { get; set; }
   
    }
}
