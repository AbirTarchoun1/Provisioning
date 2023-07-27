
using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class LoginHistory
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime LoginTime { get; set; }
        
    }
}
