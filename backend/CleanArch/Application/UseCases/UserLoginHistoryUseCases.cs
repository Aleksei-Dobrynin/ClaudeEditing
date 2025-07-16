using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class UserLoginHistoryUseCases
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserLoginHistoryUseCases(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        public async Task SaveLoginUserData(string userId, string ipAddress, string device, string browser, string os)
        {
            await _unitOfWork.UserLoginHistoryRepository.SaveLoginUserData(userId, ipAddress, device, browser, os);
            _unitOfWork.Commit();
        }
    }
}
