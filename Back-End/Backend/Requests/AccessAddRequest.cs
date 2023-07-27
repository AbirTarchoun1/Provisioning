namespace Backend.Requests
{
    public class AccessAddRequest
    {
        public int AccessId { get; set; }
        public string AccessName { get; set; }
       
        
        public DateTime CreatedDate { get; set; }

        public DateTime LastModificatedDate { get; set; }

        public string CreatedBy { get; set; }
        public List<int> ModuleIds { get; set; }
        public int ProductId{ get; set; }


    }
}
