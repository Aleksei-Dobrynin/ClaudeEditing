using Application.Models;
using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class customers_for_archive_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public customers_for_archive_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public Task<List<customers_for_archive_object>> GetAll()
        {
            return unitOfWork.customers_for_archive_objectRepository.GetAll();
        }
        
        public Task<List<customers_objects>> GetCustomersForArchiveObjects()
        {
            return unitOfWork.customers_for_archive_objectRepository.GetCustomersForArchiveObjects();
        }
        public Task<customers_for_archive_object> GetOne(int id)
        {
            return unitOfWork.customers_for_archive_objectRepository.GetOne(id);
        }
        public Task<List<customers_for_archive_object>> GetByCustomersIdArchiveObject(int ArchiveObject_id)
        {
            return unitOfWork.customers_for_archive_objectRepository.GetByCustomersIdArchiveObject(ArchiveObject_id);
        }
        public async Task<customers_for_archive_object> Create(customers_for_archive_object domain)
        {
            var result = await unitOfWork.customers_for_archive_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<customers_for_archive_object> Update(customers_for_archive_object domain)
        {
            await unitOfWork.customers_for_archive_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<customers_for_archive_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.customers_for_archive_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.customers_for_archive_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}

