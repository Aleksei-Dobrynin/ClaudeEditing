using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class structure_application_logUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public structure_application_logUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<structure_application_log>> GetAll()
        {
            return unitOfWork.structure_application_logRepository.GetAll();
        }
        public async Task<List<structure_application_log>> GetAllMyStructure()
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.structure_application_logRepository.GetAllMyStructure(user_id);
        }
        public async Task<bool> ChangeStatus(int id, string status)
        {
            var log = await GetOne(id);
            log.status_code = status;
            log.updated_at = DateTime.Now;
            var user_id = await unitOfWork.UserRepository.GetUserID();
            log.updated_by = user_id;
            if (status == "accepted")
            {
                log.status = "Принят";
            }else if(status == "rejected")
            {
                log.status = "Отклонен";
            }
            await unitOfWork.structure_application_logRepository.Update(log);
            unitOfWork.Commit();
            return true;
        }
        public Task<structure_application_log> GetOne(int id)
        {
            return unitOfWork.structure_application_logRepository.GetOne(id);
        }
        public async Task<structure_application_log> Create(structure_application_log domain)
        {
            var result = await unitOfWork.structure_application_logRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<structure_application_log> Update(structure_application_log domain)
        {
            await unitOfWork.structure_application_logRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<structure_application_log>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.structure_application_logRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.structure_application_logRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
