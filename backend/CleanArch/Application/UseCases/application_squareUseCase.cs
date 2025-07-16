using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class application_squareUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_squareUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_square>> GetAll()
        {
            return unitOfWork.application_squareRepository.GetAll();
        }
        public Task<application_square> GetOne(int id)
        {
            return unitOfWork.application_squareRepository.GetOne(id);
        }
        public async Task<application_square> Create(application_square domain)
        {
            var result = await unitOfWork.application_squareRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_square> Update(application_square domain)
        {
            await unitOfWork.application_squareRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_square>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_squareRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_squareRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<application_square>>  GetByapplication_id(int application_id)
        {
            return unitOfWork.application_squareRepository.GetByapplication_id(application_id);
        }
        
        public Task<List<application_square>>  GetBystructure_id(int structure_id)
        {
            return unitOfWork.application_squareRepository.GetBystructure_id(structure_id);
        }
        
        public Task<List<application_square>>  GetByunit_type_id(int unit_type_id)
        {
            return unitOfWork.application_squareRepository.GetByunit_type_id(unit_type_id);
        }
        
    }
}
