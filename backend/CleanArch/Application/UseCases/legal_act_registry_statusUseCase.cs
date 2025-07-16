using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class legal_act_registry_statusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public legal_act_registry_statusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<legal_act_registry_status>> GetAll()
        {
            return unitOfWork.legal_act_registry_statusRepository.GetAll();
        }
        public Task<legal_act_registry_status> GetOne(int id)
        {
            return unitOfWork.legal_act_registry_statusRepository.GetOne(id);
        }
        public async Task<legal_act_registry_status> Create(legal_act_registry_status domain)
        {

            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legal_act_registry_statusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<legal_act_registry_status> Update(legal_act_registry_status domain)
        {

            domain.updated_at = DateTime.Now;
            await unitOfWork.legal_act_registry_statusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<legal_act_registry_status>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legal_act_registry_statusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legal_act_registry_statusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
