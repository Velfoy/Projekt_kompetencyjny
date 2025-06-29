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
				(_context.Organizations.Contains(r.Item.Organivzation)&&r.Approved == null) select new { id=r.Id, unit_id=r.Item.Id, unit=r.Item.Description, submittedBy = r.Renter,  };
            return await res.ToListAsync();
        }
        [HttpPost("accept/{*id}")]
        [Authorize]
        [AdminAccess("id")]
        public async Task<ActionResult<string>> Accept(int id)
        {
	        try {
		        await Context.ChangeStatus(true, _context, id);
	        } catch(InvalidOperationException)
	        {
		        return NotFound();
	        }
	        return "Request successfully approved";
        }

        [HttpPost("deny/{*id}")]
        [Authorize]
        [AdminAccess("id")]
        public async Task<ActionResult<string>> Deny(int id)
        {
	        try
	        {
		        await Context.ChangeStatus(false, _context, id);
	        }
	        catch (InvalidOperationException)
	        {
		        return NotFound();
	        }
	        return "Request denied";
        }

		[HttpDelete("delete_reservations/")]
		[Authorize]
		[AdminAccess("global")]
		public async Task<ActionResult> DeleteReservations(List<int> ids)
		{
			int deleted = await _context.Requests.Include(a => a.RequestPeriod).Where(a => ids.Contains(a.Id)).ExecuteDeleteAsync();
			return Ok(deleted);
		}

		[HttpDelete("delete_all_reservations/")]
		[Authorize]
		[AdminAccess("global")]
		public async Task<ActionResult> PurgeReservations()
		{
			int deleted = await _context.Requests.Include(a => a.RequestPeriod).ExecuteDeleteAsync();
			return Ok(deleted);
		}

		[HttpGet("/seed")]
        //[AdminAccess("global")]
        public async Task<ActionResult<string>> Seed()
        {
	        Seed_database.CreateItems(_context);
	        return "Made";
        }
    }
}
