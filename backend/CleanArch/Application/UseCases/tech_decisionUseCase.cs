using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class tech_decisionUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public tech_decisionUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<tech_decision>> GetAll()
        {
            return unitOfWork.tech_decisionRepository.GetAll();
        }
        public Task<tech_decision> GetOne(int id)
        {
            return unitOfWork.tech_decisionRepository.GetOne(id);
        }
        public async Task<tech_decision> Create(tech_decision domain)
        {
            var result = await unitOfWork.tech_decisionRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<tech_decision> Update(tech_decision domain)
        {
            await unitOfWork.tech_decisionRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<tech_decision>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.tech_decisionRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.tech_decisionRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        //public Task<List<tech_decision>>  GetBydutyplan_object_id(int dutyplan_object_id)
        //{
        //    return unitOfWork.tech_decisionRepository.GetBydutyplan_object_id(dutyplan_object_id);
        //}
        
        //public Task<List<tech_decision>>  GetByapplication_id(int application_id)
        //{
        //    return unitOfWork.tech_decisionRepository.GetByapplication_id(application_id);
        //}
        
    }
}
