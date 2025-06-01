using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Models
{
	public class Context : DbContext
	{
		public Context(DbContextOptions<Context> options)
		: base(options)
		{
		}
		public DbSet<Item> Items { get; set; }
		public DbSet<Manager> Managers { get; set; }
		public DbSet<Organization> Organizations { get; set; }
		public DbSet<Request> Requests { get; set; }
		public DbSet<Timespan> Timespans { get; set; }
		public DbSet<Comment> Comments { get; set; }

		public async static void ChangeStatus(bool status, Context _context, int id)
		{
			var element = await (from r in _context.Requests where (r.Id == id) select r).FirstAsync();
			element.Approved = true;
			element.LastModified = DateTime.Now;
			await _context.SaveChangesAsync();
		}
	}
}
