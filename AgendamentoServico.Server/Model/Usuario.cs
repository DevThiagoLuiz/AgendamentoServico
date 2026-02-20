using System.ComponentModel.DataAnnotations;

namespace AgendamentoServico.Server.Model
{
    public class Usuario
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(255)]
        public string SenhaHash { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Tipo { get; set; } = "Profissional"; // Admin ou Profissional

        public bool Ativo { get; set; } = true;

        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    }
}
