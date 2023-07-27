namespace Backend.Controllers
{
    using Backend.DbContextBD;
    using Backend.Dtos;
    using Backend.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.CodeAnalysis.VisualBasic.Syntax;
    using Microsoft.EntityFrameworkCore;
    using Npgsql;
    using NpgsqlTypes;
    using Serilog;
    using Serilog.Sinks.PostgreSQL;
    using System.Collections.Generic;
    using System.Linq;

    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly DataContext _context;

        [HttpGet("getlogs")]
        public async Task<ActionResult<List<LogModelDto>>> GetLogs()
        {
            List<LogModelDto> logList = new List<LogModelDto>();

            //var user = _context.Users.Find(User.Identity.GetUserID());
            using (var connection = new NpgsqlConnection("Server = localhost; Port = 5432; User Id = postgres; Password =topadmin2023; Database =TP-PROVISIONING;"))
            {
                connection.Open();
                
                // Execute a SELECT query to retrieve data from the Logs table
                using (var command = new NpgsqlCommand("SELECT * FROM Logs", connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            LogModelDto log = new LogModelDto();
                            // Retrieve values from the columns
                           // log.Username = user.Username;
                            log.Id = reader.GetInt32(0);
                            log.Date = reader.GetDateTime(1);
                            log.Message = reader.GetString(2);
                            log.Action = reader.GetString(2);
                            logList.Add(log);
                            // Do something with the retrieved data
                            // For example, you can add them to a list or return them as JSON
                        }
                    }
                }
            }
            return Ok(logList.OrderBy(x=>x.Date));
        }

        [HttpPost("logs")]
        public bool registerLog()
        {
            try
            {

            
            string connectionstring = ("Server=localhost;Port=5432;User " +
                "Id=postgres;Password=topadmin2023;Database=TP-PROVISIONING;");
            IDictionary<string, ColumnWriterBase> columnWriters = new Dictionary<string, ColumnWriterBase>
            {
                {"message", new RenderedMessageColumnWriter(NpgsqlDbType.Text)},
                {"action", new RenderedMessageColumnWriter(NpgsqlDbType.Text)},

               // {"action", new CustomColumnWriter(NpgsqlDbType.Text)},
                {"date", new TimestampColumnWriter(NpgsqlDbType.Timestamp)},
            };

            Log.Logger = new LoggerConfiguration()
             .WriteTo.File("wwwroot/Log/log.txt")
             .WriteTo.PostgreSQL(
                connectionString: connectionstring,
                tableName: "Logs",
                 columnWriters)
             //.WriteTo.PostgreSQL(connectionString, tableName, columnWriters)
             .CreateLogger();
            return true;
            }
            catch (Exception ex)
            {
                return false;

            }
        }

    }

}
