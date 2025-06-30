using backend.Attributes;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/news")]
    [ApiController]
    public class NewsController : ControllerBase
    {
		private readonly Context _context;
		private readonly ILogger _logger;
		private readonly IConfiguration configuration;
		public NewsController(Context _context, ILogger<ReservstionsController> logger, IConfiguration configuration)
		{
			this._context = _context;
			_logger = logger;
			this.configuration = configuration;
		}

		[HttpPost("add_post/")]
		[Authorize]
		[AdminAccess("global")]
		public async Task<ActionResult> AddPost()
		{

			return Ok();
		}

		[HttpGet("get_news/")]
		public async Task<ActionResult<List<Object>>> GetNews()
		{
			return await (from p in _context.Posts select p.ToJSON()).ToListAsync();
		}

	}
}
