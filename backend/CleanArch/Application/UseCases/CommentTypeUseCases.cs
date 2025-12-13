using System.Text.Json;
using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CommentTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CommentTypeUseCases(IUnitOfWork unitOfWork, IAuthRepository authRepository)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<List<CommentType>> GetAll()
        {
            var items = await unitOfWork.CommentTypeRepository.GetAll();
            return items;
        }
        
        public async Task<CommentType> GetOneByID(int id)
        {
            var item = await unitOfWork.CommentTypeRepository.GetOneByID(id);
            return item;
        }

        public async Task<CommentType> Create(CommentType domain)
        {
            var result = await unitOfWork.CommentTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<CommentType> Update(CommentType domain)
        {
            await unitOfWork.CommentTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.CommentTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
