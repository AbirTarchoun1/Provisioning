using Backend.DbContextBD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Npgsql;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DBController : ControllerBase
    {
        private readonly DataContext _context;

        public DBController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("ensureDB")]
        public string ensureDB()
        {
            /*
             Create the Logs table if it doesn't exist
            using (var connection = new NpgsqlConnection(connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand("CREATE TABLE IF NOT EXISTS Logs (Id SERIAL PRIMARY KEY, Date TIMESTAMP NOT NULL, " +
                    "Action TEXT NOT NULL, Message TEXT NOT NULL)", connection))
                {
                    command.ExecuteNonQuery();
                }
            }
            */

            try
            {
                var migrator = _context.Database.GetService<IMigrator>();
                migrator.Migrate();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            return "OK";
        }
    }
}