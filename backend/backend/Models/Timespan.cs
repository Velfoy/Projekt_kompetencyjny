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
				day = this.Start.Date, start = $"{this.Start.Hour}:{this.Start.Minute}",
				end = $"{this.End.Hour}:{this.End.Minute}"
			};
		}
	}
}
