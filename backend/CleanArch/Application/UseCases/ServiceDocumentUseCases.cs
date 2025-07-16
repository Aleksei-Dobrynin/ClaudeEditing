using Application.Models;
using Application.Repositories;
using Domain.Entities;
using iText.Kernel.Pdf.Canvas.Parser.Listener;

namespace Application.UseCases
{
    public class ServiceDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ServiceDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ServiceDocument>> GetAll()
        {
            return unitOfWork.ServiceDocumentRepository.GetAll();
        }

        public Task<List<ServiceDocument>> GetByidService(int idService)
        {
            return unitOfWork.ServiceDocumentRepository.GetByidService(idService);
        }

        public Task<List<ServiceDocument>> GetByidServiceInternal(int idService)
        {
            return unitOfWork.ServiceDocumentRepository.GetByidServiceCabinet(idService);
        }


        public Task<ServiceDocument> GetOneByID(int id)
        {
            return unitOfWork.ServiceDocumentRepository.GetOneByID(id);
        }

        public async Task<ServiceDocument> Create(ServiceDocument domain)
        {
            var result = await unitOfWork.ServiceDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ServiceDocument> Update(ServiceDocument domain)
        {
            await unitOfWork.ServiceDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ServiceDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ServiceDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ServiceDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }

        public async Task<List<ApplicationDocumentByService>> GetDocumentsByidServiceInternal(int idService)
        {
            var serviceDocs = await unitOfWork.ServiceDocumentRepository.GetByidService(idService);

            // Получаем уникальные application_document_id из service_document
            var uniqueDocuments = serviceDocs
                .GroupBy(sd => sd.application_document_id)
                .Select(g => g.First())
                .ToList();

            var filteredIds = uniqueDocuments
                .Where(sd => sd.application_document_id.HasValue)
                .Select(sd => sd.application_document_id.Value)
                .Distinct()
                .ToList();

            // Получаем все документы по ID
            var applicationDocuments = new List<ApplicationDocument>();
            foreach (var id in filteredIds)
            {
                var doc = await unitOfWork.ApplicationDocumentRepository.GetOneByID(id);
                if (doc != null)
                {
                    applicationDocuments.Add(doc);
                }
            }

            // Формируем итоговый список ApplicationDocumentByService
            var result = applicationDocuments
                .Select(doc => new ApplicationDocumentByService
                {
                    Id = doc.id,
                    Name = doc.name ?? string.Empty,
                    NameKg = doc.name_kg ?? string.Empty, // Если есть name_kg в ApplicationDocument
                    Code =  string.Empty,
                    Description = doc.description ?? string.Empty,
                    //DescriptionKg = doc.description_kg ?? string.Empty,
                    LawDescription = doc.law_description ?? string.Empty,
                    DocumentTypeId = doc.document_type_id,
                    DocIsOutcome = doc.doc_is_outcome,
                    IsRequired = uniqueDocuments
                        .FirstOrDefault(sd => sd.application_document_id == doc.id)?.is_required ?? false,
                    //TextColor = doc.text_color ?? string.Empty,
                    //BackgroundColor = doc.background_color ?? string.Empty
                })
                .ToList();

            return result;
        }

    }
}
