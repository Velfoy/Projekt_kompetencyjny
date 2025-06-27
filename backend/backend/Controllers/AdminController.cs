using backend.Attributes;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
	[Route("api/admin")]
	[ApiController]
	public class AdminController : ControllerBase
    {

		private readonly Context _context;
		private readonly ILogger _logger;
		private readonly IConfiguration _configuration;
		public AdminController(Context _context, ILogger<ReservstionsController> logger, IConfiguration configuration)
		{
			this._context = _context;
			_logger = logger;
			this._configuration = configuration;
		}
		[HttpGet("get_reservations")]
		public async Task<ActionResult<IEnumerable<Object>>> GetReservations()
        {
			var res = from r in _context.Requests.Include(r => r.Item).Include(r => r.Item.Organivzation) where
				(_context.Organizations.Contains(r.Item.Organivzation)) select new { id=r.Id, unit_id=r.Item.Id, unit=r.Item.Description, submittedby=r.Renter };
            return await res.ToListAsync();
        }
        [HttpPost("accept/{*id}")]
        [Authorize]
        [AdminAccess("*id")]
        public async Task<ActionResult<string>> Accept(int id)
        {
	        try {
		        Context.ChangeStatus(true, _context, id);
	        } catch(InvalidOperationException)
	        {
		        return NotFound();
	        }
	        return "Request successfully approved";
        }

        [HttpPost("deny/{*id}")]
        [Authorize]
        [AdminAccess("*id")]
        public async Task<ActionResult<string>> Deny(int id)
        {
	        try
	        {
		        Context.ChangeStatus(false, _context, id);
	        }
	        catch (InvalidOperationException)
	        {
		        return NotFound();
	        }
	        return "Request successfully approved";
        }
        
        [HttpGet("/seed")]
        [AdminAccess("global")]
        public async Task<ActionResult<string>> Seed()
        {
	        Seed_database.CreateItems(_context);
	        return "Made";
        }
    }
}
