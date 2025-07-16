using Application.Models;
using Application.Repositories;
using Domain.Entities;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class contragent_interaction_docUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public contragent_interaction_docUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<contragent_interaction_doc>> GetAll()
        {
            return unitOfWork.contragent_interaction_docRepository.GetAll();
        }
        public Task<contragent_interaction_doc> GetOne(int id)
        {
            return unitOfWork.contragent_interaction_docRepository.GetOne(id);
        }
        public async Task<contragent_interaction_doc> Create(contragent_interaction_doc domain)
        {
            if (domain.is_portal.HasValue && !domain.is_portal.Value)
            {
                domain.type_org = "bga";
            }
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
            }
            else
            {
                domain.file_id = null;
            }

            var result = await unitOfWork.contragent_interaction_docRepository.Add(domain);
            domain.id = result;

            unitOfWork.Commit();
            return domain;
        }

        public async Task<contragent_interaction_doc> Update(contragent_interaction_doc domain)
        {
            await unitOfWork.contragent_interaction_docRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<contragent_interaction_doc>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.contragent_interaction_docRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.contragent_interaction_docRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<contragent_interaction_doc>>  GetByfile_id(int file_id)
        {
            return unitOfWork.contragent_interaction_docRepository.GetByfile_id(file_id);
        }
        
        public Task<List<contragent_interaction_doc>>  GetByinteraction_id(int interaction_id)
        {
            return unitOfWork.contragent_interaction_docRepository.GetByinteraction_id(interaction_id);
        }
        
    }
}
