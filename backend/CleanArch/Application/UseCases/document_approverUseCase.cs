using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class document_approverUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public document_approverUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<document_approver>> GetAll()
        {
            return unitOfWork.document_approverRepository.GetAll();
        }
        public Task<document_approver> GetOne(int id)
        {
            return unitOfWork.document_approverRepository.GetOne(id);
        }
        public async Task<document_approver> Create(document_approver domain)
        {
            var result = await unitOfWork.document_approverRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<document_approver> Update(document_approver domain)
        {
            await unitOfWork.document_approverRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<document_approver>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.document_approverRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.document_approverRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<document_approver>> GetBystep_doc_id(int step_doc_id)
        {
            return unitOfWork.document_approverRepository.GetBystep_doc_id(step_doc_id);
        }

        public Task<List<document_approver>> GetBydepartment_id(int department_id)
        {
            return unitOfWork.document_approverRepository.GetBydepartment_id(department_id);
        }

        public Task<List<document_approver>> GetByposition_id(int position_id)
        {
            return unitOfWork.document_approverRepository.GetByposition_id(position_id);
        }
        public Task<List<document_approver>> GetByPathId(int pathId)
        {
            return unitOfWork.document_approverRepository.GetByPathId(pathId);
        }

    }
}
