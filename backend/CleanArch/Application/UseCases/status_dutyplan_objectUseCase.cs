using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class status_dutyplan_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public status_dutyplan_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<status_dutyplan_object>> GetAll()
        {
            return unitOfWork.status_dutyplan_objectRepository.GetAll();
        }
        public Task<status_dutyplan_object> GetOne(int id)
        {
            return unitOfWork.status_dutyplan_objectRepository.GetOne(id);
        }
        public async Task<status_dutyplan_object> Create(status_dutyplan_object domain)
        {
            var result = await unitOfWork.status_dutyplan_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<status_dutyplan_object> Update(status_dutyplan_object domain)
        {
            await unitOfWork.status_dutyplan_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<status_dutyplan_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.status_dutyplan_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.status_dutyplan_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
