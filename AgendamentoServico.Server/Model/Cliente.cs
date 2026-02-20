namespace AgendamentoServico.Server.Model
{
    public class Cliente
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Telefone { get; set; } = string.Empty; // identificador principal

        public string? CPF { get; set; } // opcional

        public string? Email { get; set; }

        public bool Ativo { get; set; } = true;

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
