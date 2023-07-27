using Backend.DbContextBD;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.NetworkInformation;


namespace Backend.Models
{
   
    public class FileUploadRequest
    {

        [NotMapped]
        public IFormFile file { get; set; }
       

    }
}
//  the IFormFile property in  FileUpload class is not a navigation property that needs to be mapped to the database.
// so we can add the[NotMapped] attribute to the files property in  FileUpload class.
//This attribute tells Entity Framework to exclude this property from being mapped to the database.