using System.Text.Json;
using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationCommentAssigneeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationCommentAssigneeUseCases(IUnitOfWork unitOfWork, IAuthRepository authRepository)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<List<ApplicationCommentAssignee>> GetAll()
        {
            var items = await unitOfWork.ApplicationCommentAssigneeRepository.GetAll();
            return items;
        }
        
        public async Task<ApplicationCommentAssignee> GetOneByID(int id)
        {
            var item = await unitOfWork.ApplicationCommentAssigneeRepository.GetOneByID(id);
            return item;
        }

        public async Task<ApplicationCommentAssignee> Create(ApplicationCommentAssignee domain)
        {
            var result = await unitOfWork.ApplicationCommentAssigneeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationCommentAssignee> Update(ApplicationCommentAssignee domain)
        {
            await unitOfWork.ApplicationCommentAssigneeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationCommentAssigneeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
