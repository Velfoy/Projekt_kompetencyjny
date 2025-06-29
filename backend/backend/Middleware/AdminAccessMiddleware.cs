using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using backend.Attributes;
using backend.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace backend.Middleware;

public class AdminAccessMiddleware
{
    private RequestDelegate _next;
    private IServiceProvider _provider;
    
    public AdminAccessMiddleware(RequestDelegate next, IServiceProvider _provider)
    {
        _next = next;
        this._provider = _provider;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
        var attribute = endpoint?.Metadata.GetMetadata<AdminAccess>();
        if (attribute != null)
        {
            using (var scope = _provider.CreateScope())
			{
				var _context = scope.ServiceProvider.GetService<Context>();
				string name = context.User.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;
                if (attribute.Id == "id")
				{
					string url = context.Request.Path;
					Regex rg = new Regex("(?:[^\\/]*\\/)+(?'id'\\d*[^?]*)");//Now this is something I'm extremely proud of
                    int? id = null;
					var me = rg.Matches(url);
					foreach (Match m in rg.Matches(url))
					{
						var group = (from Group g in m.Groups where g.Name == "id" && g.Success select g).FirstOrDefault();
						if (group == null)
						{
							continue;
						}
                        id = Convert.ToInt32(group.Value);
					}
                    if (id == null)
                    {
						context.Response.StatusCode = StatusCodes.Status401Unauthorized;
						await context.Response.WriteAsync("Missing permissions");
						return;
					}
					var org = await (from i in _context.Items.Include(i => i.Organivzation).Include(i => i.Organivzation.Admins)
									 where i.Id == id
									 select i.Organivzation).FirstOrDefaultAsync();
                    if (org == null)
                    {
						context.Response.StatusCode = StatusCodes.Status400BadRequest;
						await context.Response.WriteAsync("Id is invalid");
						return;
					}
					if (org.Admins.Any(a => a.Username == name) || _context.Managers.Any(a => (a.Username == name) && a.GlobalAdmin))
					{

						await _next(context);
						return;
					}
				} else
				{
                    if (_context.Managers.Any(a => (a.Username == name) && a.GlobalAdmin)) {
						await _next(context);
						return;
					}
                }

				
            }
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Missing permissions");
            return;
        }
        await _next(context);
    }
}