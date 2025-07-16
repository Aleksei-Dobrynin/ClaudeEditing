using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class step_required_documentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public step_required_documentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<step_required_document>> GetAll()
        {
            return unitOfWork.step_required_documentRepository.GetAll();
        }
        public Task<step_required_document> GetOne(int id)
        {
            return unitOfWork.step_required_documentRepository.GetOne(id);
        }
        public async Task<step_required_document> Create(step_required_document domain)
        {
            var result = await unitOfWork.step_required_documentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<step_required_document> Update(step_required_document domain)
        {
            await unitOfWork.step_required_documentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<step_required_document>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.step_required_documentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.step_required_documentRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<step_required_document>>  GetBystep_id(int step_id)
        {
            return unitOfWork.step_required_documentRepository.GetBystep_id(step_id);
        }    
        
        public async Task<List<step_required_document>> GetByPathId(int path_id)
        {
            //TODO better use new db query 
            var steps = (await unitOfWork.path_stepRepository.GetBypath_id(path_id)).Select(x=>(int?)x.id).ToList();
            var all = await unitOfWork.step_required_documentRepository.GetAll();
            var res = all.Where(x => steps.Contains(x.step_id)).ToList();
            return res;
        }
        
        public Task<List<step_required_document>>  GetBydocument_type_id(int document_type_id)
        {
            return unitOfWork.step_required_documentRepository.GetBydocument_type_id(document_type_id);
        }
        
    }
}
