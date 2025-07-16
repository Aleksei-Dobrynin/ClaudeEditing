using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class FileTypeForApplicationDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public FileTypeForApplicationDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<FileTypeForApplicationDocument>> GetAll()
        {
            return unitOfWork.FileTypeForApplicationDocumentRepository.GetAll();
        }
        
        public Task<FileTypeForApplicationDocument> GetOneByID(int id)
        {
            return unitOfWork.FileTypeForApplicationDocumentRepository.GetOneByID(id);
        }

        public async Task<FileTypeForApplicationDocument> Create(FileTypeForApplicationDocument domain)
        {
            var result = await unitOfWork.FileTypeForApplicationDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<FileTypeForApplicationDocument> Update(FileTypeForApplicationDocument domain)
        {
            await unitOfWork.FileTypeForApplicationDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<FileTypeForApplicationDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.FileTypeForApplicationDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.FileTypeForApplicationDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
