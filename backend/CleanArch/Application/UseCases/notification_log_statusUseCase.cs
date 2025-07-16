using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class notification_log_statusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public notification_log_statusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<notification_log_status>> GetAll()
        {
            return unitOfWork.notification_log_statusRepository.GetAll();
        }
        public Task<notification_log_status> GetOne(int id)
        {
            return unitOfWork.notification_log_statusRepository.GetOne(id);
        }
        public async Task<notification_log_status> Create(notification_log_status domain)
        {
            var result = await unitOfWork.notification_log_statusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<notification_log_status> Update(notification_log_status domain)
        {
            await unitOfWork.notification_log_statusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<notification_log_status>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.notification_log_statusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.notification_log_statusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
