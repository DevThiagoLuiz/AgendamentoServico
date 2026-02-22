using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgendamentoServico.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddProfissionalId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProfissionalId",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfissionalId",
                table: "Usuarios");
        }
    }
}
