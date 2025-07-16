using Application.Models;
using Application.Repositories;
using Domain.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class application_commentUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly Iapplication_commentRepository _application_commentRepository;

        public application_commentUseCases(IUnitOfWork unitOfWork, Iapplication_commentRepository application_commentRepository)
        {
            this.unitOfWork = unitOfWork;
            _application_commentRepository = application_commentRepository;
        }

        public Task<List<application_comment>> GetAll()
        {
            var data = unitOfWork.application_commentRepository.GetAll();
            return data;
        }

        public Task<application_comment> GetOne(int id)
        {
            return unitOfWork.application_commentRepository.GetOne(id);
        }
        public async Task<application_comment> Create(application_comment domain)
        {
            domain.created_at = DateTime.Now;
            var result = await unitOfWork.application_commentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();

            if(domain.application_id != null)
            {
                var all_comment = await unitOfWork.application_commentRepository.GetByapplication_id(domain.application_id.Value);
                var appliction = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id.Value);
                var cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(appliction.cashed_info);
                cash.comments = string.Join(", ", (all_comment.Select(x => x.comment).ToList()));
                appliction.cashed_info = JsonConvert.SerializeObject(cash);
                await unitOfWork.ApplicationRepository.Update(appliction);
                unitOfWork.Commit();
            }



            return domain;
        }

        public async Task<application_comment> Update(application_comment domain)
        {
            await unitOfWork.application_commentRepository.Update(domain);
            unitOfWork.Commit();

            if (domain.application_id != null)
            {
                var all_comment = await unitOfWork.application_commentRepository.GetByapplication_id(domain.application_id.Value);
                var appliction = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id.Value);
                var cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(appliction.cashed_info);
                cash.comments = string.Join(", ", (all_comment.Select(x => x.comment).ToList()));
                appliction.cashed_info = JsonConvert.SerializeObject(cash);
                await unitOfWork.ApplicationRepository.Update(appliction);
                unitOfWork.Commit();
            }

            return domain;
        }

        //public Task<PaginatedList<application_comment>> GetPagniated(int pageSize, int pageNumber)
        //{
        //    if (pageSize < 1) pageSize = 1;
        //    if (pageNumber < 1) pageNumber = 1;
        //    return unitOfWork.application_commentRepository.GetPaginated(pageSize, pageNumber);
        //}

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_commentRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<application_comment>> GetByapplication_id(int application_id)
        {
            return unitOfWork.application_commentRepository.GetByapplication_id(application_id);
        }

    }
}
