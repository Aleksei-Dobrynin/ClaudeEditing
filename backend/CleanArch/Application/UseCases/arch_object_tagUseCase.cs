using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class arch_object_tagUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public arch_object_tagUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<arch_object_tag>> GetAll()
        {
            return unitOfWork.arch_object_tagRepository.GetAll();
        }

        public async Task<List<arch_object_tag>> GetByIDTag(int idTag)
        {
            var all = await unitOfWork.arch_object_tagRepository.GetAll();
            var res = all.Where(x => x.id_tag == idTag).ToList();
            return res;
        }

        public async Task<List<arch_object_tag>> GetByIDarch_object(int idObject)
        {
            var all = await unitOfWork.arch_object_tagRepository.GetAll();
            var res = all.Where(x => x.id_object == idObject).ToList();
            return res;
        }

        public Task<arch_object_tag> GetOne(int id)
        {
            return unitOfWork.arch_object_tagRepository.GetOne(id);
        }
        public async Task<arch_object_tag> Create(arch_object_tag domain)
        {
            var result = await unitOfWork.arch_object_tagRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<arch_object_tag> Update(arch_object_tag domain)
        {
            await unitOfWork.arch_object_tagRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<arch_object_tag>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.arch_object_tagRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task AddOrUpdateObjectTagsByApplication(int[] newTags, int application_id)
        {
            var objects = await unitOfWork.application_objectRepository.GetByapplication_id(application_id);
            foreach (var obj in objects)
            {
                await AddOrUpdateObjectTags(newTags, obj.arch_object_id);
            }
        }
        async Task AddOrUpdateObjectTags(int[] newTags, int arch_object_id)
        {
            var existingTags = await unitOfWork.arch_object_tagRepository.GetByIdObject(arch_object_id);

            List<arch_object_tag> listToDelete = new List<arch_object_tag> { };
            var tagsToDelete = existingTags.Where(t => !newTags.Contains(t.id_tag));
            if (tagsToDelete != null)
            {
                listToDelete = tagsToDelete.ToList();
            }
            foreach (var tagToDelete in listToDelete)
            {
                await unitOfWork.arch_object_tagRepository.Delete(tagToDelete.id);
            }

            var tagsToAdd = newTags.Where(tag => !existingTags.Any(t => t.id_tag == tag)).ToList();
            foreach (var tag in tagsToAdd)
            {
                arch_object_tag newTag = new arch_object_tag
                {
                    id_object = arch_object_id,
                    id_tag = tag
                };
                await unitOfWork.arch_object_tagRepository.Add(newTag);
            }
            unitOfWork.Commit();
        }
        public async Task<int> Delete(int id)
        {
            await unitOfWork.arch_object_tagRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
