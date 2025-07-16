using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class StructureTemplatesUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructureTemplatesUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<StructureTemplates>> GetAllForStructure(int structure_id)
        {
            return unitOfWork.StructureTemplatesRepository.GetAllForStructure(structure_id);
        }
        
        public Task<StructureTemplates> GetOneByID(int id)
        {
            return unitOfWork.StructureTemplatesRepository.GetOneByID(id);
        }

        public async Task<StructureTemplates> Create(StructureTemplates domain)
        {
            var templateType = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("structure_template");
            domain.idDocumentType = templateType.id;

            var template = new S_DocumentTemplate
            {
                name = domain.name,
                description = domain.description,
                idDocumentType = domain.idDocumentType,
                translations = domain.translations,
            };
            var templateId = await unitOfWork.S_DocumentTemplateRepository.Add(template);
            domain.template_id = templateId;
            domain.translations.ForEach(x =>
            {
                x.id = 0;
                x.idDocumentTemplate = templateId;
                unitOfWork.S_DocumentTemplateTranslationRepository.Add(x);
            });
            var result = await unitOfWork.StructureTemplatesRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureTemplates> Update(StructureTemplates domain)
        {
            var templateType = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("structure_template");
            domain.idDocumentType = templateType.id;

            var template = new S_DocumentTemplate
            {
                id = domain.template_id,
                name = domain.name,
                description = domain.description,
                idDocumentType = domain.idDocumentType,
                translations = domain.translations,
            };
            await unitOfWork.S_DocumentTemplateRepository.Update(template);
            foreach (var x in domain.translations)
            {
                x.idDocumentTemplate = domain.template_id;
                if (x.id == 0)
                {
                    await unitOfWork.S_DocumentTemplateTranslationRepository.Add(x);
                }
                else
                {
                    await unitOfWork.S_DocumentTemplateTranslationRepository.Update(x);
                }
            };
            await unitOfWork.StructureTemplatesRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructureTemplates>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructureTemplatesRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            var item = await unitOfWork.StructureTemplatesRepository.GetOneByID(id);
            await unitOfWork.StructureTemplatesRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
