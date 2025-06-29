using backend.Attributes;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
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
                      ((userId == "") ? true : r.Renter == userId)&&
                      ((itemId == 0)? true : r.Item.Id == itemId)
                      select r;
            //_context.Requests.Add(new Request { Approved = true, Item = null,})
            if (pageSize == 0)
            {
	            var l = await (from reservation in res select reservation.ToJSON()).ToListAsync();
                return l;
            }


            return await (from reservation in (res.Skip(pageSize*(page - 1)).Take(pageSize)) select reservation.ToJSON()).ToListAsync();//This is one of my favorite lines in this project ngl
        }

        [HttpGet("get_reservation_with_timespans/{*id}")]
		public async Task<ActionResult<IEnumerable<Object>>> GetReservationTimespans(int id)
		{
                
                var timespans = from ts in _context.Timespans.Include(t => t.Request).ThenInclude(r => r.Item) where ts.Request.Item.Id == id select new {
                    day = $"{ts.Start.Day:D2}.{ts.Start.Month:D2}.{ts.Start.Year:D4}",
                    startHour = ts.Start.Hour,
                    startMinute = ts.Start.Minute,
                    endHour = ts.End.Hour,
                    endMinute = ts.End.Minute,
                    title = ts.Request.Title,
                    userName = ts.Request.Renter,
                    status = ts.Request.ApprovalStatus
                };
            return timespans.ToList();
        }

		[HttpGet("get_timespans/{*id}")]
        public async Task<IEnumerable<Object>> GetDatetimes(int id)
        {
	        var requests = (from res in _context.Requests.Include(r => r.RequestPeriod) where res.Id == id select res).FirstOrDefault();
	        return (from ts in requests.RequestPeriod
		        select ts.ToJSON());
        }//There is an extremely goofy feature in C# that lets you call async on db query and also apparently to return the result as an ActionResult.
         //You can't do that with regular LINQ, as I had pleasure to just discover.
         //xd.
        [HttpPost("make_reservation")]
        public async Task<ActionResult<string>> MakeReservation(Request r)
        {
            //Placeholder for now, will be changed on demand of frontend team
            //{}
            await _context.AddAsync(r);
            return "Made";
        }
		//get_timespans_for_item
	}
}
