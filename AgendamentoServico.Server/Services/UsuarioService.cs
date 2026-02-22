using Agendamento.Api.Data;
using AgendamentoServico.Server.Model;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

public class UsuarioService
{
    private readonly AppDbContext _context;

    public UsuarioService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios.ToListAsync();
    }

    public async Task<Usuario> CreateAsync(string nome, string email, string senha, string tipo, bool ativo)
    {
        var usuario = new Usuario
        {
            Nome = nome,
            Email = email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha),
            Tipo = tipo,
            Ativo = ativo
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<Usuario?> UpdateAsync(Guid id, string nome, string email, string? senha, string tipo, bool ativo)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return null;

        usuario.Nome = nome;
        usuario.Email = email;
        usuario.Tipo = tipo;
        usuario.Ativo = ativo;

        if (!string.IsNullOrEmpty(senha))
        {
            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha);
        }

        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task DeleteAsync(Guid id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return;

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
    }
}