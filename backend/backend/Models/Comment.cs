namespace backend.Models
{
	public class Comment
	{
		public int Id { get; set; }
		public string Author { get; set; }
		public string Contents { get; set; }
		public DateTime Created { get; set; }
		public Item Item { get; set; }

		public Object ToJSON()
		{
			return new { id=Id,  author=Author, text=Contents, date=Created};
		}
	}
}
