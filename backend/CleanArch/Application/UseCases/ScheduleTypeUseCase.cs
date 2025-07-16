using Application.Models;
using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class ScheduleTypeUseCase
    {

        private readonly IUnitOfWork unitOfWork;

        public ScheduleTypeUseCase(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ScheduleType>> GetAll()
        {
            return unitOfWork.ScheduleTypeRepository.GetAll();
        }

        public Task<ScheduleType> GetOneByID(int id)
        {
            return unitOfWork.ScheduleTypeRepository.GetOneById(id);
        }

        public async Task<ScheduleType> Create(ScheduleType domain)
        {
            var result = await unitOfWork.ScheduleTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ScheduleType> Update(ScheduleType domain)
        {
            await unitOfWork.ScheduleTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ScheduleTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
