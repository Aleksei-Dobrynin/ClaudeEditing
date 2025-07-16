using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class QueryFiltersUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public QueryFiltersUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<QueryFilters>> GetAll()
        {
            return unitOfWork.QueryFiltersRepository.GetAll();
        }
        
        public Task<List<QueryFilters>> GetByTargetTable(string targetTable)
        {
            return unitOfWork.QueryFiltersRepository.GetByTargetTable(targetTable);
        }
        
        public Task<QueryFilters> GetOneByID(int id)
        {
            return unitOfWork.QueryFiltersRepository.GetOneByID(id);
        }

        public async Task<QueryFilters> Create(QueryFilters domain)
        {
            var result = await unitOfWork.QueryFiltersRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<QueryFilters> Update(QueryFilters domain)
        {
            await unitOfWork.QueryFiltersRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<QueryFilters>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.QueryFiltersRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.QueryFiltersRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
