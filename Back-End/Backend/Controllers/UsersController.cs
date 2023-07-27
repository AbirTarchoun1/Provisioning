using Backend.DbContextBD;
using Backend.Models;
using Backend.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Backend.Services.UserService;
using System.Text.RegularExpressions;
using System.Text;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Backend.Dtos;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UsersController : ControllerBase

    {
        public static User user = new User();
        private readonly DataContext _context;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;



        public UsersController(DataContext context, IUserService userService, IConfiguration configuration)
        {
            _context = context;
            _userService = userService;
            _configuration = configuration;

        }



        /**************************************
         * 
         * Add New User
         * 
         * ********************/

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegisterRequest request)
        {

            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest("User already exists.");
            }

            // Check if the email address is valid
            if (!IsValidEmail(request.Email))
            {
                return BadRequest("Invalid email address.");
            }

            // Check password strength and confirm password match
            var pw = CheckPasswordStrength(request.Password);
            if (!string.IsNullOrEmpty(pw))
            {
                return BadRequest(new { Message = pw });
            }

            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new { Message = "Passwords did not match" });
            }
            CreatePasswordHash(request.Password,
               out byte[] passwordHash,
               out byte[] passwordSalt);

            // Create new user object
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Level = "user",
                UserStatus = "PENDING",
                //ProductId =1,
                Password = request.Password,
                ConfirmPassword = request.ConfirmPassword,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                PhoneNumber = request.PhoneNumber,
                LastModificatedDate = request.LastModificatedDate = DateTime.Now,
                CreatedDate = request.CreatedDate = DateTime.Now,


            };

            // Add user to database and save changes
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Registration Success" });
        }



        /**************************************
          * 
          * Add User From The Control Panel
          * @author Tarchoun Abir & Naweni Chaima
          * 
          * ***************/

        [HttpPost("AddUser")]
        public async Task<ActionResult<User>> Create(UserAddRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest(new
                {
                    Message = "Email already exists.!"
                });

            if (!IsValidEmail(request.Email))

                return BadRequest(new
                {
                    Message = "Invalid Email Address.!"
                });

            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest(new
                {
                    Message = "Email already exists.!"
                });


            var pw = CheckPasswordStrength(request.Password);
            if (!string.IsNullOrEmpty(pw))
            {
                return BadRequest(new
                {
                    Message = pw.ToString()
                });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Level = "user",
                Password = request.Password,
                UserStatus = "PENDING",
                //ProductId = 1,
                ConfirmPassword = request.ConfirmPassword,
                CreatedDate = request.CreatedDate = DateTime.Now,
                LastModificatedDate = request.LastModificatedDate = DateTime.Now,

            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration Success" });
        }


        /**************************************
         * 
         * Login when the UserStatus = "ACTIVE"
         * 
         * ***************/

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginRequest request)
        {
            if (request == null)
            {
                return BadRequest();
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
            {
                return Unauthorized(new
                {
                    Message = "User not found!"
                });
            }

            if (user.Username != request.Username || user.Password != request.Password)
            {
                return Unauthorized(new
                {
                    Message = "Invalid Username or Password!"
                });
            }

            if (user.UserStatus == "PENDING")
            {
                return Unauthorized(new
                {
                    Message = "Your Account is Still Not Active!"
                });
            }

            if (user.UserStatus == "BLOCKED")
            {
                return Unauthorized(new
                {
                    Message = "Your Account Is Blocked!"
                });
            }

            string token = GenerateJSONWebToken(user);

            if (token == null)
            {
                return StatusCode(500, new
                {
                    Message = "Failed to generate the authentication token."
                });
            }

            // Initialize properties if null
            user.Token ??= token;
            user.LoginHistory ??= new List<LoginHistory>();

            // Log the login history 
            user.LoginHistory.Add(new LoginHistory
            {
                UserId = user.UserId,
                LoginTime = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Token = user.Token,
                Role = user.Level,
                Username = user.Username,
                Email = user.Email
            });
        }


        /*******************************************************
         * 
         * Update Userstatus With  Sending  Email by SMTPClient
         * to user when the UserStatus is ACTIVE or BLOCKED 
         * 
         * @Athor Tarchoun Abir & Naweni Chaima 
         * 
         * 
         * ***************/


        [HttpPut("UpdateUserStatus")]
        public async Task<User> UpdateStatus(User user)
        {
            _context.Entry(user).State = EntityState.Modified;


            if (user.UserStatus == "ACTIVE")


            {
                string fromMail = "res21@tp-dev.net";
                string fromPassword = "dev2023!";

                MailMessage message = new MailMessage();
                message.Subject = "WELCOME TO TP PROVISIONING ";
                message.To.Add(new MailAddress(user.Email));
                message.Body = "HELLO " + user.Username + ",\n\n" +
                    "Your account has been activated. You can now log in to our system.\n\n" +
                    "Best regards,\n" +
                    "TECHNOLOGY PARTNERS ITALIA.\n" + "YOU CAN ACCESS TO APPLICATION FROM THIS LINK https://tp-prov.netlify.app/";

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(fromMail, "dbmcojewstjsyvzg"),
                    EnableSsl = true,
                };

                try
                {
                    await smtpClient.SendMailAsync(message);
                }
                catch (Exception ex)
                {
                    // Log the error or handle it in some other way
                    Console.WriteLine($"An error occurred while sending the email: {ex.Message}");
                }
            }


            if (user.UserStatus == "BLOCKED")
            {
                string fromMail = "res21@tp-dev.net";
                string fromPassword = "dev2023!";

                MailMessage message = new MailMessage();
                message.From = new MailAddress(fromMail);
                message.Subject = "Get Arrays, LLC - Blocked Account";
                message.To.Add(new MailAddress(user.Email));
                message.Body = "HELLO " + user.Username + ",\n\n" +
                    "We're sorry to inform you that your account has been blocked. For further information, please contact our customer support.\n\n" +
                    "Best regards,\n" +
                    "TECHNOLOGY PARTNERS ITALIA.";

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(fromMail, "dbmcojewstjsyvzg"),
                    EnableSsl = true,
                };

                try
                {
                    await smtpClient.SendMailAsync(message);
                }
                catch (Exception ex)
                {
                    // Log the error or handle it in some other way
                    Console.WriteLine($"An error occurred while sending the email: {ex.Message}");
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                ModelState.AddModelError("", "Unable to save change. " +
                    "Try again, if the problem persists, " +
                    "contact your system administrator.");
            }

            // Save the updated user to the database or other storage mechanism
            return user;
        }

        /**************************************
        * 
        * Strong Password 
        * 
        * ****/

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 4)
            {
                sb.Append("Minimum password length should be 8." + Environment.NewLine);
            }
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
            {
                sb.Append("Password should be Alphanumeric." + Environment.NewLine);
            }

            if (!(Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\],\\[,{,},?,:,;,|,',\\,.,/,~,`,-,=]")))
            {
                sb.Append("Password should contain special character." + Environment.NewLine);
            }
            return sb.ToString();
        }


        /**************************************
        * 
        * Validate Mail
        * 
        * **************/

        private bool IsValidEmail(string email)
        {
            // Define a regular expression pattern for email validation
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

            // Check if the email matches the pattern
            if (Regex.IsMatch(email, pattern))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**************************************
         * 
         * Forget Password
         * 
         * ****************/


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            await _context.SaveChangesAsync();

            return Ok("You may now reset your password.");
        }


        /********************************************
         * 
         * Reset Password
         * 
         * ****************************/


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResettPassword(ResetPasswordRequest request)
        {
            // var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == request.Token);
            // if (user == null || user.ResetTokenExpires < DateTime.Now)
            // {
            // return BadRequest("Invalid Token.");
            //  }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;
            await _context.SaveChangesAsync();
            return Ok("Password successfully reset.");
        }



        /**************************************
         * 
         *Authorization
         * 
         * ****/

        [HttpGet]
        public ActionResult<string> GetMe()
        {
            var userName = _userService.GetMyName();
            return Ok(userName);
        }


        /**************************************
         * 
         * Display List Users
         * 
         * ****/

        [HttpGet("GetAllUser")]

        public async Task<ActionResult<List<User>>> index()
        {
            var res = Ok(await _context.Users.ToListAsync());
            // var x = 2;
            return res;
        }


        /**************************************
         * 
         * Display One User 
         * 
         * ****/
        [Authorize]
        [HttpGet("{id}GetUserByOne")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            return Ok(user);

        }

        /**************************************
         * 
         *Find User By Email
         * 
         * ****/

        [HttpGet("GetUserByEmail")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound();
            }
            //
            return Ok(user);
        }
        /**************************************
        * 
        *Find User By UserName
        * 
        * ****/

        [HttpGet("GetUserByUserName")]
        public async Task<ActionResult<User>> GetUserByUserName(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        /**************************************
        * 
        *Find User By Created Date
        * 
        * ****/
        [HttpGet("GetUsersByCreatedDate")]
        public async Task<ActionResult<IEnumerable<User>>> GetByCreatedDate(DateTime createdDate)
        {
            var users = await _context.Users
                .Where(u => u.CreatedDate.Date == createdDate.Date)
                .ToListAsync();

            return Ok(users);
        }

        /**************************************
         * 
         * Find User By LastModificated Date
         * 
         * ****/
        [HttpGet("GetUsersByLastModificatedDate")]
        public async Task<ActionResult<IEnumerable<User>>> GetByLastModificatedDate(DateTime ModifDate)
        {
            var users = await _context.Users
                .Where(u => u.LastModificatedDate.Date == ModifDate.Date)
                .ToListAsync();

            return Ok(users);
        }


        /**************************************
         * 
         * Update USER Data 
         * 
         * ****/

        [HttpPut("UpdateUser/{id}")]
        public async Task<ActionResult<UserUpdateRequest>> UpdateUser(int id, UserUpdateRequest user)
        {
            var findUser = await _context.Users.FindAsync(id);

            if (findUser == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            findUser.Username = user.Username;
            findUser.Email = user.Email;



            findUser.LastModificatedDate = user.LastModificatedDate = DateTime.Now;





            _context.Entry(findUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                ModelState.AddModelError("", "Unable to save change. " +
                        "Try Again, if you have problem persists, " +
                        "Contact your system administrator");
            }


            return Ok(findUser);
        }
        /**************************************
        * 
        * Update Current User
        * 
        * ****/

        [HttpPut("UpdateCurrentUser")]

        public async Task<ActionResult<UserUpdateRequest>> UpdateCurrentUser(UserUpdateRequest user)
        {
            // Get the user ID of the currently authenticated user from the JWT token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);
            var currentUserId = userIdClaim?.Value;

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            // Find the user record in the database
            var findUser = await _context.Users.FindAsync(currentUserId);

            if (findUser == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Update the user properties
            findUser.Username = user.Username;
            findUser.Email = user.Email;
            findUser.LastModificatedDate = DateTime.Now;

            _context.Entry(findUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                ModelState.AddModelError("", "Unable to save change. " +
                        "Try Again, if you have problem persists, " +
                        "Contact your system administrator");
            }

            return Ok(findUser);
        }



        /**************************************
        * 
        * Update User Role
        * 
        * ****/

        [HttpPut("UpdateUserRole")]
        public async Task<ActionResult<UserUpdateRole>> UpdateUser(int id, UserUpdateRole user)
        {
            var findUser = await _context.Users.FindAsync(id);

            if (findUser == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            findUser.Level = user.Level;
            _context.Entry(findUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                ModelState.AddModelError("", "Unable to save change. " +
                        "Try Again, if you have problem persists, " +
                        "Contact your system administrator");
            }

            return Ok(findUser);
        }



        /**************************************
         * 
         * Delete USER
         * 
         * ****/



        [HttpDelete("DeleteUser/{id}")]

        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'MyDbContext.Users'  is null.");
            }
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        /*************************************
        * 
        * Create Password Hashed
        * 
        * ********/

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac
                    .ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        /************************************
         * 
         * Verif PASSWORD HASH
         * 
         * ****/

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        
        // Generate Token
        private string GenerateJSONWebToken(User userInfo)
        {
            var key = _configuration["JWT:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("JWT:Key is missing or empty in appsettings.json.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, userInfo.Username),
        new Claim(JwtRegisteredClaimNames.Email, userInfo.Email),
        new Claim("DateOfJoing", userInfo.CreatedDate.ToString("yyyy-MM-dd")),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var issuer = _configuration["JWT:Issuer"];
            var audience = _configuration["JWT:Audience"];

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        /************************************
         * 
         * Refrech Token 
         * 
         * ***********/

        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        /***************************************
         * 
         * Set Refresh Token
         * 
         * 
         * 
         * *********/


        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);

            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;
        }


        /***************************
         * 
         *  Login History per users
         * 
         * **************************/


        [HttpGet("GetAllUsersLoginHistory")]
        public async Task<IActionResult> GetUsersLoginHistory()
        {
            var users = await _context.Users.Include(u => u.LoginHistory).ToListAsync();

            // Create a response object to hold the user details along with login history
            var response = users.Select(u => new UserLoginHistoryResponse
            {
                UserId = u.UserId,
                Username = u.Username,
                Email = u.Email,
                LoginHistory = u.LoginHistory.ToList() // Use ToList() to get the collection of LoginHistory objects
            }).ToList();

            // Return the response with status code 200 (OK)
            return Ok(response);
        }




        [HttpGet("GetCurrentUser")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            // Get the current user's claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var usernameClaim = User.FindFirst(ClaimTypes.Name);
            var roleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
            {
                var errorMessage = new ErrorMessage
                {
                    Message = "Invalid user information in the token."
                };

                // Return JSON response with status code 401 (Unauthorized)
                return Unauthorized(errorMessage);
            }

            // Create and return a User object
            var currentUser = new User
            {
                UserId = currentUserId,
                Username = usernameClaim?.Value,
                Level = roleClaim?.Value
            };

            // Return JSON response with status code 200 (OK)
            return Ok(currentUser);
        }


        public class ErrorMessage
        {
            public string Message { get; set; }
        }

    }
}








