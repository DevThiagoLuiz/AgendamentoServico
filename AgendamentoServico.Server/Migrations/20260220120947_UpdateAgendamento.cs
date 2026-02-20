using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgendamentoServico.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAgendamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClienteId",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "Observacao",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "ProfissionalId",
                table: "Agendamentos");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Agendamentos",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "NomeCliente",
                table: "Agendamentos",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "Observacoes",
                table: "Agendamentos",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TelefoneCliente",
                table: "Agendamentos",
                type: "longtext",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_HorarioDisponivelId",
                table: "Agendamentos",
                column: "HorarioDisponivelId");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_ServicoId",
                table: "Agendamentos",
                column: "ServicoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Agendamentos_Horarios_HorarioDisponivelId",
                table: "Agendamentos",
                column: "HorarioDisponivelId",
                principalTable: "Horarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Agendamentos_Servicos_ServicoId",
                table: "Agendamentos",
                column: "ServicoId",
                principalTable: "Servicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agendamentos_Horarios_HorarioDisponivelId",
                table: "Agendamentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Agendamentos_Servicos_ServicoId",
                table: "Agendamentos");

            migrationBuilder.DropIndex(
                name: "IX_Agendamentos_HorarioDisponivelId",
                table: "Agendamentos");

            migrationBuilder.DropIndex(
                name: "IX_Agendamentos_ServicoId",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "NomeCliente",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "Observacoes",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "TelefoneCliente",
                table: "Agendamentos");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Agendamentos",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<Guid>(
                name: "ClienteId",
                table: "Agendamentos",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Observacao",
                table: "Agendamentos",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProfissionalId",
                table: "Agendamentos",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
