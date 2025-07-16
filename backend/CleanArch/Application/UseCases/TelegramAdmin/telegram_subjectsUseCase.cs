using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class telegram_subjectsUseCase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly Itelegram_subjectsRepository _telegram_subjectsRepository;

        public telegram_subjectsUseCase(IUnitOfWork unitOfWork, Itelegram_subjectsRepository telegram_subjectsRepository)
        {
            this.unitOfWork = unitOfWork;
            _telegram_subjectsRepository = telegram_subjectsRepository;
        }

        public Task<List<telegram_subjects>> GetAll()
        {
            var data = unitOfWork.telegram_subjectsRepository.GetAll();
            return data;
        }

        public Task<telegram_subjects> GetById(int id)
        {
            return unitOfWork.telegram_subjectsRepository.GetById(id);
        }
        public async Task<telegram_subjects> Create(telegram_subjects domain)
        {
            var result = await unitOfWork.telegram_subjectsRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<telegram_subjects> Update(telegram_subjects domain)
        {
            await unitOfWork.telegram_subjectsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }


        public async Task<int> Delete(int id)
        {
            await unitOfWork.telegram_subjectsRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}
