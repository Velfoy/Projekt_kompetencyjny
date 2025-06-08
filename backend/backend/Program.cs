
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace backend
{
    public class Program
	{
		static bool debug = true;
		public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

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
			if (debug) {
                builder.Services.AddSingleton<TokenValidationParameters>(new TokenValidationParameters
			    {
				    ValidateIssuer = false,
				    ValidateAudience = false,
				    ValidateIssuerSigningKey = false,
				    ValidIssuer = "Politechnika Lodzka",
				    ValidAudience = "IMSI",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Testing").GetValue<string>("Key")))
			    });//We have turned off the token verification for testing purposes.
            } else
            {
				builder.Services.AddSingleton<TokenValidationParameters>(new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = builder.Configuration.GetSection("Politechnika").GetValue<string>("Issuer"),
					ValidAudience = builder.Configuration.GetSection("Politechnika").GetValue<string>("Audience"),
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Politechnika").GetValue<string>("Key")))
				});
			}
                var app = builder.Build();
            

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
