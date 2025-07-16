using Application.Models;
using Application.Repositories;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class DocumentJournalsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DocumentJournalsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<DocumentJournals>> GetAll()
        {
            return unitOfWork.DocumentJournalsRepository.GetAll();
        }
        
        public async Task<DocumentJournals> GetOneByID(int id)
        {
            var result = await unitOfWork.DocumentJournalsRepository.GetOneByID(id);
            var journalTemplates = await unitOfWork.JournalPlaceholderRepository.GetByDocumentJournalId(id);
            result.template_types = journalTemplates.Select(x => new TemplateTypeOrderDto { id = x.template_id, order = x.order_number }).ToList();
            return result;
        }

        public async Task<DocumentJournals> Create(DocumentJournals domain)
        {
            var result = await unitOfWork.DocumentJournalsRepository.Add(domain);
            if (domain.template_types?.Count > 0)
            {
                foreach (var item in domain.template_types)
                {
                    var journal_template = new JournalPlaceholder
                    {
                        order_number = item.order,
                        template_id = item.id,
                        journal_id = result
                    };
                    await unitOfWork.JournalPlaceholderRepository.Add(journal_template);
                }
            }
            if (domain.status_ids?.Length > 0)
            {
                foreach (var item in domain.status_ids)
                {
                    var journal_template = new JournalAppStatus
                    {
                        status_id = item,
                        journal_id = result
                    };
                    await unitOfWork.DocumentJournalsRepository.AddStatus(journal_template);
                }
            }
            domain.id = result;
            unitOfWork.Commit();




            return domain;
        }

        public async Task<DocumentJournals> Update(DocumentJournals domain)
        {
            await unitOfWork.DocumentJournalsRepository.Update(domain);
            await unitOfWork.JournalPlaceholderRepository.DeleteByDocumentJournalId(domain.id);
            if (domain.template_types.Count > 0)
            {
                foreach (var item in domain.template_types)
                {
                    var journal_template = new JournalPlaceholder
                    {
                        order_number = item.order,
                        template_id = item.id,
                        journal_id = domain.id
                    };
                    await unitOfWork.JournalPlaceholderRepository.Add(journal_template);
                }
            }
            await unitOfWork.DocumentJournalsRepository.DeleteStatuses(domain.id);
            if (domain.status_ids?.Length > 0)
            {
                foreach (var item in domain.status_ids)
                {
                    var journal_template = new JournalAppStatus
                    {
                        status_id = item,
                        journal_id = domain.id
                    };
                    await unitOfWork.DocumentJournalsRepository.AddStatus(journal_template);
                }
            }
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<DocumentJournals>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DocumentJournalsRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DocumentJournalsRepository.Delete(id);
            unitOfWork.Commit();
        }
        
        public async Task<List<JournalPeriodType>> GetPeriodTypes()
        {
            return await unitOfWork.DocumentJournalsRepository.GetPeriodTypes();
        }
    }
}
