using ActiveUp.Net.Mail;
using Backend.DbContextBD;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {

        private readonly DataContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;


        public ContactController(DataContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;

        }

        [HttpPost("addNewContact")]
        public async Task<ActionResult<Contact>> Create(Contact request)
        {

            var contact = new Contact
            {
                Email = request.Email,
                Object = request.Object,
                Text = request.Text,
                LastModificatedDate = request.LastModificatedDate,
                CreatedDate = request.CreatedDate,
                CompanyName = request.CompanyName


            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Message Send Succesfully!"
            });
        }
        [HttpGet("GetAllContacts")]
        public async Task<ActionResult<List<Contact>>> index()
        {
            return Ok(await _context.Contacts.ToListAsync());
        }

        [HttpGet("{id}GetContactByOne")]
        public async Task<ActionResult<Contact>> GetById(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            return Ok(contact);

        }
    }
}
