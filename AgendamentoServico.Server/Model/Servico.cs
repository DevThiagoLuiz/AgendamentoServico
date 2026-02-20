using System.ComponentModel.DataAnnotations;

namespace AgendamentoServico.Server.Model
{
    public class Servico
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        public int DuracaoMinutos { get; set; }

        public decimal Preco { get; set; }

        public bool Ativo { get; set; } = true;
    }
}
