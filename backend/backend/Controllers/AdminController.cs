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
				(r.Approved == null) select new { id=r.Id, unit_id=r.Item.Id, unit=r.Item.Name, submittedBy = r.Renter,  };
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
		public async Task<ActionResult<Object>> GetUnit()
		{
			var admins = await (from m in _context.Managers select m.Username).ToListAsync();
			var units = await (from u in _context.Organizations select u.Name).ToListAsync();
			var types = new List<string>(["Item", "Room"]);
			var categories = new List<string>(["Hai Shield Beetle"]);
			return new { admins, units, types, categories };
		}
		[HttpGet("get_organizations")]
		[Authorize]
		public async Task<ActionResult<IEnumerable<Object>>> GetOrgs()
		{
			var orgy = from o in _context.Organizations select new { id=o.Id, name=o.Name };
			return await orgy.ToListAsync();
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
			var i = new Item { DateAdded = DateTime.UtcNow, Description = item.description, ImagePath = image.FileName,
				AttachedDocuments = (from f in files select (f.FileName)).ToList(), 
				Location = item.location, Manager = (from m in _context.Managers where m.Username == item.guardian select m).FirstOrDefault(), 
				Name = item.name, Specs = item.technical, 
				Organivzation = (from o in _context.Organizations where o.Name == item.unit select o).FirstOrDefault(), TermsOfUse = item.exploration, Type = item.itemType};
			await _context.AddAsync(i);
			await _context.SaveChangesAsync();
			return Created();
		}
		[HttpDelete("delete_reservation/{*id}")]
		[Authorize]
		[AdminAccess("id")]
		public async Task<ActionResult> DeleteReservation(int id)
		{
			var res = await _context.Requests.FirstOrDefaultAsync(r => r.Id == id);
			if (res == null)
			{
				return NotFound();
			}
			_context.Remove(res);
			await _context.SaveChangesAsync();
			return Ok();
		}
		

		[HttpGet("get_admins")]
		[Authorize]
		public async Task<ActionResult<List<Object>>> GetAdmins()
		{
			var admins = from a in _context.Managers.Include(a => a.Organizations) select a.ToJSON();
			return await admins.ToListAsync();
		}

		[HttpPost("modify_organizations/")]
		[Authorize]
		public async Task<ActionResult> ChangeAdminOrgs([FromBody] JovialMerryment kon)
		{
			string name = User.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;
			var m = await _context.Managers.FirstOrDefaultAsync(d => d.Username == name);
			if (m == null)
			{
				return Unauthorized();
			}
			foreach (var o in kon.organizations)
			{
				if (!_context.Organizations.Include(o => o.Admins).First(a => a.Name == o).Admins.Any(a => a.Username == name) && !m.GlobalAdmin)
				{
					return Unauthorized();
				}
			}
			var dudu = await _context.Managers.FirstOrDefaultAsync(d => d.Username == name);
			if (dudu == null)
			{
				return BadRequest();
			}
			var orgy_dobavit = await (from o in _context.Organizations.Include(o => o.Admins) where (!o.Admins.Contains(dudu) && kon.organizations.Contains(o.Name)) select o).ToListAsync();
			dudu.Organizations.AddRange(orgy_dobavit);
			_context.Managers.Update(dudu);
			await _context.SaveChangesAsync();
			return Ok();
		}
		[HttpPost("create_organization/")]
		[Authorize]
		[AdminAccess("global")]
		public async Task<ActionResult> Create_Organization(string orgname)
		{
			var org = new Organization { Name = orgname, Admins = new List<Manager>() };
			await _context.AddAsync(org);
			await _context.SaveChangesAsync();
			return Ok();
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

	public class JovialMerryment
	{
		public List<string> organizations { get; set; }
		public string id { get; set; }
	}
}
