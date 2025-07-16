using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class document_approvalUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public document_approvalUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<document_approval>> GetAll()
        {
            return unitOfWork.document_approvalRepository.GetAll();
        }
        public Task<document_approval> GetOne(int id)
        {
            return unitOfWork.document_approvalRepository.GetOne(id);
        }
        public async Task<document_approval> Create(document_approval domain)
        {
            var app_step = await unitOfWork.application_stepRepository.GetOne(domain.app_step_id ?? 0);
            var steps = await unitOfWork.application_stepRepository.GetByapplication_id(app_step.application_id ?? 0);
            var other_appr = await unitOfWork.document_approvalRepository.GetByAppStepIds(steps.Select(x => x.id).ToArray());
            var same_doc = other_appr.FirstOrDefault(x => x.document_type_id == domain.document_type_id);
            if(same_doc != null)
            {
                domain.app_document_id = same_doc.app_document_id;
            }

            var result = await unitOfWork.document_approvalRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<document_approval> Update(document_approval domain)
        {
            await unitOfWork.document_approvalRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<document_approval>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.document_approvalRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.document_approvalRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<document_approval>>  GetByapp_document_id(int app_document_id)
        {
            return unitOfWork.document_approvalRepository.GetByapp_document_id(app_document_id);
        }
        
        public Task<List<document_approval>>  GetByfile_sign_id(int file_sign_id)
        {
            return unitOfWork.document_approvalRepository.GetByfile_sign_id(file_sign_id);
        }
        
        public Task<List<document_approval>>  GetBydepartment_id(int department_id)
        {
            return unitOfWork.document_approvalRepository.GetBydepartment_id(department_id);
        }
        
        public Task<List<document_approval>>  GetByposition_id(int position_id)
        {
            return unitOfWork.document_approvalRepository.GetByposition_id(position_id);
        }
        
    }
}
