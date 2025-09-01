using CAS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CAS.Controllers
{
    public class CASController : Controller
    {
		DefaultsService _defaults;
		public CASController(DefaultsService defaults)
		{
			_defaults = defaults;
		}
        public IActionResult Login()
        {
            return View();
        }

		public static string IssueToken(string auth_token, TokenValidationParameters validation_parameters, ILogger logger, IConfiguration configuration)
		{
			var handler = new JwtSecurityTokenHandler();
			SecurityToken validation_result;
			ClaimsPrincipal result;
			try
			{
				result = handler.ValidateToken(auth_token, validation_parameters, out validation_result);//What the hell is principal???
			}
			catch (Exception e)//No need to be smart here, if there's an exception, the token is invalid and that's all the user needs to know.
			{
				logger.Log(LogLevel.Error, "User token was invalid. Reason: {Message}", e.Message);//Shoutout to SCR
				throw;
			}
			var claims = new[]
		   {
				new Claim(JwtRegisteredClaimNames.Email, result.Claims.First(key => key.Value == "user").Value)
			};
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("Authenthication__Key") ?? ""));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				issuer: configuration.GetValue<string>("Authenthication__Issuer"),
				audience: configuration.GetValue<string>("Authenthication__Audience"),
				claims: claims,
				expires: DateTime.Now.AddMonths(1),
				signingCredentials: creds);
			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		[HttpPost("/login")]
        public async Task<IActionResult> LoginPost(string username, string password)
        {
			var claims = new[]
		   {
				new Claim("user", username)
			};
			var secretKey = await _defaults.GetKeyAsync();
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				issuer: "Politechnika Lodzka",
				audience: "IMSI",
				claims: claims,
				expires: DateTime.Now.AddMinutes(10),
				signingCredentials: creds);
			string mock_token = new JwtSecurityTokenHandler().WriteToken(token);
			return Redirect($"https://localhost:7065/login?token={mock_token}");
        }
	}
}
