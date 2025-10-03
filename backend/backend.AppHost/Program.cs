var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.backend>("backend");
var auth_service = builder.AddExecutable("tokenvalidator", "D:\\pk\\Projekt_kompetencyjny\\backend\\validate_token\\build\\go_build_validate_token.exe", "../validate_token").WithHttpEndpoint(targetPort:8080, port:8000, name: "gojwt");
auth_service.WithReference(backend);
builder.AddProject<Projects.ConfigDefaults>("configdefaults").WithHttpEndpoint(name: "auth", port: 5167);
builder.Build().Run();
