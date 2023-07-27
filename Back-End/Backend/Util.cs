using Microsoft.Ajax.Utilities;

namespace Backend
{
    public sealed class Util
    {
        public static string getConnectionString()
        {
            var host = Environment.GetEnvironmentVariable("PV_DB_HOST") ?? throw new ArgumentException("PV_DB_HOST is missing");
            var port = Environment.GetEnvironmentVariable("PV_DB_PORT") ?? throw new ArgumentException("PV_DB_PORT is missing");
            var user = Environment.GetEnvironmentVariable("PV_DB_USER") ?? throw new ArgumentException("PV_DB_USER is missing");
            var password = Environment.GetEnvironmentVariable("PV_DB_PASSWORD") ?? throw new ArgumentException("PV_DB_PASSWORD is missing");
            var dbName = Environment.GetEnvironmentVariable("PV_DB_NAME") ?? throw new ArgumentException("PV_DB_NAME is missing");
            return $"Server={host};Port={port};User Id={user};Password={password};Database={dbName}";
        }

        public static string GetEnvironmentVariableSec(string varName)
        {
            try
            {
                return Environment.GetEnvironmentVariable(varName) ?? "";
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
