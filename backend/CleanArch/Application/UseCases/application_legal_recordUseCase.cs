using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class application_legal_recordUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_legal_recordUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_legal_record>> GetAll()
        {
            return unitOfWork.application_legal_recordRepository.GetAll();
        }
        public Task<application_legal_record> GetOne(int id)
        {
            return unitOfWork.application_legal_recordRepository.GetOne(id);
        }
        public async Task<application_legal_record> Create(application_legal_record domain)
        {
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.application_legal_recordRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_legal_record> Update(application_legal_record domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.application_legal_recordRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_legal_record>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_legal_recordRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_legal_recordRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<application_legal_record>> GetByid_application(int id_application)
        {
            return unitOfWork.application_legal_recordRepository.GetByid_application(id_application);
        }

        public Task<List<application_legal_record>> GetByid_legalrecord(int id_legalrecord)
        {
            return unitOfWork.application_legal_recordRepository.GetByid_legalrecord(id_legalrecord);
        }

        public Task<List<application_legal_record>> GetByid_legalact(int id_legalact)
        {
            return unitOfWork.application_legal_recordRepository.GetByid_legalact(id_legalact);
        }

    }
}
