using backend.Models;

namespace backend.Data
{
	public class Seed_database
	{
		public static void CreateItems(Context _context)
		{
			if (_context.Items.Any()) return; // Prevent seeding if data already exists

			// Organizations
			var org1 = new Organization { Name = "Politechnika Łódzka" };
			var org2 = new Organization { Name = "Centrum IT" };

			// Managers
			var manager1 = new Manager { Username = "jan.kowalski", Organizations = new List<Organization> { org1 } };
			var manager2 = new Manager { Username = "anna.nowak", Organizations = new List<Organization> { org1, org2 } };

			org1.Admins = new List<Manager> { manager1, manager2 };
			org2.Admins = new List<Manager> { manager2 };

			// Items
			var item1 = new Item
			{
				Organivzation = org1,
				Type = "Room",
				Description = "Sala wykładowa 101",
				Location = "Budynek A, piętro 1",
				ImagePath = "/images/room101.jpg",
				Manager = manager1,
				TermsOfUse = "Rezerwacja wymagana z 24h wyprzedzeniem",
				AttachedDocuments = new List<string> { "regulamin_room.pdf" },
				Specs = "Rzutnik, 30 miejsc",
				DateAdded = DateTime.UtcNow
			};

			var item2 = new Item
			{
				Organivzation = org2,
				Type = "Thing",
				Description = "Projektor Epson X20",
				Location = "Magazyn B2",
				ImagePath = "/images/projector.jpg",
				Manager = manager2,
				TermsOfUse = "Tylko dla pracowników",
				AttachedDocuments = new List<string> { "instrukcja_projektora.pdf" },
				Specs = "Full HD, HDMI, 3000 lumenów",
				DateAdded = DateTime.UtcNow
			};

			// Comments
			var comment1 = new Comment
			{
				Author = "student1",
				Contents = "Super sala!",
				Item = item1
			};

			var comment2 = new Comment
			{
				Author = "student2",
				Contents = "Projektor działa bez zarzutu.",
				Item = item2
			};

			item1.Comments.Add(comment1);
			item2.Comments.Add(comment2);

			// Timespan
			var time1 = new Timespan
			{
				Start = DateTime.UtcNow.AddDays(1),
				End = DateTime.UtcNow.AddDays(2)
			};

			var time2 = new Timespan
			{
				Start = DateTime.UtcNow.AddDays(3),
				End = DateTime.UtcNow.AddDays(4)
			};

			// Requests
			var request1 = new Request
			{
				Item = item1,
				Renter = "student2",
				Approved = null,
				RequestSubmitted = DateTime.UtcNow,
				RequestPeriod = new List<Timespan> { time1 },
				AdditionalInfo = "Potrzebuję sali na prezentację."
			};

			var request2 = new Request
			{
				Item = item2,
				Renter = "n.prac",
				Approved = true,
				RequestSubmitted = DateTime.UtcNow.AddDays(-1),
				LastModified = DateTime.UtcNow,
				Respondent = manager2,
				RequestPeriod = new List<Timespan> { time2 },
				AdditionalInfo = "Nado."
			};

			_context.Organizations.AddRange(org1, org2);
			_context.Managers.AddRange(manager1, manager2);
			_context.Items.AddRange(item1, item2);
			_context.Comments.AddRange(comment1, comment2);
			_context.Timespans.AddRange(time1, time2);
			_context.Requests.AddRange(request1, request2);

			_context.SaveChanges();
		}
	}
}

