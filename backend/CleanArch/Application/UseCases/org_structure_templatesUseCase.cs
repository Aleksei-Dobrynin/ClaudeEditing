using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class org_structure_templatesUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public org_structure_templatesUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<org_structure_templates>> GetAll()
        {
            return unitOfWork.org_structure_templatesRepository.GetAll();
        }
        public Task<org_structure_templates> GetOne(int id)
        {
            return unitOfWork.org_structure_templatesRepository.GetOne(id);
        }
        public async Task<org_structure_templates> Create(org_structure_templates domain)
        {
            var result = await unitOfWork.org_structure_templatesRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<org_structure_templates> Update(org_structure_templates domain)
        {
            await unitOfWork.org_structure_templatesRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<org_structure_templates>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.org_structure_templatesRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.org_structure_templatesRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<org_structure_templates>>  GetBystructure_id(int structure_id)
        {
            return unitOfWork.org_structure_templatesRepository.GetBystructure_id(structure_id);
        }
        
        public Task<List<org_structure_templates>>  GetBytemplate_id(int template_id)
        {
            return unitOfWork.org_structure_templatesRepository.GetBytemplate_id(template_id);
        }
        public async Task<List<S_DocumentTemplateWithLanguage>> GetMyTemplates()
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            return await unitOfWork.org_structure_templatesRepository.GetMyTemplates(user_id);
        }
        
    }
}
