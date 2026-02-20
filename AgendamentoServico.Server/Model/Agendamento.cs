using System.ComponentModel.DataAnnotations;

namespace AgendamentoServico.Server.Model
{
    public class Agendamento
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ClienteId { get; set; }

        public Guid ServicoId { get; set; }

        public Guid ProfissionalId { get; set; }

        public Guid HorarioDisponivelId { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Pendente";
        // Pendente, Confirmado, Recusado, Cancelado

        [MaxLength(500)]
        public string? Observacao { get; set; }

        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }
  
}
