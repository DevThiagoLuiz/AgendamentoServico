using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly UsuarioService _service;

    public UsuariosController(UsuarioService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Post([FromBody] UsuarioRequest request)
    {
        var usuario = await _service.CreateAsync(
            request.Nome,
            request.Email,
            request.Senha,
            request.Tipo,
            request.Ativo
        );

        return Ok(usuario);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Put(Guid id, [FromBody] UsuarioRequest request)
    {
        var usuario = await _service.UpdateAsync(
            id,
            request.Nome,
            request.Email,
            request.Senha,
            request.Tipo,
            request.Ativo
        );

        if (usuario == null) return NotFound();

        return Ok(usuario);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}

public class UsuarioRequest
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string Tipo { get; set; } = "Profissional";
    public bool Ativo { get; set; }
}