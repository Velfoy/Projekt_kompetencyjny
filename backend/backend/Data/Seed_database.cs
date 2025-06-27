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
            _context.Requests.RemoveRange(_context.Requests);
            _context.Timespans.RemoveRange(_context.Timespans);
            _context.Items.RemoveRange(_context.Items);
            _context.Organizations.RemoveRange(_context.Organizations);
            _context.Managers.RemoveRange(_context.Managers);
            _context.SaveChanges();

            // Seed Managers
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

            // Seed Organizations
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

            // Seed Items
            var rand = new Random();
            var items = new List<Item>();

            List<Comment> CreateComments(Item item, string author)
            {
                return new List<Comment>
                {
                    new Comment
                    {
                        Author = author,
                        Contents = "Działa bez zarzutu.",
                        Created = DateTime.UtcNow.AddDays(-rand.Next(2, 10)),
                        Item = item
                    },
                    new Comment
                    {
                        Author = author,
                        Contents = "Trochę trudna instrukcja obsługi.",
                        Created = DateTime.UtcNow.AddDays(-rand.Next(1, 3)),
                        Item = item
                    },
                    new Comment
                    {
                        Author = author,
                        Contents = "Rekomenduję dla nowych użytkowników.",
                        Created = DateTime.UtcNow.AddDays(-1),
                        Item = item
                    }
                };
            }

            for (int i = 1; i <= 13; i++)
            {
                var manager = managers[rand.Next(0, 2)];
                var item = new Item
                {
                    Name = $"Voxel Device {i}",
                    Type = i % 2 == 0 ? "Room" : "Thing",
                    Description = $"Opis urządzenia Voxel {i}.",
                    Location = $"Piętro {i % 5 + 1}, Pokój {100 + i}",
                    ImagePath = $"/images/voxel_{i}.png",
                    Organivzation = voxel,
                    Manager = manager,
                    TermsOfUse = "Używać zgodnie z regulaminem.",
                    AttachedDocuments = new List<string> { $"doc_voxel_{i}.pdf" },
                    Specs = $"Specyfikacja techniczna urządzenia Voxel {i}.",
                    Notes = i % 3 == 0 ? "Wymaga kalibracji co miesiąc." : null,
                    DateAdded = DateTime.UtcNow.AddDays(-i)
                };
                item.Comments = CreateComments(item, manager.Username);
                items.Add(item);
            }

            for (int i = 1; i <= 15; i++)
            {
                var manager = managers[rand.Next(2, 5)];
                var item = new Item
                {
                    Name = $"Raptors Equipment {i}",
                    Type = i % 2 == 0 ? "Thing" : "Room",
                    Description = $"Opis sprzętu Raptors {i}.",
                    Location = $"Laboratorium {i % 4 + 1}, Pokój {200 + i}",
                    ImagePath = $"/images/raptors_{i}.jpg",
                    Organivzation = raptors,
                    Manager = manager,
                    TermsOfUse = "Do użytku tylko przez upoważnione osoby.",
                    AttachedDocuments = new List<string> { $"raptors_manual_{i}.pdf" },
                    Specs = $"Parametry techniczne Raptors {i}.",
                    Notes = i % 5 == 0 ? "Nie działa z oprogramowaniem Linux." : null,
                    DateAdded = DateTime.UtcNow.AddDays(-i)
                };
                item.Comments = CreateComments(item, manager.Username);
                items.Add(item);
            }

            _context.Items.AddRange(items);
            _context.SaveChanges();

            // Seed Requests & Timespans
            var requests = new List<Request>();
            var renters = new[] { "adam.k", "ewa.p", "zofia.j", "marek.b", "piotr.m" };

            for (int i = 0; i < 12; i++)
            {
                var item = items[rand.Next(items.Count)];
                var respondent = rand.Next(0, 2) == 1 ? item.Manager : null;
                bool? approvedStatus = null;
                if (i % 3 == 0)
                {
                    approvedStatus = true;
                }
                else if (i % 3 == 1)
                {
                    approvedStatus = false;
                }

                var timespans = new List<Timespan>();
                var baseStart = DateTime.UtcNow.AddDays(rand.Next(1, 10));
                var tspanCount = rand.Next(1, 3);
                for (int j = 0; j < tspanCount; j++)
                {
                    timespans.Add(new Timespan
                    {
                        Start = baseStart.AddDays(j).AddHours(9),
                        End = baseStart.AddDays(j).AddHours(17)
                    });
                }

                requests.Add(new Request
                {
                    Item = item,
                    Renter = renters[rand.Next(renters.Length)],
                    Approved = approvedStatus,
                    Respondent = respondent,
                    type = item.Type,
                    RequestSubmitted = DateTime.UtcNow.AddDays(-rand.Next(1, 5)),
                    LastModified = approvedStatus != null ? DateTime.UtcNow : null,
                    AdditionalInfo = "Potrzebuję na projekt badawczy.",
                    RequestPeriod = timespans
                });

                _context.Timespans.AddRange(timespans);
            }

            _context.Requests.AddRange(requests);
            _context.SaveChanges();

            Console.WriteLine("✅ FULL DATABASE SEED COMPLETE: 5 Managers, 2 Orgs, 28 Items, 84 Comments, 12 Requests + Timespans.");
        }
    }
}
