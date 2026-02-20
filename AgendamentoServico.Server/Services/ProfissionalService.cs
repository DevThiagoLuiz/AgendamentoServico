using Agendamento.Api.Data;
using AgendamentoServico.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace Agendamento.Api.Services;

public class ProfissionalService
{
    private readonly AppDbContext _context;

    public ProfissionalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Profissional>> GetAllAsync()
    {
        return await _context.Profissionais.ToListAsync();
    }

    public async Task<Profissional?> GetByIdAsync(Guid id)
    {
        return await _context.Profissionais.FindAsync(id);
    }

    public async Task<Profissional> CreateAsync(Profissional profissional)
    {
        _context.Profissionais.Add(profissional);
        await _context.SaveChangesAsync();
        return profissional;
    }

    public async Task<Profissional?> UpdateAsync(Guid id, Profissional profissional)
    {
        var existing = await _context.Profissionais.FindAsync(id);
        if (existing == null) return null;

        existing.Nome = profissional.Nome;
        existing.Ativo = profissional.Ativo;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await _context.Profissionais.FindAsync(id);
        if (existing == null) return false;

        _context.Profissionais.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}