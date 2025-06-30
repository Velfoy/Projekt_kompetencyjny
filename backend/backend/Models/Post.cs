namespace backend.Models
{
	public class Post
	{
		public int Id { get; set; }
		public string Title { get; set; }
		public string Text { get; set; }
		public string Image { get; set; }
		public bool Highlight { get; set; }
		public Manager Author { get; set; }
		public string? ButtonText { get; set; }
		public string? Link { get; set; }

		public Object ToJSON()
		{
			return new { title = Title, text = Text, image = Image, highlight = Highlight, button = ButtonText, link = Link };
		}
	}
}
