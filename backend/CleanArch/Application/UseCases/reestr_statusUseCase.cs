using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class reestr_statusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public reestr_statusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<reestr_status>> GetAll()
        {
            return unitOfWork.reestr_statusRepository.GetAll();
        }
        public Task<reestr_status> GetOne(int id)
        {
            return unitOfWork.reestr_statusRepository.GetOne(id);
        }
        public async Task<reestr_status> Create(reestr_status domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.created_by = user_id;
            domain.created_at = DateTime.Now;
            var result = await unitOfWork.reestr_statusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<reestr_status> Update(reestr_status domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;
            await unitOfWork.reestr_statusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<reestr_status>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.reestr_statusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.reestr_statusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
