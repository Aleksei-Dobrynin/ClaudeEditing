using Application.Models;
using Application.Repositories;
using Domain.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Services;

namespace Application.UseCases
{
    public class application_commentUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly Iapplication_commentRepository _application_commentRepository;
        private readonly ISendNotification sendNotification;

        public application_commentUseCases(IUnitOfWork unitOfWork, Iapplication_commentRepository application_commentRepository, ISendNotification SendNotification)
        {
            this.unitOfWork = unitOfWork;
            _application_commentRepository = application_commentRepository;
            this.sendNotification = SendNotification;
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

            if (domain.type_id != null && domain.employee_id != null)
            {
                var type = await unitOfWork.CommentTypeRepository.GetOneByID(domain.type_id.Value);
                var app = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id.Value);
                var appTask = await unitOfWork.application_taskRepository.GetByapplication_id(domain.application_id.Value);
                var assignees = await unitOfWork.application_task_assigneeRepository.GetByapplication_id(domain.application_id.Value);
                var param = new Dictionary<string, string>();
                param.Add("application_number", app.number);
                param.Add("comment_text", domain.comment);
                param.Add("task_id", assignees.FirstOrDefault(x => x.employee_id == domain.employee_id)?.id.ToString() ?? appTask.FirstOrDefault().id.ToString());
                if (type.code == "notify")
                {
                    await sendNotification.SendNotification("comment_notify_assignee", domain.employee_id.Value, param);
                }
                if (type.code == "return")
                {
                    await sendNotification.SendNotification("comment_return_assignee", domain.employee_id.Value, param);
                }
                await unitOfWork.ApplicationCommentAssigneeRepository.Add(new ApplicationCommentAssignee
                {
                    application_id = domain.application_id.Value,
                    comment_id = domain.id,
                    employee_id = domain.employee_id.Value,
                    is_completed = false
                });
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
        
        public async Task<List<application_comment>> MyAssigned()
        {
            var userId = await unitOfWork.EmployeeRepository.GetUser();
            return await unitOfWork.application_commentRepository.MyAssigned(userId.id);
        }
        
        public async Task<int> CompleteComment(int id)
        {
            var applicationComment = await unitOfWork.application_commentRepository.GetOne(id);
            var type = await unitOfWork.CommentTypeRepository.GetOneByID(applicationComment.type_id.Value);
            var assignee = await unitOfWork.ApplicationCommentAssigneeRepository.GetOneByCommentID(applicationComment.id);
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(assignee.created_by.Value);
            var app = await unitOfWork.ApplicationRepository.GetOneByID(assignee.application_id.Value);
            var param = new Dictionary<string, string>();
            param.Add("application_number", app.number);
            param.Add("employee_name", $"{employee.last_name} {employee.first_name} {employee.second_name}");
            if (type.code == "notify")
            {
                await sendNotification.SendNotification("comment_notify_completed", employee.id, param);
            }
            if (type.code == "return")
            {
                await sendNotification.SendNotification("comment_return_completed", employee.id, param);
            }
            assignee.is_completed = true;
            assignee.completed_date = DateTime.Now;
            await unitOfWork.ApplicationCommentAssigneeRepository.Update(assignee);
            unitOfWork.Commit();
            return id;
        }
    }
}
