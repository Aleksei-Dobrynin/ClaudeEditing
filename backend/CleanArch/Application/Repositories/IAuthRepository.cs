using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IAuthRepository
    {
        Task<AuthResult> Authenticate(string username, string password);
        Task<UserInfo> GetUserInfo();
        Task<UserInfo> ChangePassword(string currentPassword, string newPassword);
        Task<UserInfo> GetCurrentUser();
        Task<bool> IsSuperAdmin(string username);
        Task<List<string>> GetMyRoles();
        Task<List<int>> GetMyRoleIds();
        Task<UserInfo> GetByUserId(string userId);
        Task<bool> ForgotPassword(string email, string newPassword);
        Task<string> Create(string username, string password);
    }
}
