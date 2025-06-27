namespace backend.Models
{
	public class Timespan
	{
		public int Id { get; set; }
		public DateTime Start { get; set; }
		public DateTime End { get; set; }

		public Object ToJSON()
		{
			return new
			{
				day = $"{Start.Day:D2}.{Start.Month:D2}.{Start.Year:D4}", from = $"{Start.Hour:D2}:{Start.Minute:D2}",
				to = $"{End.Hour:D2}:{End.Minute:D2}"
			};
		}
	}
}
