namespace backend.Models
{
	public class Organization
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<Manager> Admins { get; set; }
	}
}
