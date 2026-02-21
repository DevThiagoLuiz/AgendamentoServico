using System.ComponentModel.DataAnnotations;

namespace AgendamentoServico.Server.Model
{
    public class HorarioDisponivel
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProfissionalId { get; set; }

        public DateTime DataHoraInicio { get; set; }

        public DateTime DataHoraFim { get; set; }

        public string Status { get; set; } = "Disponivel";
        // Disponivel, Pendente, Confirmado, Bloqueado
    }

    public class CriarHorarioIntervaloDto
    {
        public Guid ProfissionalId { get; set; }
        public DateTime Data { get; set; }
        public string HoraInicio { get; set; }
        public string HoraFim { get; set; }
        public int IntervaloMinutos { get; set; }
    }
}
