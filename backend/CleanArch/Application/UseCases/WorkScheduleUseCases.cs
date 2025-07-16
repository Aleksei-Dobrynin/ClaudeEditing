using Application.Exceptions;
using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class WorkScheduleUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public WorkScheduleUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<WorkSchedule>> GetAll()
        {
            return unitOfWork.WorkScheduleRepository.GetAll();
        }
        public Task<WorkSchedule> GetOne(int id)
        {
            return unitOfWork.WorkScheduleRepository.GetOne(id);
        }
        public async Task<Result<WorkSchedule>> Create(WorkSchedule domain)
        {
            var allSchedules = await unitOfWork.WorkScheduleRepository.GetAll();
            var hasYear = allSchedules.Where(x => x.year == domain.year).ToList();

            if (domain.is_active == true && hasYear.Any(x => x.is_active == true))
            {
                return Result.Fail(new LogicError("Такой год уже существует!"));

            }

            var result = await unitOfWork.WorkScheduleRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Result<WorkSchedule>> Update(WorkSchedule domain)
        {
            var allSchedules = await unitOfWork.WorkScheduleRepository.GetAll();
            var hasYear = allSchedules.Where(x => x.year == domain.year).ToList();
             
            if (domain.is_active == true && hasYear.Any(x => x.is_active == true))
            {
                return Result.Fail(new LogicError("Такой год уже существует или вы не можете активировать этот год!"));

            } 
            await unitOfWork.WorkScheduleRepository.Update(domain);
            unitOfWork.Commit();

            return domain;
        }


        public Task<PaginatedList<WorkSchedule>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.WorkScheduleRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.WorkScheduleRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}
