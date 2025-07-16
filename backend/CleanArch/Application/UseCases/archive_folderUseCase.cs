using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class archive_folderUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public archive_folderUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<archive_folder>> GetAll()
        {
            return unitOfWork.archive_folderRepository.GetAll();
        }
        public Task<archive_folder> GetOne(int id)
        {
            return unitOfWork.archive_folderRepository.GetOne(id);
        }
        public async Task<archive_folder> Create(archive_folder domain)
        {
            var result = await unitOfWork.archive_folderRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<archive_folder> Update(archive_folder domain)
        {
            await unitOfWork.archive_folderRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<archive_folder>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.archive_folderRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.archive_folderRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<archive_folder>>  GetBydutyplan_object_id(int dutyplan_object_id)
        {
            return unitOfWork.archive_folderRepository.GetBydutyplan_object_id(dutyplan_object_id);
        }
        
    }
}
