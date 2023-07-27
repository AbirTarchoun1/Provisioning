using System.ComponentModel.DataAnnotations.Schema;

public class ProductAddRequest
{
    public string ProductName { get; set; }
    public string ProductVersion { get; set; }
    public bool ProductStatus { get; set; }
    public string Description { get; set; }
    public DateTime PublishDate { get; set; }
    public DateTime LastModificatedDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public Guid CodeProduct { get; set; }


    //public int ImageId { get; set; }
    //ublic string FileName { get; set; }
    //[NotMapped]
    //pulic IFormFile Image { get; set; }
}
