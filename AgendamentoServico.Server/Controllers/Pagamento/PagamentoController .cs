using Agendamento.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Agendamento.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagamentoController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public PagamentoController(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;

        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    [HttpPost("criar-sessao/{agendamentoId}")]
    public async Task<IActionResult> CriarSessao(Guid agendamentoId)
    {
        var agendamento = await _context.Agendamentos
            .Include(a => a.Servico)
            .FirstOrDefaultAsync(a => a.Id == agendamentoId);

        if (agendamento == null)
            return NotFound("Agendamento não encontrado");

        if (agendamento.StripeSessionId != null)
        {
            return BadRequest("Pagamento já iniciado");
        }

        var options = new SessionCreateOptions
        {
            Mode = "payment",

            SuccessUrl = _configuration["Stripe:SuccessUrl"],
            CancelUrl = _configuration["Stripe:CancelUrl"],

            //PaymentMethodTypes = new List<string>
            //{
            //    "card",
            //    "pix"
            //},

            Metadata = new Dictionary<string, string>
            {
                { "agendamentoId", agendamento.Id.ToString() }
            },

            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Quantity = 1,

                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "brl",

                        UnitAmount = (long)(agendamento.Servico.Preco * 100),

                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = agendamento.Servico.Nome
                        }
                    }
                }
            }
        };

        var service = new SessionService();

        var session = await service.CreateAsync(options);

        agendamento.StripeSessionId = session.Id;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            url = session.Url
        });
    }
}