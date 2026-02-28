using Agendamento.Api.Data;
using AgendamentoServico.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace Agendamento.Api.Services;

public class AgendamentoService
{
    private readonly AppDbContext _context;

    public AgendamentoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AgendamentoServico.Server.Model.Agendamento>> GetAllAsync()
    {
        return await _context.Agendamentos
            .Include(a => a.Horario)
            .Include(a => a.Servico)
            .ToListAsync();
    }

    public async Task<AgendamentoServico.Server.Model.Agendamento?> GetByIdAsync(Guid id)
    {
        return await _context.Agendamentos
            .Include(a => a.Horario)
            .Include(a => a.Servico)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<AgendamentoServico.Server.Model.Agendamento> CreateAsync(AgendamentoServico.Server.Model.Agendamento agendamento)
    {
        // Ao criar, o horário ainda fica Pendente
        agendamento.Status = StatusAgendamento.Pendente;

        _context.Agendamentos.Add(agendamento);

        // Opcional: atualizar status do horário para "Reservado"
        var horario = await _context.Horarios.FindAsync(agendamento.HorarioDisponivelId);
        if (horario != null)
        {
            horario.Status = "Pendente";
        }

        await _context.SaveChangesAsync();
        return agendamento;
    }

    public async Task<AgendamentoServico.Server.Model.Agendamento?> ConfirmAsync(Guid id)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id);
        if (agendamento == null) return null;

        agendamento.Status = StatusAgendamento.Confirmado;

        // Atualiza também o horário
        var horario = await _context.Horarios.FindAsync(agendamento.HorarioDisponivelId);
        if (horario != null)
        {
            horario.Status = "Confirmado";
        }

        await _context.SaveChangesAsync();
        return agendamento;
    }

    public async Task<AgendamentoServico.Server.Model.Agendamento?> CancelAsync(Guid id)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id);
        if (agendamento == null) return null;

        agendamento.Status = StatusAgendamento.Cancelado;

        // Atualiza também o horário
        var horario = await _context.Horarios.FindAsync(agendamento.HorarioDisponivelId);
        if (horario != null)
        {
            horario.Status = "Disponivel";
        }

        await _context.SaveChangesAsync();
        return agendamento;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id);
        if (agendamento == null) return false;

        _context.Agendamentos.Remove(agendamento);
        await _context.SaveChangesAsync();
        return true;
    }


    public async Task LiberarHorarioAsync(string StripeSessionId)
    {
        var agendamento = await _context.Agendamentos
            .Include(a => a.Horario)
            .FirstOrDefaultAsync(a => a.StripeSessionId == StripeSessionId);

        var horarioDisponivel = await _context.Horarios
            .FirstOrDefaultAsync(h => h.Id == agendamento!.HorarioDisponivelId);

        if (horarioDisponivel != null)
        {
            horarioDisponivel.Status = "Disponivel";
        }
    }

}