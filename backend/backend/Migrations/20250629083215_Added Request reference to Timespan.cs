using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedRequestreferencetoTimespan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timespans_Requests_RequestId",
                table: "Timespans");

            migrationBuilder.AlterColumn<int>(
                name: "RequestId",
                table: "Timespans",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Timespans_Requests_RequestId",
                table: "Timespans",
                column: "RequestId",
                principalTable: "Requests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timespans_Requests_RequestId",
                table: "Timespans");

            migrationBuilder.AlterColumn<int>(
                name: "RequestId",
                table: "Timespans",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Timespans_Requests_RequestId",
                table: "Timespans",
                column: "RequestId",
                principalTable: "Requests",
                principalColumn: "Id");
        }
    }
}
