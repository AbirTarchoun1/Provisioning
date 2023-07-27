using Backend.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Security.Policy;


[Table("Licenses")]
public class License
{

    [Key]
    public int LicenseId { get; set; }
    public string LicenseKey { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public bool LicenseStatus { get; set; }
    public string RenewMode { get; set; }

    public int ActivationMonths { get; set; }

    public DateTimeOffset LastModificatedDate { get; set; }
    public DateTimeOffset CreatedDate { get; set; }

    public string CreatedBy { get; set; }

   
    public virtual Access Access { get; set; }
    public int AccessId { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }


}

