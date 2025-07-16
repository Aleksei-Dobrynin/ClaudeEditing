using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class contact_typeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public contact_typeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<contact_type>> GetAll()
        {
            return unitOfWork.contact_typeRepository.GetAll();
        }
        public Task<contact_type> GetOne(int id)
        {
            return unitOfWork.contact_typeRepository.GetOne(id);
        }
        public async Task<contact_type> Create(contact_type domain)
        {
            var result = await unitOfWork.contact_typeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<contact_type> Update(contact_type domain)
        {
            await unitOfWork.contact_typeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<contact_type>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.contact_typeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.contact_typeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
