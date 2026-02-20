using Agendamento.Api.Data;
using Agendamento.Api.Entities;
using AgendamentoServico.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace Agendamento.Api.Services;

public class ServicoService
{
    private readonly AppDbContext _context;

    public ServicoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Servico>> GetAllAsync()
    {
        return await _context.Servicos.ToListAsync();
    }

    public async Task<Servico?> GetByIdAsync(Guid id)
    {
        return await _context.Servicos.FindAsync(id);
    }

    public async Task<Servico> CreateAsync(Servico servico)
    {
        _context.Servicos.Add(servico);
        await _context.SaveChangesAsync();
        return servico;
    }

    public async Task<Servico?> UpdateAsync(Guid id, Servico servico)
    {
        var existing = await _context.Servicos.FindAsync(id);
        if (existing == null) return null;

        existing.Nome = servico.Nome;
        existing.DuracaoMinutos = servico.DuracaoMinutos;
        existing.Preco = servico.Preco;
        existing.Ativo = servico.Ativo;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await _context.Servicos.FindAsync(id);
        if (existing == null) return false;

        _context.Servicos.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}