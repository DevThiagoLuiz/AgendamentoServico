using Agendamento.Api.Data;
using Agendamento.Api.Services;
using AgendamentoServico.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Agendamento.Api.Controllers;

[ApiController]
[Route("api/webhook/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AgendamentoService _agendamentoService;
    private readonly IConfiguration _configuration;

    public StripeWebhookController(
        AppDbContext context,
        AgendamentoService agendamentoService,
        IConfiguration configuration)
    {
        _context = context;
        _agendamentoService = agendamentoService;
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        var signature = Request.Headers["Stripe-Signature"];

        var webhookSecret = _configuration["Stripe:WebhookSecret"];

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                signature,
                webhookSecret
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro validação webhook: {ex.Message}");
            return BadRequest();
        }

        // PAGAMENTO CONFIRMADO
        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;

            if (session == null)
                return BadRequest();

            var stripeSessionId = session.Id;

            Console.WriteLine($"SessionId COMPLETED: {stripeSessionId}");

            // importante garantir que foi pago mesmo
            if (session.PaymentStatus == "paid")
            {
                var agendamento = await _context.Agendamentos
                    .FirstOrDefaultAsync(a => a.StripeSessionId == stripeSessionId);

                if (agendamento != null)
                {
                    if (!agendamento.Pago)
                    {
                        agendamento.Pago = true;
                        agendamento.Status = StatusAgendamento.Confirmado;

                        await _agendamentoService.ConfirmAsync(agendamento.Id);

                        await _context.SaveChangesAsync();
                    }
                }
            }
        }

        // PAGAMENTO NÃO CONCLUÍDO / EXPIRADO
        else if (stripeEvent.Type == "checkout.session.expired"
      || stripeEvent.Type == "checkout.session.async_payment_failed")
        {
            var session = stripeEvent.Data.Object as Session;

            if (session == null)
                return BadRequest();

            var stripeSessionId = session.Id;

            Console.WriteLine($"SessionId EXPIRED: {stripeSessionId}");

            var agendamento = await _context.Agendamentos
                .FirstOrDefaultAsync(a => a.StripeSessionId == stripeSessionId);

            if (agendamento != null)
            {
                // liberar horário
                await _agendamentoService.LiberarHorarioAsync(agendamento.StripeSessionId);

                // deletar agendamento
                _context.Agendamentos.Remove(agendamento);

                await _context.SaveChangesAsync();

                Console.WriteLine($"Agendamento {agendamento.Id} removido e horário liberado!");
            }
        }

        return Ok();
    }
}