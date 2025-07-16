using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class structure_tag_applicationUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public structure_tag_applicationUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<structure_tag_application>> GetAll()
        {
            return unitOfWork.structure_tag_applicationRepository.GetAll();
        }
        public Task<structure_tag_application> GetOne(int id)
        {
            return unitOfWork.structure_tag_applicationRepository.GetOne(id);
        }
        public Task<structure_tag_application> GetForApplication(int structure_id, int application_id)
        {
            return unitOfWork.structure_tag_applicationRepository.GetForApplication(structure_id, application_id);
        }
        public async Task<structure_tag_application> Create(structure_tag_application domain)
        {
            var result = await unitOfWork.structure_tag_applicationRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<structure_tag_application> Update(structure_tag_application domain)
        {
            await unitOfWork.structure_tag_applicationRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<structure_tag_application>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.structure_tag_applicationRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.structure_tag_applicationRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<structure_tag_application>>  GetBystructure_tag_id(int structure_tag_id)
        {
            return unitOfWork.structure_tag_applicationRepository.GetBystructure_tag_id(structure_tag_id);
        }
        
        public Task<List<structure_tag_application>>  GetBystructure_id(int structure_id)
        {
            return unitOfWork.structure_tag_applicationRepository.GetBystructure_id(structure_id);
        }
        public Task<List<structure_tag_application>> GetByapplication_id(int application_id)
        {
            return unitOfWork.structure_tag_applicationRepository.GetByapplication_id(application_id);
        }
        
    }
}
