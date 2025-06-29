using backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Data
{
	public class Seed_database
	{
		public static void CreateItems(Context _context)
		{
			// Clear existing data
			_context.Comments.RemoveRange(_context.Comments);
			_context.Timespans.RemoveRange(_context.Timespans);
			_context.Requests.RemoveRange(_context.Requests);
			_context.Items.RemoveRange(_context.Items);
			_context.Organizations.RemoveRange(_context.Organizations);
			_context.Managers.RemoveRange(_context.Managers);
			_context.SaveChanges();

			// Create managers
			var managers = new List<Manager>
			{
				new Manager { Username = "g.zwolinski", GlobalAdmin = true },
				new Manager { Username = "m.nowak", GlobalAdmin = false },
				new Manager { Username = "a.kowalski", GlobalAdmin = false },
				new Manager { Username = "j.szymanska", GlobalAdmin = true },
				new Manager { Username = "k.wisniewski", GlobalAdmin = false }
			};
			_context.Managers.AddRange(managers);
			_context.SaveChanges();

			// Create organizations
			var voxel = new Organization
			{
				Name = "Voxel",
				Admins = new List<Manager> { managers[0], managers[1] }
			};

			var raptors = new Organization
			{
				Name = "Raptors",
				Admins = new List<Manager> { managers[2], managers[3], managers[4] }
			};

			_context.Organizations.AddRange(voxel, raptors);
			_context.SaveChanges();

			// Helper to generate comments
			List<Comment> GenerateComments(Item item, string author)
			{
				return new List<Comment>
				{
					new Comment { Author = author, Contents = "Świetnie działa.", Created = DateTime.UtcNow.AddDays(-7), Item = item },
					new Comment { Author = author, Contents = "Zauważyłem błąd w instrukcji.", Created = DateTime.UtcNow.AddDays(-3), Item = item },
					new Comment { Author = author, Contents = "Użyteczne w projektach studenckich.", Created = DateTime.UtcNow.AddDays(-1), Item = item }
				};
			}

			var items = new List<Item>();
			var rand = new Random();

			// Create 28 items (13 for Voxel, 15 for Raptors)
			for (int i = 1; i <= 28; i++)
			{
				bool isVoxel = i <= 13;
				var org = isVoxel ? voxel : raptors;
				var manager = isVoxel ? managers[rand.Next(0, 2)] : managers[rand.Next(2, 5)];

				var item = new Item
				{
					Name = $"{org.Name} Item {i}",
					Type = (i % 2 == 0) ? "Room" : "Thing",
					Description = $"Sprzęt {org.Name} nr {i}.",
					Location = $"Budynek {i % 4 + 1}, pokój {100 + i}",
					ImagePath = $"/images/{org.Name.ToLower()}_{i}.png",
					Organivzation = org,
					Manager = manager,
					TermsOfUse = "Używaj zgodnie z instrukcją.",
					AttachedDocuments = new List<string> { $"{org.Name.ToLower()}_manual_{i}.pdf" },
					Specs = $"Specyfikacja modelu {i}: moc, waga, zasilanie.",
					Notes = (i % 3 == 0) ? "Wymaga corocznej kalibracji." : null,
					DateAdded = DateTime.UtcNow.AddDays(-i),
					Comments = new List<Comment>() // filled below
				};

				item.Comments = GenerateComments(item, manager.Username);
				items.Add(item);
			}

			_context.Items.AddRange(items);
			_context.SaveChanges();

			// Seed Requests with Timespans
			var renters = new[] { "adam.k", "ewa.p", "zofia.j", "marek.b", "piotr.m" };
			var requests = new List<Request>();

			for (int j = 0; j < items.Count; j++) {
				for (int i = 0; i < 12; i++)
				{
					var item = items[j];
					var approvedStatus = i % 3 == 0 ? (bool?)null : i % 3 == 1;
					var start = DateTime.UtcNow.AddDays(rand.Next(1, 5)).AddHours(9);
					var end = start.AddHours(6);
					

					var timespan = new Timespan
					{
						Start = start,
						End = end
					};

					var request = new Request
					{
						Item = item,
						Renter = renters[i % renters.Length],
						Title = $"Wypożyczenie {item.Name}",
						Approved = approvedStatus,
						Respondent = approvedStatus.HasValue ? item.Manager : null,
						type = item.Type,
						RequestSubmitted = DateTime.UtcNow.AddDays(-rand.Next(1, 4)),
						LastModified = approvedStatus.HasValue ? DateTime.UtcNow : null,
						AdditionalInfo = "Potrzebuję sprzętu na zajęcia laboratoryjne.",
						RequestPeriod = new List<Timespan> { timespan }
					};

					timespan.Request = request;

					_context.Timespans.Add(timespan);
					requests.Add(request);
				}
			}

			_context.Requests.AddRange(requests);
			_context.SaveChanges();

			Console.WriteLine("✅ Full database seeding complete with managers, orgs, items, comments, requests, and timespans.");
		}
	}
}
