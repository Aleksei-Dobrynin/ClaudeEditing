using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CustomSubscribtionUseCase
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomSubscribtionUseCase(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<List<CustomSubscribtionIncludes>> GetAll()
        {
            return await unitOfWork.CustomSubscribtionRepository.GetAll();
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByIdEmployee(int id)
        {
            return await unitOfWork.CustomSubscribtionRepository.GetByIdEmployee(id);
        }

        public async Task<CustomSubscribtionIncludes> GetOneById(int id)
        {
            return await unitOfWork.CustomSubscribtionRepository.GetOneById(id);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.CustomSubscribtionRepository.Delete(id);
            unitOfWork.Commit();
            return;
        }
        public async Task<List<CustomSubscribtionIncludes>> GetByidSubscriberType(int idSubscriberType)
        {
            return await unitOfWork.CustomSubscribtionRepository.GetByidSubscriberType(idSubscriberType);
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidSchedule(int idSchedule)
        {
            return await unitOfWork.CustomSubscribtionRepository.GetByidSchedule(idSchedule);
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidRepeatType(int idRepeatType)
        {
            var respone = await unitOfWork.CustomSubscribtionRepository.GetByidRepeatType(idRepeatType);
            return respone;
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidDocument(int idDocument)
        {
            return await unitOfWork.CustomSubscribtionRepository.GetByidDocument(idDocument);
        }
        public async Task<int> Create(CustomSubscribtion domain, SubscribtionContactType domainSubscribtionContactType)
        {
            if (domain.idStructurePost != null)
            {
                domain.idEmployee = null;
            }
            var response = await unitOfWork.CustomSubscribtionRepository.Add(domain, domainSubscribtionContactType);
            unitOfWork.Commit();
            return response;
        }
        public async Task<bool> Update(CustomSubscribtion domain, SubscribtionContactType domainSubscribtionContactType)
        {
            if (domain.idStructurePost != null)
            {
                domain.idEmployee = null;
            }
            var response = await unitOfWork.CustomSubscribtionRepository.Update(domain, domainSubscribtionContactType);
            unitOfWork.Commit();
            return response;
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidAutoChannel(int idAutoChannel)
        {
            return await unitOfWork.CustomSubscribtionRepository.GetByidAutoChannel(idAutoChannel);
        }

        
    }
}
