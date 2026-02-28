using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgendamentoServico.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixIndiceUnicoHorario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Agendamentos_HorarioDisponivelId",
                table: "Agendamentos");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_HorarioDisponivelId_ServicoId",
                table: "Agendamentos",
                columns: new[] { "HorarioDisponivelId", "ServicoId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Agendamentos_HorarioDisponivelId_ServicoId",
                table: "Agendamentos");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_HorarioDisponivelId",
                table: "Agendamentos",
                column: "HorarioDisponivelId");
        }
    }
}
