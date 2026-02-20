using System.ComponentModel.DataAnnotations;

namespace AgendamentoServico.Server.Model
{
    public class Empresa
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Telefone { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? LogoUrl { get; set; }

        [MaxLength(20)]
        public string? CorPrimaria { get; set; }
    }
}
