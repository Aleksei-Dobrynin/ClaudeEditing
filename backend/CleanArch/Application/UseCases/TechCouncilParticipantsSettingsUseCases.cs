using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class TechCouncilParticipantsSettingsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public TechCouncilParticipantsSettingsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<TechCouncilParticipantsSettings>> GetAll()
        {
            return unitOfWork.TechCouncilParticipantsSettingsRepository.GetAll();
        }
        
        public Task<List<TechCouncilParticipantsSettings>> GetByServiceId(int service_id)
        {
            return unitOfWork.TechCouncilParticipantsSettingsRepository.GetByServiceId(service_id);
        }
        
        public Task<List<TechCouncilParticipantsSettings>> GetActiveParticipantsByServiceId(int service_id)
        {
            return unitOfWork.TechCouncilParticipantsSettingsRepository.GetActiveParticipantsByServiceId(service_id);
        }
        
        public Task<TechCouncilParticipantsSettings> GetOneByID(int id)
        {
            return unitOfWork.TechCouncilParticipantsSettingsRepository.GetOneByID(id);
        }

        public async Task<TechCouncilParticipantsSettings> Create(TechCouncilParticipantsSettings domain)
        {
            var result = await unitOfWork.TechCouncilParticipantsSettingsRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<TechCouncilParticipantsSettings> Update(TechCouncilParticipantsSettings domain)
        {
            await unitOfWork.TechCouncilParticipantsSettingsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<TechCouncilParticipantsSettings>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.TechCouncilParticipantsSettingsRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.TechCouncilParticipantsSettingsRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
