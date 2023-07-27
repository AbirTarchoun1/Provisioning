namespace Backend.Requests
{
    public class LicenseUpdateRequest
    {
        
      
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime LastModificatedDate { get; set; }
        public bool LicenseStatus { get; set; }
        public string RenewMode { get; set; }
     
    }
}
