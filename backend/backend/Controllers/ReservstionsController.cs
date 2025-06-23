using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservstionsController : ControllerBase
    {
        private readonly Context _context;
		private readonly ILogger _logger;
		private readonly IConfiguration configuration;
		public ReservstionsController(Context _context, ILogger<ReservstionsController> logger, IConfiguration configuration)
		{
			this._context = _context;
			_logger = logger;
			this.configuration = configuration;
		}

		[HttpGet("get_reservations")]
        public async Task<ActionResult<IEnumerable<Object>>> GetReservations(int page = 1, int pageSize = 0,
            bool? completed = null, bool? approved = null,
            string userId = "", int itemId = 0) {
            var res = from r in _context.Requests.Include(r => r.Item).Include(r => r.Item.Organivzation) where 
                      ((completed == null) ? ((completed ?? true) ? r.Approved != (!completed ?? null) : r.Approved == null) : true)&&
                      ((userId == "") ? true : r.Renter == userId)&&
                      ((itemId == 0)? true : r.Item.Id == itemId)
                      select r;
            //_context.Requests.Add(new Request { Approved = true, Item = null,})
            if (pageSize == 0)
            {
                return await (from reservation in res select reservation.ToJSON()).ToListAsync();
            }


            return await (from reservation in (res.Skip(pageSize*(page - 1)).Take(pageSize)) select reservation.ToJSON()).ToListAsync();//This is one of my favorite lines in this project ngl
        }
        [HttpPost("accept/{*id}")]
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
        [HttpPost("make_reservation")]
        public async Task<ActionResult<string>> MakeReservation(Request r)
        {
            //Placeholder for now, will be changed on demand of frontend team
            //{}
            await _context.AddAsync(r);
            return "Made";
        }
		//get_timespans_for_item

		[HttpGet("/seed")]
		public async Task<ActionResult<string>> Seed()
		{
			//Placeholder for now, will be changed on demand of frontend team
			//{}
			Seed_database.CreateItems(_context);
			return "Made";
		}
	}
}
