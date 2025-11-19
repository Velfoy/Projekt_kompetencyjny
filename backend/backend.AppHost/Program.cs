var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.backend>("backend");
var tokenValidatorPath = "/home/voxel/cas-reservation/Projekt_kompetencyjny/backend/validate_token/build/validate_token";
var tokenValidatorWorkingDir = "/home/voxel/cas-reservation/Projekt_kompetencyjny/backend/validate_token";

var authService = builder
    .AddExecutable(
        "tokenvalidator",
        tokenValidatorPath,
        tokenValidatorWorkingDir
    )
    .WithHttpEndpoint(
        name: "gojwt",
        port: 8000,      // external port
        targetPort: 8080 // what the executable listens on (if you use it)
    );
auth_service.WithReference(backend);
builder.AddProject<Projects.ConfigDefaults>("configdefaults").WithHttpEndpoint(name: "auth", port: 5167);
builder.Build().Run();
