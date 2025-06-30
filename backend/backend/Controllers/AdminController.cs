using backend.Attributes;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using System.Security.Claims;

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
				(r.Approved == null) select new { id=r.Id, unit_id=r.Item.Id, unit=r.Item.Description, submittedBy = r.Renter,  };
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


		[HttpDelete("delete_item/{*id}")]
		[Authorize]
		//[AdminAccess("item")]
		public async Task<ActionResult> DeleteItem(int id)
		{
			if (_context.Items.Include(i => i.Organivzation).ThenInclude(o => o.Admins).Where(i => i.Id == id).FirstOrDefault().Organivzation.Admins.Any(m => m.Username == User.Claims.First(claim => claim.Type == ClaimTypes.Email).Value))
			{
				_context.Items.Remove(_context.Items.First(i => i.Id == id));
				await _context.SaveChangesAsync();
				return Ok();
			}
			return Unauthorized();
		}

		[HttpGet("get_unit_data")]
		[Authorize]
		public async Task<ActionResult<Object>> GetAdmins()
		{
			var admins = await (from m in _context.Managers select m.Username).ToListAsync();
			var units = await (from u in _context.Organizations select u.Name).ToListAsync();
			var types = new List<string>(["Item", "Room"]);
			var categories = new List<string>(["Hai Shield Beetle"]);
			return new { admins, units, types, categories };
		}
		[HttpPost("create_item")]
		[Authorize]
		[Consumes("multipart/form-data")]
		public async Task<ActionResult> CreateItem([FromForm] ItemForm item, IFormFile image, List<IFormFile> files)
		{
			var image_path = _configuration.GetSection("Storage").GetValue<string>("Images") ?? "";
			var image_stream = new FileStream(image_path + image.FileName, FileMode.Create);//Possible vulnerability
			image.CopyToAsync(image_stream);
			var files_path = _configuration.GetSection("Storage").GetValue<string>("Files") ?? "";
			foreach (var file in files)
			{
				var file_stream = new FileStream(files_path + file.FileName, FileMode.Create);
			}
			var e = (from f in files select (files_path + f.FileName)).ToList();
			var i = new Item { DateAdded = DateTime.UtcNow, Description = item.description, ImagePath = image_path + image.FileName,
				AttachedDocuments = (from f in files select (files_path + f.FileName)).ToList(), 
				Location = item.location, Manager = (from m in _context.Managers where m.Username == item.guardian select m).FirstOrDefault(), 
				Name = item.name, Specs = item.technical, 
				Organivzation = (from o in _context.Organizations where o.Name == item.unit select o).FirstOrDefault(), TermsOfUse = item.exploration, Type = item.itemType};
			await _context.AddAsync(i);
			await _context.SaveChangesAsync();
			return Created();
		}

		[HttpGet("/seed")]
        //[AdminAccess("global")]
        public async Task<ActionResult<string>> Seed()
        {
	        Seed_database.CreateItems(_context);
	        return "Made";
        }
    }

	public class ItemForm
	{
		public string name { get; set; }

		public string unit { get; set; }

		public string guardian { get; set; }

		public string reservationType { get; set; }

		public string itemType { get; set; }

		public string location { get; set; }

		public string description { get; set; }

		public string exploration { get; set; }

		public string technical { get; set; }
	}
}
