using backend.Attributes;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
		public async Task<ActionResult> AddPost([FromBody] PostData d)
		{
			var username = User.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;
			Post p = new Post { Author = _context.Managers.Where(m => m.Username == username).First(), Title = d.title, Text = d.content, Link = d.link, ButtonText = "Więcej", Image = "/src/assets/img/building.jpg", Highlight = false };
			await _context.Posts.AddAsync(p);
			await _context.SaveChangesAsync();
			return Ok();
		}

		[HttpGet("get_news/")]
		public async Task<ActionResult<List<Object>>> GetNews()
		{
			return await (from p in _context.Posts select p.ToJSON()).ToListAsync();
		}

	}
}

public class PostData
{
	public string title { get; set; }
	public string link { get; set; }
	public string content { get; set; }
}
