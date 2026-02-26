using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgendamentoServico.Server.Model
{
    public enum StatusAgendamento
    {
        Pendente,
        Confirmado,
        Cancelado
    }

    public class Agendamento
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string NomeCliente { get; set; } = null!;

        [Required]
        public string TelefoneCliente { get; set; } = null!;

        // 🔑 FK obrigatória
        [Required]
        public Guid HorarioDisponivelId { get; set; }

        // 🔗 Navegação (SEM Required)
        [ForeignKey(nameof(HorarioDisponivelId))]
        public HorarioDisponivel? Horario { get; set; }

        // 🔑 FK obrigatória
        [Required]
        public Guid ServicoId { get; set; }

        // 🔗 Navegação (SEM Required)
        [ForeignKey(nameof(ServicoId))]
        public Servico? Servico { get; set; }

        [Required]
        public StatusAgendamento Status { get; set; } = StatusAgendamento.Pendente;

        public string? Observacoes { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        public string? StripeSessionId { get; set; }

        public bool Pago { get; set; } = false;
    }

}
