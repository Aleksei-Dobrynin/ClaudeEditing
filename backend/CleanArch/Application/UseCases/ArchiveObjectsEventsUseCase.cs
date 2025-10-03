using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ArchiveObjectsEventsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchiveObjectsEventsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ArchiveObjectsEvents>> GetAll()
        {
            return unitOfWork.ArchiveObjectsEventsrepository.GetAll();
        }

        public Task<ArchiveObjectsEvents> GetOneByID(int id)
        {
            return unitOfWork.ArchiveObjectsEventsrepository.GetOneByID(id);
        }

        public Task<List<ArchiveObjectsEvents>> GetByObjectId(int archiveObjectId)
        {
            return unitOfWork.ArchiveObjectsEventsrepository.GetByObjectId(archiveObjectId);
        }

        public Task<List<ArchiveObjectsEvents>> GetByEventTypeId(int eventTypeId)
        {
            return unitOfWork.ArchiveObjectsEventsrepository.GetByEventTypeId(eventTypeId);
        }

        public Task<PaginatedList<ArchiveObjectsEvents>> GetByObjectIdPaginated(int archiveObjectId, int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveObjectsEventsrepository.GetByObjectIdPaginated(archiveObjectId, pageSize, pageNumber);
        }

        public Task<PaginatedList<ArchiveObjectsEvents>> GetByEventTypeIdPaginated(int eventTypeId, int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveObjectsEventsrepository.GetByEventTypeIdPaginated(eventTypeId, pageSize, pageNumber);
        }

        public async Task<ArchiveObjectsEvents> Create(ArchiveObjectsEvents domain)
        {
            var result = await unitOfWork.ArchiveObjectsEventsrepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ArchiveObjectsEvents> Update(ArchiveObjectsEvents domain)
        {
            await unitOfWork.ArchiveObjectsEventsrepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ArchiveObjectsEvents>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveObjectsEventsrepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ArchiveObjectsEventsrepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}