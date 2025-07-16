using Application.Models;
using Application.Repositories;
using Domain.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Application.UseCases
{
    public class ArchObjectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchObjectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ArchObject>> GetAll()
        {
            return unitOfWork.ArchObjectRepository.GetAll();
        }
        public Task<List<ArchObject>> GetByAppIdApplication(int application_id)
        {
            return unitOfWork.ArchObjectRepository.GetByAppIdApplication(application_id);
        }
        public Task<List<ArchObject>> GetBySearch(string text)
        {
            return unitOfWork.ArchObjectRepository.GetBySearch(text);
        }
        
        public async Task<ArchObject> GetOneByID(int id)
        {
            var tags = await unitOfWork.arch_object_tagRepository.GetByIdObject(id);
            var res = await unitOfWork.ArchObjectRepository.GetOneByID(id);
            res.tags = tags.Select(x => x.id_tag).ToArray();
            return res;
        }

        public async Task<ArchObject> Create(ArchObject domain)
        {
            var result = await unitOfWork.ArchObjectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            foreach (var tag in domain.tags)
            {
                arch_object_tag object_Tag = new arch_object_tag
                {
                    id_object = domain.id,
                    id_tag = tag
                };

                var newTag = await unitOfWork.arch_object_tagRepository.Add(object_Tag);
            }
            unitOfWork.Commit();

            return domain;
        }

        public async Task<ArchObject> Update(ArchObject domain)
        {
            await unitOfWork.ArchObjectRepository.Update(domain);

            var existingTags = await unitOfWork.arch_object_tagRepository.GetByIdObject(domain.id);
            var newTags = domain.tags;

            List<arch_object_tag> listToDelete = new List<arch_object_tag> { };
            var tagsToDelete = existingTags.Where(t => !newTags.Contains(t.id_tag));
            if(tagsToDelete != null)
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
                    id_object = domain.id,
                    id_tag = tag
                };
                await unitOfWork.arch_object_tagRepository.Add(newTag);
            }

            unitOfWork.Commit();

            return domain;
        }
        public async Task UpdateCoords(UpdateCoordsObjRequest domain)
        {
            var arch_objects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(domain.application_id);
            var userId = await unitOfWork.UserRepository.GetUserID();

            foreach (var arch_object in arch_objects)
            {
                arch_object.xcoordinate = domain.xcoord;
                arch_object.ycoordinate = domain.ycoord;
                arch_object.updated_at = DateTime.Now;
                arch_object.updated_by = userId;
                await unitOfWork.ArchObjectRepository.Update(arch_object);
            }

            unitOfWork.Commit();
        }

        public Task<PaginatedList<ArchObject>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchObjectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ArchObjectRepository.Delete(id);
            unitOfWork.Commit();
        }
        
        public async Task<string> GenerateNumber(int app_id)
        {
            var application = await unitOfWork.ApplicationRepository.GetOneByID(app_id);
            var lastNumber = await unitOfWork.ArchObjectRepository.GetLastNumber();
            int nextNumber = lastNumber + 1;
            var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);
            var workflowStages = await unitOfWork.WorkflowTaskTemplateRepository.GetByServiceId(application.service_id);
            var workflowStage = workflowStages.FirstOrDefault();
            var structure = await unitOfWork.OrgStructureRepository.GetOne(workflowStage.structure_id ?? 0);
            
            var datePart = DateTime.Now.ToString("yyyy-MM-dd");
            var serviceCode = service.short_name ?? "XX";
            var structureCode = structure.short_name ?? "YY";
            var paddedNumber = nextNumber.ToString("D6");

            var outgoingNumber = $"{paddedNumber}-{serviceCode}-{datePart}-{structureCode}";
            
            return outgoingNumber;
        }
    }
}
