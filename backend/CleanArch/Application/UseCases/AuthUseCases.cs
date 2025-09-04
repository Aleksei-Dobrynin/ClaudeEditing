using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Application.UseCases
{
    public class AuthUseCases
    {
        private readonly IAuthRepository _authRepository;
        private readonly IN8nService n8NService;
        public AuthUseCases(IAuthRepository authRepository, IN8nService n8nService)
        {
            _authRepository = authRepository;
            n8NService = n8nService;
        }

        public Task<AuthResult> Authenticate(string username, string password)
        {
            return _authRepository.Authenticate(username, password);
        }

        public Task<UserInfo> ChangePassword(string currentPassword, string newPassword)
        {
            var result = _authRepository.ChangePassword(currentPassword, newPassword);
            return result;
        }

        public Task<bool> IsSuperAdmin(string username)
        {
            return _authRepository.IsSuperAdmin(username);
        }
        public Task<List<string>> GetMyRoles()
        {
            return _authRepository.GetMyRoles();
        }
        public Task<UserInfo> GetCurrentUser()
        {
            return _authRepository.GetUserInfo();
        }

        public Task<UserInfo> GetByUserId(string userId)
        {
            return _authRepository.GetByUserId(userId);
        }
        
        private static string GenerateRandomPassword(int length = 8)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<bool> ForgotPassword(string email)
        {
            var newPassword = GenerateRandomPassword();
            var isReset = await _authRepository.ForgotPassword(email, newPassword);
            if (isReset)
            {
                await n8NService.UserSendNewPassword(email, newPassword);
            }
            return true;
        }

        public Task<string> Create(string username, string password)
        {
            return _authRepository.Create(username, password);
        }
    }
}
