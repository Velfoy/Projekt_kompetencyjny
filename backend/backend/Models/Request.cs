using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace backend.Models
{
	public class Request
	{
		public int Id { get; set; }//id
		public Item Item { get; set; }//item -> item.Description, item_id -> item.Id, type -> item.type unit -> item.Organivzation.Name
		public string Renter { get; set; }//id of the guy who took the item
		public string Title { get; set; }
		public bool? Approved { get; set; }//status
		public Manager? Respondent { get; set; }//Manager who approved/denied request
		public string? type { get; set; }//type
		public DateTime RequestSubmitted { get; set; }
		public DateTime? LastModified { get; set; }
		public List<Timespan> RequestPeriod { get; set; } = new();
		public string? AdditionalInfo { get; set; }

		public string ApprovalStatus { 
			get {
				string? approval_status = null;
				if (Approved == null)
				{
					approval_status = "Brak akceptacji";
				}
				else
				{
					approval_status ??= (bool)(Approved) ? "W trakcie" : "Odrzucona";//This is the worst code I've written in a while
				}
				return approval_status;
			} 
		}

		public Object ToJSON()
		{
			var approval_status = ApprovalStatus;
			return new { id = Id, type = Item.Type, item = Item.Description, item_id = Item.Id, unit = Item.Organivzation.Name, status = approval_status, termin_id = Id };
		}
	}
}
