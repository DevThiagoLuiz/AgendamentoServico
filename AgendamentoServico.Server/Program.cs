using Microsoft.EntityFrameworkCore;
using Agendamento.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ========================
// DATABASE
// ========================

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString)  // UseMySQL do pacote oficial
);

// ========================
// SERVICES
// ========================

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (para React depois)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin(); // depois você restringe
        });
});

var app = builder.Build();

// ========================
// PIPELINE
// ========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
