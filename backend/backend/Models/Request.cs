namespace backend.Models
{
	public class Request
	{
		public int Id { get; set; }//id
		public Item Item { get; set; }//item -> item.Description, item_id -> item.Id, type -> item.type unit -> item.Organivzation.Name
		public string Renter { get; set; }//id of the guy who took the item
		public bool? Approved { get; set; }//status
		public Manager? Respondent { get; set; }//Manager who approved/denied request
		public string? type { get; set; }//type
		public DateTime RequestSubmitted { get; set; }
		public DateTime? LastModified { get; set; }
		public List<Timespan> RequestPeriod { get; set; } = new();
		public string? AdditionalInfo { get; set; }

		public Object ToJSON()
		{
			string? approval_status = null;
			if (Approved == null)
			{
				approval_status = "Brak akceptacji";
			} else
			{
				foreach (var t in RequestPeriod)
				{
					if (t.Start < DateTime.Now && t.End < DateTime.Now)
					{
						approval_status = "W trakcie";
						break;
					}
				}
				approval_status ??= (bool)(Approved) ? "Zakończona" : "Odrzucona";//This is the worst code I've written in a while
			}
				return new { id = Id, type = Item.Type, item = Item.Description, item_id = Item.Id, unit = Item.Organivzation.Name, status = approval_status, termin_id = Id };
		}
	}
}
