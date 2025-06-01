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
        public ReservstionsController(Context _context)
        {
            this._context = _context;
        }
        [HttpGet("get_reservations")]
        public async Task<ActionResult<IEnumerable<Request>>> GetReservations(int page = 1, int pageSize = 0,
            bool? completed = null, bool? approved = null,
            string userId = "", int itemId = 0) {
            var res = from r in _context.Requests where 
                      ((completed == null) ? ((completed ?? true) ? r.Approved != (!completed ?? null) : r.Approved == null) : true)&&
                      ((userId == "") ? true : r.Renter == userId)&&
                      ((itemId == 0)? true : r.Item.Id == itemId)
                      select r;
            if (pageSize == 0)
            {
                return await res.ToListAsync();
            }
            return await res.Skip(pageSize*(page - 1)).Take(pageSize).ToListAsync();
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
            await _context.AddAsync(r);
            return "Made";
        }
	}
}
