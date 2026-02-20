using System.ComponentModel.DataAnnotations;

namespace AgendamentoServico.Server.Model
{
    public class Profissional
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int? UsuarioId { get; set; }

        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;
        public bool Ativo { get; set; } = true;
    }
}
