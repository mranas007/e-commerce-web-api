namespace eCommerceApp.Application.DTOs.Users
{
    public class UserBaseDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
