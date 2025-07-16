using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class notificationUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public notificationUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<notification>> GetAll()
        {
            return unitOfWork.notificationRepository.GetAll();
        }
        public Task<notification> GetOne(int id)
        {
            return unitOfWork.notificationRepository.GetOne(id);
        }
        public async Task<notification> Create(notification domain)
        {
            var result = await unitOfWork.notificationRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<notification> Update(notification domain)
        {
            await unitOfWork.notificationRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }
        public async Task<int> ClearNotification(int id)
        {
            var notify = await GetOne(id);
            notify.has_read = true;
            await unitOfWork.notificationRepository.Update(notify);
            unitOfWork.Commit();
            return id;
        }

        public async Task<int> ClearNotifications()
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var notifications = await unitOfWork.notificationRepository.GetMyNotifications(userId);
            await unitOfWork.notificationRepository.ReadAll(notifications.Select(x => x.id).ToList());
            unitOfWork.Commit();
            return notifications.Count;
        }


        public Task<PaginatedList<notification>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.notificationRepository.GetPaginated(pageSize, pageNumber);
        }
        public async Task<List<notification>> GetMyNotifications()
        {

            var userId = await unitOfWork.UserRepository.GetUserID();
            return await unitOfWork.notificationRepository.GetMyNotifications(userId);
        }
        

        public async Task<int> Delete(int id)
        {
            await unitOfWork.notificationRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
