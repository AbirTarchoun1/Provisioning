namespace Backend.Requests
{
    public class ProductUpdateRequest
    {
        public string ProductName { get; set; }
        public string ProductVersion { get; set; }

        public string Description { get; set; }
        public bool ProductStatus { get; set; }
        
        public DateTime LastModificatedDate { get; set; } = DateTime.Now;
    }
}
