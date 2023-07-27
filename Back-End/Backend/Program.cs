using Backend;
using Backend.DbContextBD;
using Backend.Repositories;
using Backend.Services.UserService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Npgsql;
using Serilog;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Read the environment variables directly
//var host = Util.GetEnvironmentVariableSec("PV_DB_HOST");
//var port = Util.GetEnvironmentVariableSec("PV_DB_PORT");
//var user = Util.GetEnvironmentVariableSec("PV_DB_USER");
//var password = Util.GetEnvironmentVariableSec("PV_DB_PASSWORD");
//var dbName = Util.GetEnvironmentVariableSec("PV_DB_NAME");

// Construct the connection string
//var connectionString = $"Server={host};Port={port};User Id={user};Password={password};Database={dbName}";


/* the log is written inside the docker image!
// Logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("wwwroot/Log/log.txt")
    .WriteTo.PostgreSQL(connectionString: connectionString, tableName: "logs", needAutoCreateTable: true)
    .CreateLogger();
*/

builder.Host.UseSerilog();

// Configuration

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", true)
    .AddJsonFile("Properties/launchSettings.json", true) // Add the launchSettings.json file
    .Build();


var jwtKey = configuration["JWT:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    jwtKey = GetOrCreateJwtKey(configuration);
}

var connectionString = configuration.GetValue<string>("profiles:Backend:environmentVariables:DefaultConnection");


/**************************************
   * 
   * accept dateTime
   * 
   * ***************/

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);


// Services
builder.Services.AddLogging();
builder.Services.AddScoped<IModuleRepository, ModuleRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();

// Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("latest", new OpenApiInfo { Title = "API", Version = "latest" });

    // Add support for JWT authentication in Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add JWT authentication with your key and configure validation parameters
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["JWT:Issuer"],
            ValidAudience = configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("NgOrigins", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// App
var app = builder.Build();

// Middleware
app.UseRouting();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.RoutePrefix = "swagger";
    c.SwaggerEndpoint("latest/swagger.json", "API v1");
});

app.UseSerilogRequestLogging();
app.UseCors("NgOrigins");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.UseRouting();

app.UseStaticFiles();

app.MapControllers();

app.Run();

// Method to generate or retrieve the JWT key
string GetOrCreateJwtKey(IConfiguration configuration)
{
    var jwtSection = configuration.GetSection("JWT");
    var jwtKey = jwtSection["Key"];

    if (string.IsNullOrEmpty(jwtKey))
    {
        // If the key is not present, generate a new key
        jwtKey = GenerateRandomKey();

        // Encrypt the key to ensure security
        var encryptedJwtKey = ProtectJwtKey(jwtKey);

        // Update the configuration with the encrypted key
        jwtSection["Key"] = encryptedJwtKey;

        // Save the configuration back to the appsettings.json file
        var configPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
        var configJson = File.ReadAllText(configPath);
        dynamic configObj = JsonConvert.DeserializeObject(configJson);
        configObj["JWT"]["Key"] = encryptedJwtKey;
        configObj["JWT"]["Issuer"] = jwtSection["Issuer"];
        configObj["JWT"]["Audience"] = jwtSection["Audience"];
        File.WriteAllText(configPath, JsonConvert.SerializeObject(configObj, Formatting.Indented));

        // Reload the configuration to apply the changes
        configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true)
            .AddJsonFile("Properties/launchSettings.json", true)
            .Build();
    }
    else
    {
        // If the key is present, decrypt it to get the original value
        jwtKey = UnprotectJwtKey(jwtKey);
    }

    return jwtKey;
}

// Method to generate a random key (128 bits = 16 bytes)
string GenerateRandomKey()
{
    using var rng = new RNGCryptoServiceProvider();
    var randomKey = new byte[16];
    rng.GetBytes(randomKey);
    return Convert.ToBase64String(randomKey);
}

// Method to protect the JWT key using ProtectedData
string ProtectJwtKey(string jwtKey)
{
    var unprotectedData = Encoding.UTF8.GetBytes(jwtKey);
    var protectedData = ProtectedData.Protect(unprotectedData, null, DataProtectionScope.CurrentUser);
    return Convert.ToBase64String(protectedData);
}

// Method to unprotect the JWT key using ProtectedData
string UnprotectJwtKey(string protectedJwtKey)
{
    var protectedData = Convert.FromBase64String(protectedJwtKey);
    var unprotectedData = ProtectedData.Unprotect(protectedData, null, DataProtectionScope.CurrentUser);
    return Encoding.UTF8.GetString(unprotectedData);
}