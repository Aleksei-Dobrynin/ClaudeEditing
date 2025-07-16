using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class telegram_questionsUseCase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly Itelegram_questionsRepository _telegram_questionsRepository;

        public telegram_questionsUseCase(IUnitOfWork unitOfWork, Itelegram_questionsRepository telegram_questionsRepository)
        {
            this.unitOfWork = unitOfWork;
            _telegram_questionsRepository = telegram_questionsRepository;
        }
        public Task<List<telegram_questions>> GetAll()
        {
            var data = unitOfWork.telegram_questionsRepository.GetAll();
            return data;
        }

        public Task<telegram_questions> GetById(int id)
        {
            return unitOfWork.telegram_questionsRepository.GetById(id);
        }
        public async Task<Result<telegram_questions>> Create(telegram_questions domain)
        {
            var result = await unitOfWork.telegram_questionsRepository.Add(domain);
            if (domain.document != null)
            {
                foreach( var item in domain.document)
                {
                    var document = unitOfWork.FileRepository.AddDocument(item);
                    var id_file = await unitOfWork.FileRepository.Add(document);
                    var questionFile = new Domain.Entities.telegram_questions_file
                    {
                        idQuestion = result, 
                        idFile = id_file    
                    };
                    await unitOfWork.telegram_questionsRepository.CreateQuestionFiles(questionFile);
                }

            } 
            else
            {
                return Result.Fail(new LogicError("Документ не может быть пустым!"));
            }
            
            domain.id = result;
            unitOfWork.Commit();
            return domain;

        }

        public async Task<telegram_questions> Update(telegram_questions domain, List<int> ids)
        {
            await unitOfWork.telegram_questionsRepository.Update(domain);

            if (ids.Count > 0)
            {
                var questionFIles = await unitOfWork.telegram_questionsRepository.FindQuestionFiles(domain.id);

                foreach (var file in questionFIles)
                {
                    if (!ids.Contains(file.idFile))
                    {
                        await unitOfWork.telegram_questionsRepository.DeleteQuestionFile(file.idFile);
                    }

                }
            }

            if (domain.document.Count > 0)
            {

                foreach (var item in domain.document)
                {
                    var document = unitOfWork.FileRepository.AddDocument(item);
                    var id_file = await unitOfWork.FileRepository.Add(document);
                    var questionFile = new Domain.Entities.telegram_questions_file
                    {
                        idQuestion = domain.id,
                        idFile = id_file
                    };
                    await unitOfWork.telegram_questionsRepository.CreateQuestionFiles(questionFile);
                }
            }
            else if (domain.document.Count == 0 && ids.Count == 0)
            {
                await unitOfWork.telegram_questions_fileRepository.DeleteByIdQuestion(domain.id);
            }



            unitOfWork.Commit();
            return domain;
        }


        public async Task<int> Delete(int id)
        {
            await unitOfWork.telegram_questionsRepository.Delete(id);
            var questionFIles = await unitOfWork.telegram_questionsRepository.FindQuestionFiles(id);
            foreach(var item in questionFIles)
            {
                await unitOfWork.telegram_questions_fileRepository.Delete(item.id);
            }
            unitOfWork.Commit();
            return id;
        }

        public Task<List<telegram_questions>> GetByIdSubject(int id)
        {
            return unitOfWork.telegram_questionsRepository.GetByIdSubject(id);
        }
    }
}
