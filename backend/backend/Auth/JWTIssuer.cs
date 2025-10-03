using backend.Services;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security;
using System.Security.Claims;
using System.Text;

namespace backend.Auth
{
	public class JWTIssuer
	{
		//validation_parameters - stuff we're gonna validate the token against. Contains Politechnika CAS signing key, options to validate time of issuing and other stuff
		//	In this case, we only care about the key and if the token has not expired though. We're not even sure if CAS even provides us with the issuer and audience tbh.
		//auth_token - a Json Web Token we get from CAS.
		//logger - thing that keeps log of everything that has happened.
		public static async Task<string> IssueToken(string auth_token, VerificationService validator, ILogger logger, IConfiguration configuration)
		{
			var result = await validator.ValidateTokenAsync(auth_token);
			var claims = new[]
		   {
				new Claim(JwtRegisteredClaimNames.Email, result)
			};
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Authenthication").GetValue<string>("Key") ?? ""));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				issuer: configuration.GetSection("Authenthication").GetValue<string>("Issuer"),
				audience: configuration.GetSection("Authenthication").GetValue<string>("Audience"),
				claims: claims,
				expires: DateTime.Now.AddMonths(1),
				signingCredentials: creds);
			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
