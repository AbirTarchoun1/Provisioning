using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Security.Principal;
using Backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using Backend.Dtos;

namespace Backend.DbContextBD
{
    public class DataContext : DbContext
    {


        public DataContext(DbContextOptions<DataContext> options)
   : base(options)
        { }

        /**************************************
               * 
               * Display All Modules
               * 
               * ***************/

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Access> Accesss { get; set; }
        public DbSet<License> Licenses { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        public DbSet<LicenseHistory> LicensesHistory { get; set; }

        // Configure the relationship between User and LoginHistory using Fluent API
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.LoginHistory)
                .WithOne()
                .HasForeignKey(lh => lh.UserId); // Assuming you have a UserId property in LoginHistory
        }


    }
}