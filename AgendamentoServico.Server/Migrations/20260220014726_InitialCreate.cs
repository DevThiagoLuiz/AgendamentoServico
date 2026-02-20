using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgendamentoServico.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Agendamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    ClienteId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ServicoId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProfissionalId = table.Column<Guid>(type: "char(36)", nullable: false),
                    HorarioDisponivelId = table.Column<Guid>(type: "char(36)", nullable: false),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Observacao = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    CriadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamentos", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Empresas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nome = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    Telefone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    LogoUrl = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: true),
                    CorPrimaria = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresas", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Horarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProfissionalId = table.Column<Guid>(type: "char(36)", nullable: false),
                    DataHoraInicio = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DataHoraFim = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Horarios", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Profissionais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: true),
                    Nome = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profissionais", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Servicos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nome = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    DuracaoMinutos = table.Column<int>(type: "int", nullable: false),
                    Preco = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servicos", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nome = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    SenhaHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Tipo = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Ativo = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamentos");

            migrationBuilder.DropTable(
                name: "Empresas");

            migrationBuilder.DropTable(
                name: "Horarios");

            migrationBuilder.DropTable(
                name: "Profissionais");

            migrationBuilder.DropTable(
                name: "Servicos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
