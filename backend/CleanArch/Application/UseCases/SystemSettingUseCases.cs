using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class SystemSettingUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public SystemSettingUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<SystemSetting>> GetAll()
        {
            return unitOfWork.SystemSettingRepository.GetAll();
        }
        
        public Task<SystemSetting> GetOneByID(int id)
        {
            return unitOfWork.SystemSettingRepository.GetOneByID(id);
        }
        
        public Task<List<SystemSetting>> GetByCodes(List<string> codes)
        {
            return unitOfWork.SystemSettingRepository.GetByCodes(codes);
        }

        public async Task<SystemSetting> Create(SystemSetting domain)
        {
            var result = await unitOfWork.SystemSettingRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<SystemSetting> Update(SystemSetting domain)
        {
            await unitOfWork.SystemSettingRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<SystemSetting>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.SystemSettingRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.SystemSettingRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
