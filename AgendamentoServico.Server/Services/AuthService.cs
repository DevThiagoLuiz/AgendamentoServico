using Agendamento.Api.Data;
using AgendamentoServico.Server.Data;
using AgendamentoServico.Server.Model;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;

    public AuthService(IConfiguration config, AppDbContext context)
    {
        _config = config;
        _context = context;
    }

    // 🔐 LOGIN
    public async Task<string?> LoginAsync(string email, string senha)
    {
        // 👑 LOGIN MASTER
        if (email == "admin" && senha == "8577")
        {
            var master = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = "Administrador Master",
                Email = "admin@sistema.com",
                Tipo = "Admin",
                Ativo = true
            };

            return GerarToken(master);
        }

        // 🔎 LOGIN NORMAL
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email && u.Ativo);

        if (usuario == null)
            return null;

        var senhaValida = BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash);

        if (!senhaValida)
            return null;

        return GerarToken(usuario);
    }

    // 🎟 GERAR TOKEN
    public string GerarToken(Usuario usuario)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Nome),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.Tipo)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}