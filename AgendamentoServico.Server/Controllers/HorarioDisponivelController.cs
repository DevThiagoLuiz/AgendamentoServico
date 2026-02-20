using Agendamento.Api.Services;
using AgendamentoServico.Server.Model;
using Microsoft.AspNetCore.Mvc;

namespace Agendamento.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HorarioDisponivelController : ControllerBase
{
    private readonly HorarioDisponivelService _service;

    public HorarioDisponivelController(HorarioDisponivelService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("profissional/{profissionalId}")]
    public async Task<IActionResult> GetByProfissional(Guid profissionalId)
    {
        var result = await _service.GetByProfissionalAsync(profissionalId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HorarioDisponivel horario)
    {
        var result = await _service.CreateAsync(horario);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] HorarioDisponivel horario)
    {
        var result = await _service.UpdateAsync(id, horario);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}