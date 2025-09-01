using System.Security;
using System.Text;
using System.Text.Json;
using System.Text.Unicode;

namespace backend.Services
{
	public class VerificationService
	{
		HttpClient _http_client;

		public VerificationService(HttpClient _http_client)
		{
			this._http_client = _http_client;
		}
		public async Task<string> ValidateTokenAsync(string token)
		{
			var response = await _http_client.PostAsync("/validate_token", new StringContent(JsonSerializer.Serialize(new{token}), Encoding.UTF8, "application/json"));
			if (!response.IsSuccessStatusCode)
			{
				throw new SecurityException(await response.Content.ReadAsStringAsync());
			}
			var username = await response.Content.ReadAsStringAsync();
			return username;
		}
	}
}
