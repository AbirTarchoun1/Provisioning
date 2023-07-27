using NpgsqlTypes;
using Serilog.Events;
using Serilog.Sinks.PostgreSQL;

namespace Backend.Middleware
{
    public class CustomColumnWriter : ColumnWriterBase
    {
        public CustomColumnWriter(NpgsqlDbType dbType) : base(dbType) { }

        public override object GetValue(LogEvent logEvent, IFormatProvider formatProvider = null)
        {

            // Implement your logic to retrieve the raw value for the custom column from the log event
            // For example, if you want to extract a property value:
            if (logEvent.Properties.TryGetValue("CustomProperty", out var customPropertyValue) && customPropertyValue != null)
            {
                return customPropertyValue.ToString();
            }
            return null;
        }
    }
}
