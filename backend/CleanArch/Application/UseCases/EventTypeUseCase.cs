using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class EventTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public EventTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<EventType>> GetAll()
        {
            return unitOfWork.EventTypeRepository.GetAll();
        }
        
        public Task<EventType> GetOneByID(int id)
        {
            return unitOfWork.EventTypeRepository.GetOneByID(id);
        }

        public async Task<EventType> Create(EventType domain)
        {
            var result = await unitOfWork.EventTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<EventType> Update(EventType domain)
        {
            await unitOfWork.EventTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<EventType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.EventTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.EventTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}