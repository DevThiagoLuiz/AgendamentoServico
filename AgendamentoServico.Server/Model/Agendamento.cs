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

        [Required]
        public Guid HorarioDisponivelId { get; set; }

        [ForeignKey(nameof(HorarioDisponivelId))]
        public HorarioDisponivel Horario { get; set; } = null!;

        [Required]
        public Guid ServicoId { get; set; }

        [ForeignKey(nameof(ServicoId))]
        public Servico Servico { get; set; } = null!;

        [Required]
        public StatusAgendamento Status { get; set; } = StatusAgendamento.Pendente;

        public string? Observacoes { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }

}
