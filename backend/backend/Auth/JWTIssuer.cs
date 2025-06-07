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
		//token - a Json Web Token we get from CAS.
		//logger - thing that keeps log of everything that has happened.
		public static bool ValidateJWT(string token, TokenValidationParameters validation_parameters, ILogger logger)
		{
			var handler = new JwtSecurityTokenHandler();
			SecurityToken validation_result;
			try
			{
				var result = handler.ValidateToken(token, validation_parameters, out validation_result);//What the hell is principal???
			} catch (SecurityException e)//No need to be smart here, if there's an exception, the token is invalid and that's all the user needs to know.
			{
				logger.Log(LogLevel.Error, "User token was invalid. Reason: {Message}", e.Message);//Shoutout to SCR
				return false;
			}
			return true;
		}

		//validation_parameters - stuff we're gonna validate the token against. Contains Politechnika CAS signing key, options to validate time of issuing and other stuff
		//	In this case, we only care about the key and if the token has not expired though. We're not even sure if CAS even provides us with the issuer and audience tbh.
		//auth_token - a Json Web Token we get from CAS.
		//logger - thing that keeps log of everything that has happened.
		public static string IssueToken(string auth_token, TokenValidationParameters validation_parameters, ILogger logger, IConfiguration configuration)
		{
			var handler = new JwtSecurityTokenHandler();
			SecurityToken validation_result;
			ClaimsPrincipal result;
			try
			{
				result = handler.ValidateToken(auth_token, validation_parameters, out validation_result);//What the hell is principal???
			}
			catch (SecurityException e)//No need to be smart here, if there's an exception, the token is invalid and that's all the user needs to know.
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
	}
}
