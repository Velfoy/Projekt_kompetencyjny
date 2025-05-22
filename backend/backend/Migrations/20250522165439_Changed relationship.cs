using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Changedrelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Items_ItemId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Managers_Organizations_OrganizationId",
                table: "Managers");

            migrationBuilder.DropIndex(
                name: "IX_Managers_OrganizationId",
                table: "Managers");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Managers");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                table: "Comments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ManagerOrganization",
                columns: table => new
                {
                    AdminsId = table.Column<int>(type: "integer", nullable: false),
                    OrganizationsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManagerOrganization", x => new { x.AdminsId, x.OrganizationsId });
                    table.ForeignKey(
                        name: "FK_ManagerOrganization_Managers_AdminsId",
                        column: x => x.AdminsId,
                        principalTable: "Managers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManagerOrganization_Organizations_OrganizationsId",
                        column: x => x.OrganizationsId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ManagerOrganization_OrganizationsId",
                table: "ManagerOrganization",
                column: "OrganizationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Items_ItemId",
                table: "Comments",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Items_ItemId",
                table: "Comments");

            migrationBuilder.DropTable(
                name: "ManagerOrganization");

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Managers",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                table: "Comments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_Managers_OrganizationId",
                table: "Managers",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Items_ItemId",
                table: "Comments",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Managers_Organizations_OrganizationId",
                table: "Managers",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");
        }
    }
}
