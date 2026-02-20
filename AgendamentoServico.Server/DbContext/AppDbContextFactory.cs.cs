using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

namespace Agendamento.Api.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Coloque aqui direto a connection string
            var connectionString = "server=localhost;database=AgendamentoServiceDb;user=root;password=#Saga@2025!";

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseMySQL(connectionString);

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}