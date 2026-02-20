using Agendamento.Api.Services;
using Microsoft.AspNetCore.Mvc;


namespace Agendamento.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendamentoController : ControllerBase
{
    private readonly AgendamentoService _service;

    public AgendamentoController(AgendamentoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
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
    public async Task<IActionResult> Create([FromBody] AgendamentoServico.Server.Model.Agendamento agendamento)
    {
        var result = await _service.CreateAsync(agendamento);

        // Aqui podemos chamar WhatsApp (mais tarde)
        // Ex.: WhatsAppService.EnviarMensagem(...)

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("confirm/{id}")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var result = await _service.ConfirmAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("cancel/{id}")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _service.CancelAsync(id);
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