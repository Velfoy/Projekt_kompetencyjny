using backend.Auth;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security;
using System.Security.Claims;

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
		[HttpGet("get_history/{*email}")]
        public async Task<IEnumerable<Request>>GetHistory(string email)
        {
            return await (from r in _context.Requests where r.Renter == email select r).ToListAsync();
        }
		[HttpGet("whoami")]
		[Authorize]
		public async Task<Object> GetUsername()
		{
			string name = User.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;
			if (name == "admin")
			{
				_context.Managers.Add(new Manager { Username = "admin" });
				_context.SaveChanges();
            }
            string r = (_context.Managers.Where(u => u.Username == name).Any()) ? "admin" : "user";
            return new { username = name, role= r};
		}
		[HttpGet("/login")]
		public async Task<IActionResult> Login(string token)
		{
			string internal_token;
			try
			{
				internal_token = JWTIssuer.IssueToken(token, _validation_parameters, _logger, _configuration);
			} catch (Exception)//There is no universal exception for JWT-related issues Microsoft what the hell???
			{
				return Unauthorized();
			}
			CookieOptions options = new CookieOptions
			{
				Expires = DateTime.Now.AddMonths(1),
				IsEssential = true,
				Secure = true
			};
			Response.Cookies.Append("auth_token", internal_token);
			//return Content($"Authorized as {JWTIssuer.ReadToken(token, _validation_parameters, _logger).Claims.FirstOrDefault(claim => claim.Type == "user")}");
			return Redirect($"{_configuration.GetSection("SiteAddresses").GetValue<string>("frontend") ?? "https://localhost:5173"}/storagetoken?token={internal_token}");
		}
    }
}
