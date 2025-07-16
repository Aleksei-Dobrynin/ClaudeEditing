using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class archive_file_tagsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public archive_file_tagsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<archive_file_tags>> GetAll()
        {
            return unitOfWork.archive_file_tagsRepository.GetAll();
        }
        public Task<archive_file_tags> GetOne(int id)
        {
            return unitOfWork.archive_file_tagsRepository.GetOne(id);
        }
        public async Task<archive_file_tags> Create(archive_file_tags domain)
        {
            var result = await unitOfWork.archive_file_tagsRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<archive_file_tags> Update(archive_file_tags domain)
        {
            await unitOfWork.archive_file_tagsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<archive_file_tags>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.archive_file_tagsRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.archive_file_tagsRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<archive_file_tags>>  GetByfile_id(int file_id)
        {
            return unitOfWork.archive_file_tagsRepository.GetByfile_id(file_id);
        }
        
        public Task<List<archive_file_tags>>  GetBytag_id(int tag_id)
        {
            return unitOfWork.archive_file_tagsRepository.GetBytag_id(tag_id);
        }
        
    }
}
