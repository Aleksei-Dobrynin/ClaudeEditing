using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class telegram_questions_chatsUseCase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly Itelegram_questions_chatsRepository _telegram_questions_chatsRepository;

        public telegram_questions_chatsUseCase(IUnitOfWork unitOfWork, Itelegram_questions_chatsRepository telegram_questions_chatsRepository)
        {
            this.unitOfWork = unitOfWork;
            _telegram_questions_chatsRepository = telegram_questions_chatsRepository;
        }

        public Task<List<telegram_questions_chats>> GetAll()
        {
            var data = unitOfWork.telegram_questions_chatsRepository.GetAll();
            return data;
        }

        public Task<telegram_questions_chats> GetById(int id)
        {
            return unitOfWork.telegram_questions_chatsRepository.GetById(id);
        }

        public async Task<telegram_questions_chats> Create(telegram_questions_chats domain)
        {
            var result = await unitOfWork.telegram_questions_chatsRepository.Create(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<telegram_questions_chats> Update(telegram_questions_chats domain)
        {
            await unitOfWork.telegram_questions_chatsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }


        public async Task<int> Delete(int id)
        {
            await unitOfWork.telegram_questions_chatsRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
        public Task<telegram_questions_chats> GetByChatId(string chatId)
        {
            return unitOfWork.telegram_questions_chatsRepository.GetByChatId(chatId);
        }

        public async Task<List<ServiceCountTelegram>> GetNumberOfChats()
        {
            return await unitOfWork.telegram_questions_chatsRepository.GetNumberOfChats();
        }

        public async Task<List<ServiceCountTelegram>> GetNumberOfChatsByDate(DateTime startDate, DateTime? endDate)
        {
            return await unitOfWork.telegram_questions_chatsRepository.GetNumberOfChatsByDate(startDate, endDate);
        }


    }
}
