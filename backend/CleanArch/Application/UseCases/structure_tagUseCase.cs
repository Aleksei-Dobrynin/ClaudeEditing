using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class structure_tagUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public structure_tagUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<structure_tag>> GetAll()
        {
            return unitOfWork.structure_tagRepository.GetAll();
        }
        public Task<structure_tag> GetOne(int id)
        {
            return unitOfWork.structure_tagRepository.GetOne(id);
        }
        public async Task<structure_tag> Create(structure_tag domain)
        {
            var result = await unitOfWork.structure_tagRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<structure_tag> Update(structure_tag domain)
        {
            await unitOfWork.structure_tagRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<structure_tag>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.structure_tagRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.structure_tagRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<structure_tag>>  GetBystructure_id(int structure_id)
        {
            return unitOfWork.structure_tagRepository.GetBystructure_id(structure_id);
        }
        
    }
}
