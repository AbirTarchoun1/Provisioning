using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public class LicenseHistory
{
    [Key]
    public int LicenseHistoryId { get; set; }
    
    public virtual IList<License> licenses { get; set; }
    public DateTime LastModificatedDate { get; set; }
    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; }


}
