namespace Backend.Dtos
{
    public class ProductDto
    {

        public string ProductName { get; set; }
        public string ProductVersion { get; set; }
        public Boolean ProductStatus { get; set; }
        public string Description { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime LastModificatedDate { get; set; }


        public string FileName { get; set; }
        public IFormFile File { get; set; }
    }
}
