
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using backend.Middleware;
using backend.Services;

namespace backend
{
    public class Program
	{
		static bool debug = false;
		public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.AddServiceDefaults();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<Context>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DBContext"));
            });

			builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = builder.Configuration.GetSection("Authenthication").GetValue<string>("Issuer"),
					ValidAudience = builder.Configuration.GetSection("Authenthication").GetValue<string>("Audience"),
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Authenthication").GetValue<string>("Key")))
				};
			});
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "_allowReactJS",
                                  policy =>
                                  {
                                      policy.AllowAnyHeader();
                                      policy.AllowAnyMethod();
                                      policy.AllowAnyOrigin();
                                  });
            });

            builder.Services.AddSingleton<VerificationService>();
            builder.Services.AddHttpClient<VerificationService>(c =>
            {
                var url = builder.Configuration.GetSection("Services").GetValue<string>("TokenVerifier");
				c.BaseAddress = new(url);
			}
            );
                var app = builder.Build();
                app.MapDefaultEndpoints();
            

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("_allowReactJS");
            app.UseAuthorization();
            app.UseMiddleware<AdminAccessMiddleware>();


            app.MapControllers();

            app.Run();
        }
    }
}
