namespace backend.Attributes;

public class AdminAccess : Attribute
{
    public string Id { get; set; }

    public AdminAccess(string id)
    {
        Id = id;
    }
}