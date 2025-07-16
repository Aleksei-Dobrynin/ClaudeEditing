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
    public class ArchiveObjectCustomerUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchiveObjectCustomerUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public Task<List<ArchiveObjectCustomer>> GetAll()
        {
            return unitOfWork.ArchiveObjectCustomerRepository.GetAll();
        }
        public Task<ArchiveObjectCustomer> GetOne(int id)
        {
            return unitOfWork.ArchiveObjectCustomerRepository.GetOne(id);
        }
        public async Task<ArchiveObjectCustomer> Create(ArchiveObjectCustomer domain)
        {
            var result = await unitOfWork.ArchiveObjectCustomerRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ArchiveObjectCustomer> Update(ArchiveObjectCustomer domain)
        {
            await unitOfWork.ArchiveObjectCustomerRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ArchiveObjectCustomer>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveObjectCustomerRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.ArchiveObjectCustomerRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}
