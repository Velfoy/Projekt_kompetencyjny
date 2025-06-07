using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
		private readonly Context _context;
		private readonly ILogger _logger;
		private readonly IConfiguration _configuration;

		private readonly TokenValidationParameters _validation_parameters;
		public UserController(Context _context, ILogger<UserController> logger, IConfiguration configuration, TokenValidationParameters validation_parameters)
		{
			this._context = _context;
			_logger = logger;
			this._configuration = configuration;
			this._validation_parameters = validation_parameters;
		}
		[HttpGet("/get_history/{*email}")]
        public async Task<IEnumerable<Request>>GetHistory(string email)
        {
            return await (from r in _context.Requests where r.Renter == email select r).ToListAsync();
        }

		[HttpGet("/get_comments/{*email}")]
		public async Task<IEnumerable<Comment>> GetComments(string email)
		{
			return await (from r in _context.Comments where r.Author == email select r).ToListAsync();
		}
		[HttpGet("/login")]
		public async Task<ContentResult> Login(string token)
		{
			return Content($"Successfully authenthicated with token {token}");
		}
	}
}
