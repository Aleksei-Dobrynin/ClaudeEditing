using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class release_videoUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public release_videoUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<release_video>> GetAll()
        {
            return unitOfWork.release_videoRepository.GetAll();
        }
        public Task<release_video> GetOne(int id)
        {
            return unitOfWork.release_videoRepository.GetOne(id);
        }
        public async Task<release_video> Create(release_video domain)
        {
            var result = await unitOfWork.release_videoRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<release_video> Update(release_video domain)
        {
            await unitOfWork.release_videoRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<release_video>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.release_videoRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.release_videoRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<release_video>>  GetByrelease_id(int release_id)
        {
            return unitOfWork.release_videoRepository.GetByrelease_id(release_id);
        }
        
        public Task<List<release_video>>  GetByfile_id(int file_id)
        {
            return unitOfWork.release_videoRepository.GetByfile_id(file_id);
        }
        
    }
}
