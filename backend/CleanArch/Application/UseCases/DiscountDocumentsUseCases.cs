using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class DiscountDocumentsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public DiscountDocumentsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<DiscountDocuments>> GetAll()
        {
            return unitOfWork.DiscountDocumentsRepository.GetAll();
        }
        
        public Task<DiscountDocuments> GetOneByID(int id)
        {
            return unitOfWork.DiscountDocumentsRepository.GetOneByID(id);
        }

        public async Task<DiscountDocuments> Create(DiscountDocuments domain)
        {
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var idFile = await unitOfWork.FileRepository.Add(document);
                domain.file_id = idFile;
            }
            
            var result = await unitOfWork.DiscountDocumentsRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Result<DiscountDocuments>> Update(DiscountDocuments domain)
        {
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var idFile = await unitOfWork.FileRepository.Add(document);
                domain.file_id = idFile;
            }
            else
            {
                return Result.Fail(new LogicError("Документ не должен быть пустым!"));
            }
            
            await unitOfWork.DiscountDocumentsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<DiscountDocuments>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.DiscountDocumentsRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.DiscountDocumentsRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
