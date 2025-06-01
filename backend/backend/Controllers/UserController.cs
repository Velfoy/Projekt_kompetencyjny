using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
		private readonly Context _context;
		public UserController(Context _context)
		{
			this._context = _context;
		}
		[HttpGet("/{*email}/get_history")]
        public async Task<IEnumerable<Request>>GetHistory(string email)
        {
            return await (from r in _context.Requests where r.Renter == email select r).ToListAsync();
        }

		[HttpGet("/{*email}/get_comments")]
		public async Task<IEnumerable<Comment>> GetComments(string email)
		{
			return await (from r in _context.Comments where r.Author == email select r).ToListAsync();
		}
	}
}
