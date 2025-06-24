using System.Security.Claims;
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
        _provider = _provider;
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
                var org = await (from i in _context.Items.Include(i => i.Organivzation).Include(i => i.Organivzation.Admins)
                    where i.Id.ToString() == attribute.Id
                    select i.Organivzation).FirstOrDefaultAsync();
                if (org.Admins.Any(a => a.Username == name)||_context.Managers.Any(a => (a.Username == name)&&a.GlobalAdmin))
                {
                
                    await _next(context);
                }
            }
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Missing permissions");
            return;
        }
        await _next(context);
    }
}