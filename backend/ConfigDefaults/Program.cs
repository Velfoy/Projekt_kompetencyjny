using System.Text.Json.Serialization;

namespace ConfigDefaults;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateSlimBuilder(args);
        builder.AddServiceDefaults();

        var app = builder.Build();

        app.MapDefaultEndpoints();
        var externalKeys = app.MapGroup("/politechnika");
		externalKeys.MapGet("/external_key", () => builder.Configuration.GetSection("Politechnika").GetValue<string>("Key") ?? "hue vadima");

        var databaseApi = app.MapGroup("/database");
        databaseApi.MapGet("/connection_string", () => builder.Configuration.GetSection("ConnectionStrings").GetValue<string>("DBContext"));

		app.Run();
    }
}
