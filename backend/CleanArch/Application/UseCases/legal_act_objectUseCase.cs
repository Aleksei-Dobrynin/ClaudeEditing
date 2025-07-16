using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class legal_act_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public legal_act_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<legal_act_object>> GetAll()
        {
            return unitOfWork.legal_act_objectRepository.GetAll();
        }
        public Task<legal_act_object> GetOne(int id)
        {
            return unitOfWork.legal_act_objectRepository.GetOne(id);
        }
        public async Task<legal_act_object> Create(legal_act_object domain)
        {

            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legal_act_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<legal_act_object> Update(legal_act_object domain)
        {

            domain.updated_at = DateTime.Now;
            await unitOfWork.legal_act_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<legal_act_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legal_act_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legal_act_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<legal_act_object>>  GetByid_act(int id_act)
        {
            return unitOfWork.legal_act_objectRepository.GetByid_act(id_act);
        }
        
        public Task<List<legal_act_object>>  GetByid_object(int id_object)
        {
            return unitOfWork.legal_act_objectRepository.GetByid_object(id_object);
        }
        
    }
}
