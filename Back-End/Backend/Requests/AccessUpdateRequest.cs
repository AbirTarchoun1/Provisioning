namespace Backend.Requests
{
    public class AccessUpdateRequest
    {
        public string AccessName { get; set; }

        public DateTime LastModificatedDate { get; set; }
        //public List<string> ModuleNames { get; set; }
        public List<int> ModuleIds { get; set; }

        public int ProductId { get; set; }
    }
}
