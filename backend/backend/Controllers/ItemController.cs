using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
		private readonly Context _context;
		private readonly ILogger _logger;
		private readonly IConfiguration configuration;
		public ItemController(Context _context, ILogger<ItemController> logger, IConfiguration configuration)
		{
			this._context = _context;
			_logger = logger;
			this.configuration = configuration;
		}
		[HttpGet("get_items")]
		public async Task<ActionResult<IEnumerable<Item>>> GetItems(int page = 1, int pageSize = 0)
        {
			//More params will be added on demand from frontend team
			return await _context.Items.Skip(pageSize * (page - 1)).Take(pageSize).ToListAsync(); ;
        }
		[HttpGet("get_item/{*id}")]
		public async Task<ActionResult<Item>> GetItem(int id)
		{
			var item = from i in _context.Items.Include(a => a.Comments) select i;
			return await item.FirstOrDefaultAsync();
		}
		//Get_documentation will be added later after discussions with our frontend team
		[HttpGet("get_comments/{*id}")]
		public async Task<ActionResult<IEnumerable<Object>>> GetComments(int id)
		{
			return await _context.Comments.Include(a => a.Item).Where(a => a.Item.Id == id).ToListAsync();
		}
	}
}
