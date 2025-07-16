using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class user_selectable_questions_telegramUseCase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly Iuser_selectable_questions_telegramRepository _user_selectable_questions_telegramRepository;

        public user_selectable_questions_telegramUseCase(IUnitOfWork unitOfWork, Iuser_selectable_questions_telegramRepository user_selectable_questions_telegramRepository)
        {
            this.unitOfWork = unitOfWork;
            _user_selectable_questions_telegramRepository = user_selectable_questions_telegramRepository;
        }

        public Task<List<user_selectable_questions_telegram>> GetAll()
        {
            var data = unitOfWork.user_selectable_questions_telegramRepository.GetAll();
            return data;
        }

        public Task<user_selectable_questions_telegram> GetById(int id)
        {
            return unitOfWork.user_selectable_questions_telegramRepository.GetById(id);
        }

        public async Task<user_selectable_questions_telegram> Create(user_selectable_questions_telegram domain)
        {
            var result = await unitOfWork.user_selectable_questions_telegramRepository.Create(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<user_selectable_questions_telegram> Update(user_selectable_questions_telegram domain)
        {
            await unitOfWork.user_selectable_questions_telegramRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }


        public async Task<int> Delete(int id)
        {
            await unitOfWork.user_selectable_questions_telegramRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
        public Task<user_selectable_questions_telegram> GetByChatId(string chatId)
        {
            return unitOfWork.user_selectable_questions_telegramRepository.GetByChatId(chatId);
        }

        public async Task<List<ServiceCountTelegramByQuestions>> GetClicked(DateTime startDate, DateTime? endDate)
        {
            return await unitOfWork.user_selectable_questions_telegramRepository.GetClicked(startDate, endDate);
        }
    }
}
