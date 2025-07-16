using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class TechCouncilSessionUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly S_DocumentTemplateUseCases _S_DocumentTemplateUseCases;
        
        public TechCouncilSessionUseCases(IUnitOfWork unitOfWork, S_DocumentTemplateUseCases S_DocumentTemplateUseCases)
        {
            this.unitOfWork = unitOfWork;
            _S_DocumentTemplateUseCases = S_DocumentTemplateUseCases;
        }

        public Task<List<TechCouncilSession>> GetAll()
        {
            return unitOfWork.TechCouncilSessionRepository.GetAll();
        }
        
        public Task<List<TechCouncilSession>> GetArchiveAll()
        {
            return unitOfWork.TechCouncilSessionRepository.GetArchiveAll();
        }
        
        public Task<TechCouncilSession> GetOneByID(int id)
        {
            return unitOfWork.TechCouncilSessionRepository.GetOneByID(id);
        }

        public async Task<TechCouncilSession> Create(TechCouncilSession domain)
        {
            var result = await unitOfWork.TechCouncilSessionRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<TechCouncilSession> Update(TechCouncilSession domain)
        {
            await unitOfWork.TechCouncilSessionRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }
        
        public async Task<int> toArchive(int id)
        {
            var techCouncilSession = await unitOfWork.TechCouncilSessionRepository.GetOneByID(id);
            var listCases = await unitOfWork.TechCouncilRepository.GetTableBySession(id);
            var appIds = $"[{string.Join(",", listCases.Select(a => a.id))}]";

            var parameters = new Dictionary<string, object>
            {
                { "applicationids", appIds }
            };
            var document = await _S_DocumentTemplateUseCases.GetFilledDocumentHtmlByCode("tech_council_sheet", "ru", parameters);
            
            await unitOfWork.TechCouncilSessionRepository.toArchive(techCouncilSession, document.ValueOrDefault);
            unitOfWork.Commit();
            return id;
        }

        public Task<PaginatedList<TechCouncilSession>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.TechCouncilSessionRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.TechCouncilSessionRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
