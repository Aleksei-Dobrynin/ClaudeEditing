using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class notification_logUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public notification_logUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        async public Task<List<notification_log>> GetAll()
        {
            var logs = await unitOfWork.notification_logRepository.GetAll();
            foreach (var log in logs)
            {
                if (log.user_id != null)
                {
                    var user = await unitOfWork.UserRepository.GetOneByID(log.user_id.Value);

                    if (user != null && user.userId != null)
                    {
                        var employee = await unitOfWork.EmployeeRepository.GetByUserId(user.userId);

                        log.user_name = employee.first_name + " " + employee.last_name + " " + employee.second_name;
                    }

                }
            }
            return logs;
        }

        public Task<List<notification_log>> GetUnsended()
        {
            return unitOfWork.notification_logRepository.GetUnsended();
        }

        public  async Task UpdateStatus(int id_status, int id)
        {
            await unitOfWork.notification_logRepository.UpdateStatus(id_status, id);
            unitOfWork.Commit();
        }

        public Task<notification_log> GetOne(int id)
        {
            return unitOfWork.notification_logRepository.GetOne(id);
        }

        public Task<List<notification_log>> GetByApplicationId(int id)
        {
            return unitOfWork.notification_logRepository.GetByApplicationId(id);
        }

        public Task<PaginatedList<notification_log>> GetAppLogBySearch(string? search, bool? showOnlyFailed, int? pageNumber, int? pageSize)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.notification_logRepository.GetAppLogBySearch(search, showOnlyFailed, pageNumber, pageSize);
        }

        public async Task<notification_log> Create(notification_log domain)
        {
            var result = await unitOfWork.notification_logRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task CreateRange(List<notification_log> domain)
        {
            foreach (var item in domain)
            {
                var result = await unitOfWork.notification_logRepository.Add(item);
            }
            //await unitOfWork.notification_logRepository.CreateRange(domain);
            unitOfWork.Commit();
        }

        public async Task<notification_log> Update(notification_log domain)
        {
            await unitOfWork.notification_logRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<notification_log>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.notification_logRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.notification_logRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



    }
}
