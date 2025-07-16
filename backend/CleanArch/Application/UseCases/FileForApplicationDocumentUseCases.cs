using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class FileForApplicationDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public FileForApplicationDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<FileForApplicationDocument>> GetAll()
        {
            return unitOfWork.FileForApplicationDocumentRepository.GetAll();
        } 
        
        public Task<List<FileForApplicationDocument>> GetByidDocument(int idDocument)
        {
            return unitOfWork.FileForApplicationDocumentRepository.GetByidDocument(idDocument);
        }
        
        public Task<FileForApplicationDocument> GetOneByID(int id)
        {
            return unitOfWork.FileForApplicationDocumentRepository.GetOneByID(id);
        }

        public async Task<Result<FileForApplicationDocument>> Create(FileForApplicationDocument domain)
        {
            if(domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
            }
            else
            {
                return Result.Fail(new LogicError("Документ не должен быть пустым!"));
            }

            var result = await unitOfWork.FileForApplicationDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<FileForApplicationDocument> Update(FileForApplicationDocument domain)
        {
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
            }

            await unitOfWork.FileForApplicationDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<FileForApplicationDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.FileForApplicationDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.FileForApplicationDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
