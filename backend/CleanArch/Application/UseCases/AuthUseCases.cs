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


        private readonly IUnitOfWork unitOfWork;

        public AuthUseCases(
            IAuthRepository authRepository,
            IN8nService n8nService,
            IUnitOfWork unitOfWork)

        {
            _authRepository = authRepository;
            n8NService = n8nService;
            this.unitOfWork = unitOfWork;
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
        public async Task<UserInfo> GetCurrentUser()
        {
            var userInfo = await _authRepository.GetUserInfo();

            var emploee = await unitOfWork.EmployeeRepository.GetByUserId(userInfo.Id);
            var employeePosts = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emploee.id);
            var structureId = employeePosts.Select(x => x.structure_id).FirstOrDefault();

            if (structureId != 0)
            {
                userInfo.idOrgStructure = structureId;
            }
            if (emploee != null)
            {
                userInfo.idEmployee = emploee.id;
            }
            return userInfo;
        }

        public Task<UserInfo> GetByUserId(string userId)
        {
            return _authRepository.GetByUserId(userId);
        }

        public async Task<bool> ForgotPassword(string email)
        {
            await _authRepository.ForgotPassword(email);
            await n8NService.UserSendPassword(email, "2ea6427b-6c15-4406-9639-cfb96f1b2d9e");
            return true;
        }

        public Task<string> Create(string username, string password)
        {
            return _authRepository.Create(username, password);
        }
    }
}
