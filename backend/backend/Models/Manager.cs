using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
	public class Manager
	{
		[Key]
		public int Id { get; set; }
		[StringLength(20)]
		public string Username { get; set; }//Politechnika-style email
		public List<Organization> Organizations { get; set; }
	}
}
