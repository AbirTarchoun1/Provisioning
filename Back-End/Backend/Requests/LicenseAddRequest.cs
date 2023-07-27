using Backend.Models;

namespace Backend.Requests
{
    public class LicenseAddRequest
    {
        public int LicenseId { get; set; }
        public int LicenseKey { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime LastModificatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool LicenseStatus { get; set; }
        public string RenewMode { get; set; }
        //public int LicenseHistoryId { get; set; }
        public int ModuleId { get; set; }
    }
}
