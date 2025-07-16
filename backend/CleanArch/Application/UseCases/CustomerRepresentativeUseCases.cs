using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CustomerRepresentativeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomerRepresentativeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<CustomerRepresentative>> GetAll()
        {
            return unitOfWork.CustomerRepresentativeRepository.GetAll();
        }
        
        public Task<CustomerRepresentative> GetOneByID(int id)
        {
            return unitOfWork.CustomerRepresentativeRepository.GetOneByID(id);
        }
        
        public Task<List<CustomerRepresentative>> GetByidCustomer(int idCustomer)
        {
            return unitOfWork.CustomerRepresentativeRepository.GetByidCustomer(idCustomer);
        }

        public async Task<CustomerRepresentative> Create(CustomerRepresentative domain)
        {
            var result = await unitOfWork.CustomerRepresentativeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<CustomerRepresentative> Update(CustomerRepresentative domain)
        {
            await unitOfWork.CustomerRepresentativeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<CustomerRepresentative>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.CustomerRepresentativeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.CustomerRepresentativeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
