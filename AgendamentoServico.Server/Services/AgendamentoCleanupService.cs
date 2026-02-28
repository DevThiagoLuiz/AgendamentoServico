using Agendamento.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Agendamento.Api.Services.Background;

public class AgendamentoCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AgendamentoCleanupService> _logger;

    public AgendamentoCleanupService(
        IServiceProvider serviceProvider,
        ILogger<AgendamentoCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await LimparAgendamentosExpirados();

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }

    private async Task LimparAgendamentosExpirados()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var limite = DateTime.UtcNow.AddMinutes(-30);

            var expirados = await context.Agendamentos
                .Where(a =>
                    !a.Pago &&
                    a.CriadoEm <= limite)
                .ToListAsync();

            if (expirados.Count == 0)
                return;

            context.Agendamentos.RemoveRange(expirados);

            await context.SaveChangesAsync();

            _logger.LogInformation(
                "Cleanup removeu {Quantidade} agendamentos expirados",
                expirados.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no cleanup de agendamentos");
        }
    }
}