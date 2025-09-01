using System.Security;
using System.Text.Json;
using System.Text;

namespace CAS.Services
{
	public class DefaultsService
	{
		HttpClient _http_client;

		public DefaultsService(HttpClient _http_client)
		{
			this._http_client = _http_client;
		}

		public async Task<string> GetKeyAsync()
		{
			return await _http_client.GetStringAsync("/politechnika/external_key");
		}
	}
}
