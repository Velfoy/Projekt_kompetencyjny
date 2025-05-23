﻿namespace backend.Models
{
	public class Item
	{
		public int Id { get; set; }
		public Organization Organivzation { get; set; }
		public string Type { get; set; }//Room or thing
		public string? Description { get; set; }//self evident
		public string? Location { get; set; }//How to find
		public string ImagePath { get; set; }//We don't store images in db its slow
		public Manager Manager { get; set; }//Guy who manages
		public string TermsOfUse { get; set; }//Rules for using the item
		public List<string> AttachedDocuments { get; set; } = new();
		public string? Specs { get; set; }
		public List<Comment> Comments { get; set; } = new();

	}
}
