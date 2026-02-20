using Agendamento.Api;
using AgendamentoServico.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace Agendamento.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Profissional> Profissionais => Set<Profissional>();
    public DbSet<Servico> Servicos => Set<Servico>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<HorarioDisponivel> Horarios => Set<HorarioDisponivel>();
    public DbSet<AgendamentoServico.Server.Model.Agendamento> Agendamentos => Set<AgendamentoServico.Server.Model.Agendamento> ();
    public DbSet<Empresa> Empresas => Set<Empresa>();
}
