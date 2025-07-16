using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class ArchiveObjectFileUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchiveObjectFileUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ArchiveObjectFile>> GetAll()
        {
            return unitOfWork.ArchiveObjectFileRepository.GetAll();
        }

        public Task<List<ArchiveObjectFile>> GetNotInFolder()
        {
            return unitOfWork.ArchiveObjectFileRepository.GetNotInFolder();
        }
        

        public async Task<List<ArchiveObjectFile>> GetByidArchiveObject(int idArchiveObject)
        {
            var res = await unitOfWork.ArchiveObjectFileRepository.GetByidArchiveObject(idArchiveObject);

            foreach (var file in res)
            {
                var tags = await unitOfWork.archive_doc_tagRepository.GetByFileId(file.id);
                file.tags = tags;
            }


            return res;
        }

        public Task<List<ArchiveObjectFile>> GetByidArchiveFolder(int idArchiveFolder)
        {
            return unitOfWork.ArchiveObjectFileRepository.GetByidArchiveFolder(idArchiveFolder);
        }

        public async Task<ArchiveObjectFile> GetOneByID(int id)
        {
            var res = await unitOfWork.ArchiveObjectFileRepository.GetOneByID(id);

            res.tags = await unitOfWork.archive_doc_tagRepository.GetByFileId(id);


            return res;
        }

        public async Task<Result<ArchiveObjectFile>> Create(ArchiveObjectFile domain)
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
            
            var result = await unitOfWork.ArchiveObjectFileRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<int> SetTagsToFile(int file_id, List<int> tag_ids)
        {
            var existingTags = await unitOfWork.archive_file_tagsRepository.GetByfile_id(file_id);

            var tagsToDelete = existingTags.Where(t => !tag_ids.Contains(t.tag_id ?? 0)).ToList();
            foreach (var tagToDelete in tagsToDelete)
            {
                await unitOfWork.archive_file_tagsRepository.Delete(tagToDelete.id);
            }

            var tagsToAdd = tag_ids.Where(tag => !existingTags.Any(t => t.tag_id == tag)).ToList();
            foreach (var tag in tagsToAdd)
            {
                archive_file_tags newTag = new archive_file_tags
                {
                    file_id = file_id,
                    tag_id = tag
                };
                await unitOfWork.archive_file_tagsRepository.Add(newTag);
            }
            unitOfWork.Commit();
            return 1;
        }
        public async Task<int> SendFilesToFolder(int folder_id, List<int> file_ids)
        {
            foreach (var file_id in file_ids)
            {
                var file = await unitOfWork.ArchiveObjectFileRepository.GetOneByID(file_id);
                file.archive_folder_id = folder_id;

                await unitOfWork.ArchiveObjectFileRepository.Update(file);
            }
            unitOfWork.Commit();
            return 1;
        }

        public async Task<ArchiveObjectFile> Update(ArchiveObjectFile domain)
        {
            await unitOfWork.ArchiveObjectFileRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ArchiveObjectFile>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveObjectFileRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ArchiveObjectFileRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
