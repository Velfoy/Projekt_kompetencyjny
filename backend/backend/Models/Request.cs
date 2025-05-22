namespace backend.Models
{
	public class Request
	{
		public int Id { get; set; }
		public Item Item { get; set; }
		public string Renter { get; set; }//id of the guy who took the item
		public bool? Approved { get; set; }
		public Manager? Respondent { get; set; }//Manager who approved/denied request
		public string? type { get; set; }//I have no idea what is this for
		public DateTime RequestSubmitted { get; set; }
		public DateTime? LastModified { get; set; }
		public List<Timespan> RequestPeriod { get; set; } = new();
		public string? AdditionalInfo { get; set; }

	}
}
