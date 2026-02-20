using Agendamento.Api.Data;
using Agendamento.Api.Entities;
using AgendamentoServico.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace Agendamento.Api.Services;

public class HorarioDisponivelService
{
    private readonly AppDbContext _context;

    public HorarioDisponivelService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<HorarioDisponivel>> GetAllAsync()
    {
        return await _context.Horarios.ToListAsync();
    }

    public async Task<List<HorarioDisponivel>> GetByProfissionalAsync(Guid profissionalId)
    {
        return await _context.Horarios
            .Where(h => h.ProfissionalId == profissionalId)
            .OrderBy(h => h.DataHoraInicio)
            .ToListAsync();
    }

    public async Task<HorarioDisponivel?> GetByIdAsync(Guid id)
    {
        return await _context.Horarios.FindAsync(id);
    }

    public async Task<HorarioDisponivel> CreateAsync(HorarioDisponivel horario)
    {
        _context.Horarios.Add(horario);
        await _context.SaveChangesAsync();
        return horario;
    }

    public async Task<HorarioDisponivel?> UpdateAsync(Guid id, HorarioDisponivel horario)
    {
        var existing = await _context.Horarios.FindAsync(id);
        if (existing == null) return null;

        existing.DataHoraInicio = horario.DataHoraInicio;
        existing.DataHoraFim = horario.DataHoraFim;
        existing.Status = horario.Status;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await _context.Horarios.FindAsync(id);
        if (existing == null) return false;

        _context.Horarios.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}