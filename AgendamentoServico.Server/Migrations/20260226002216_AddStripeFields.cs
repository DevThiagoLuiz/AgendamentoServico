using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgendamentoServico.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddStripeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Pago",
                table: "Agendamentos",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "StripeSessionId",
                table: "Agendamentos",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pago",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "StripeSessionId",
                table: "Agendamentos");
        }
    }
}
