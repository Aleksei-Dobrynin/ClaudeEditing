using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_DocumentTemplateTranslationUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_DocumentTemplateTranslationUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_DocumentTemplateTranslation>> GetAll()
        {
            return unitOfWork.S_DocumentTemplateTranslationRepository.GetAll();
        }
        public Task<S_DocumentTemplateTranslation> GetOne(int id)
        {
            return unitOfWork.S_DocumentTemplateTranslationRepository.GetOne(id);
        }
        public async Task<S_DocumentTemplateTranslation> Create(S_DocumentTemplateTranslation domain)
        {
            var result = await unitOfWork.S_DocumentTemplateTranslationRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_DocumentTemplateTranslation> Update(S_DocumentTemplateTranslation domain)
        {
            await unitOfWork.S_DocumentTemplateTranslationRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_DocumentTemplateTranslation>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_DocumentTemplateTranslationRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_DocumentTemplateTranslationRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public async Task<List<S_DocumentTemplateTranslation>>  GetByidDocumentTemplate(int idDocumentTemplate)
        {
            var languages = await unitOfWork.LanguageRepository.GetAll();
            var res =  await unitOfWork.S_DocumentTemplateTranslationRepository.GetByidDocumentTemplate(idDocumentTemplate);
            languages.ForEach(lang =>
            {
                if(!res.Any(x => x.idLanguage == lang.id))
                {
                    res.Add(new S_DocumentTemplateTranslation
                    {
                        id = 0,
                        idLanguage = lang.id,
                        idDocumentTemplate = idDocumentTemplate,
                        idLanguage_name = lang.name,
                    });
                }
            });

            return res;
        }
        
        public Task<List<S_DocumentTemplateTranslation>>  GetByidLanguage(int idLanguage)
        {
            return unitOfWork.S_DocumentTemplateTranslationRepository.GetByidLanguage(idLanguage);
        }
        
    }
}
