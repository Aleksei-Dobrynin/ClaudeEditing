using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class object_tagUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public object_tagUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<object_tag>> GetAll()
        {
            return unitOfWork.object_tagRepository.GetAll();
        }
        public Task<object_tag> GetOne(int id)
        {
            return unitOfWork.object_tagRepository.GetOne(id);
        }
        public async Task<object_tag> Create(object_tag domain)
        {
            var result = await unitOfWork.object_tagRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<object_tag> Update(object_tag domain)
        {
            await unitOfWork.object_tagRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<object_tag>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.object_tagRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.object_tagRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
