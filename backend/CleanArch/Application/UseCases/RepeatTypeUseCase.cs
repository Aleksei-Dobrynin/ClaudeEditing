using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class RepeatTypeUseCase
    {
        private readonly IUnitOfWork unitOfWork;

        public RepeatTypeUseCase(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<RepeatType>> GetAll()
        {
            return unitOfWork.RepeatTypeRepository.GetAll();
        }

        public Task<RepeatType> GetOneByID(int id)
        {
            return unitOfWork.RepeatTypeRepository.GetOneById(id);
        }

        public async Task<RepeatType> Create(RepeatType domain)
        {
            var result = await unitOfWork.RepeatTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<RepeatType> Update(RepeatType domain)
        {
            await unitOfWork.RepeatTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.RepeatTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
