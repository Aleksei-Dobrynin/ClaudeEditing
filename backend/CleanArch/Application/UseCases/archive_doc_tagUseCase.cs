using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class archive_doc_tagUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public archive_doc_tagUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<archive_doc_tag>> GetAll()
        {
            return unitOfWork.archive_doc_tagRepository.GetAll();
        }
        public Task<archive_doc_tag> GetOne(int id)
        {
            return unitOfWork.archive_doc_tagRepository.GetOne(id);
        }
        public async Task<archive_doc_tag> Create(archive_doc_tag domain)
        {
            var result = await unitOfWork.archive_doc_tagRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<archive_doc_tag> Update(archive_doc_tag domain)
        {
            await unitOfWork.archive_doc_tagRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<archive_doc_tag>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.archive_doc_tagRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.archive_doc_tagRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
