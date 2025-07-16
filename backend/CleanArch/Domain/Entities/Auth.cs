
namespace Domain.Entities
{
    public class AuthToken
    {
        public string token { get; set; }
    }

    public class UserInfo
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Id { get; set; }
        public int? idEmployee { get; set; }
        public int? idOrgStructure { get; set; }
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Message { get; set; }
    }
}
