using System.Security.Claims;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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
		public async Task<ActionResult<IEnumerable<Object>>> GetItems(int page = 1, int pageSize = 0)
        {
			//More params will be added on demand from frontend team
			return await (from i in _context.Items select i.GetItemJSON(false)).ToListAsync(); ;
        }
		[HttpGet("get_item/{*id}")]
		public async Task<ActionResult<Object>> GetItem(int id)
		{
			var item = from i in _context.Items.Include(i => i.Manager).
				Include(i => i.Organivzation) where (i.Id == id) select i.GetItemJSON(true);
			return await item.FirstOrDefaultAsync();
		}
		[HttpGet("get_breadcrumbs/{*id}")]
		public async Task<ActionResult<Object>> GetBS(int id)
		{
			var item = from i in _context.Items.Include(i => i.Manager).
				Include(i => i.Organivzation)
					   where (i.Id == id)
					   select new { id = i.Id, name = i.Name, description = i.Organivzation.Name + " * " + i.Type }
			;
			return await item.FirstOrDefaultAsync();
		}
		//Get_documentation will be added later after discussions with our frontend team
		[HttpGet("get_comments/{*id}")]
		public async Task<ActionResult<IEnumerable<Object>>> GetComments(int id)
		{
			var comments = _context.Comments.Include(a => a.Item).Where(a => a.Item.Id == id).OrderByDescending(a => a.Created);
			return await (from c in comments select c.ToJSON()).ToListAsync();
		}

		
		[Authorize]//IMPORTANT:Add check that the user is the one leaving the comment. Or, even better, make the comment display user's name
		[HttpPost("add_comment")]
		public async Task<ActionResult> AddComment(NewComment comment)
		{
			Comment commentToAdd = new Comment() {Author = User.Claims.First(claim => claim.Type == ClaimTypes.Email).Value, 
				Contents = comment.text, Created = comment.date, 
				Item = await _context.Items.FirstOrDefaultAsync(a => a.Id == comment.item_id)};
			_context.Comments.Add(commentToAdd);
			await _context.SaveChangesAsync();
			return CreatedAtAction("AddComment", new { id = commentToAdd.Id }, comment);
		}
		[HttpGet("photos/{*filename}")]
		public async Task<FileResult> RetrievePhoto(string filename)
		{
			var image_path = (configuration.GetSection("Storage").GetValue<string>("Images") ?? "") + filename;
			var provider = new FileExtensionContentTypeProvider();
			if (!provider.TryGetContentType(image_path, out var content_type))
			{
				content_type = "application/octet-stream";
			}
			return PhysicalFile(Path.GetFullPath(image_path), content_type);
		}
		[HttpGet("files/{*filename}")]
		public async Task<FileResult> RetrieveFile(string filename)
		{
			var image_path = (configuration.GetSection("Storage").GetValue<string>("Files") ?? "") + filename;
			var provider = new FileExtensionContentTypeProvider();
			if (!provider.TryGetContentType(image_path, out var content_type))
			{
				content_type = "application/octet-stream";
			}
			return PhysicalFile(Path.GetFullPath(image_path), content_type);
		}
	}  

    public class NewComment
    {
	    public int item_id {get; set;}
	    public string author {get; set;}
	    public string text {get; set;}
	    public DateTime date {get; set;}
    }
}
