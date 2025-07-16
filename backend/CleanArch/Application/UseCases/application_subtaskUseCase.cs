using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class application_subtaskUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_subtaskUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_subtask>> GetAll()
        {
            return unitOfWork.application_subtaskRepository.GetAll();
        }
        public async Task<application_subtask> GetOne(int id)
        {
            var res = await unitOfWork.application_subtaskRepository.GetOne(id);
            res.assignees = await unitOfWork.application_subtask_assigneeRepository.GetByapplication_subtask_id(id);
            return res;
        }
        public async Task<application_subtask> Create(application_subtask domain)
        {
            var status_assign = await unitOfWork.task_statusRepository.GetOneByCode("assigned");
            domain.status_id = status_assign.id;
            var result = await unitOfWork.application_subtaskRepository.Add(domain);
            domain.id = result;

            foreach (var assignee in domain.assignees)
            {
                assignee.created_at = DateTime.Now;
                assignee.id = 0;
                assignee.application_subtask_id = result;
                await unitOfWork.application_subtask_assigneeRepository.Add(assignee);
            }

            unitOfWork.Commit();
            return domain;
        }

        public async Task<Result<application_subtask>> Update(application_subtask domain)
        {
            var entity = await unitOfWork.application_subtaskRepository.GetOne(domain.id);
            if (entity.updated_at != domain.updated_at)
            {
                return Result.Fail<application_subtask>(new LogicError());
            }
            await unitOfWork.application_subtaskRepository.Update(domain);

            var new_ids = domain.assignees.Select(x => x.id);
            var for_delete_ids = (await unitOfWork.application_subtask_assigneeRepository.GetByapplication_subtask_id(domain.id))
                .Where(x => !new_ids.Contains(x.id)).Select(x => x.id);

            foreach (var item in for_delete_ids)
            {
                await unitOfWork.application_subtask_assigneeRepository.Delete(item);
            }

            foreach (var assignee in domain.assignees)
            {
                if(assignee.id < 0)
                {
                    assignee.id = 0;
                    assignee.created_at = DateTime.Now;
                    await unitOfWork.application_subtask_assigneeRepository.Add(assignee);
                }
                else
                {
                    assignee.updated_at = DateTime.Now;
                    await unitOfWork.application_subtask_assigneeRepository.Update(assignee);
                }
            }

            unitOfWork.Commit();

            return Result.Ok(domain);
        }

        public Task<PaginatedList<application_subtask>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_subtaskRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> ChangeStatus(int subtask_id, int status_id)
        {
            var res = await unitOfWork.application_subtaskRepository.ChangeStatus(subtask_id, status_id);
            unitOfWork.Commit();
            return res;
        }
        public async Task<int> Delete(int id)
        {
            var for_delete_assignees = (await unitOfWork.application_subtask_assigneeRepository.GetByapplication_subtask_id(id))
                .Select(x => x.id);
            foreach (var item in for_delete_assignees)
            {
                await unitOfWork.application_subtask_assigneeRepository.Delete(item);
            }
            await unitOfWork.application_subtaskRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<application_subtask>>  GetBysubtask_template_id(int subtask_template_id)
        {
            return unitOfWork.application_subtaskRepository.GetBysubtask_template_id(subtask_template_id);
        }
        
        public Task<List<application_subtask>>  GetBystatus_id(int status_id)
        {
            return unitOfWork.application_subtaskRepository.GetBystatus_id(status_id);
        }
        
        public Task<List<application_subtask>>  GetByapplication_task_id(int application_task_id)
        {
            return unitOfWork.application_subtaskRepository.GetByapplication_task_id(application_task_id);
        }
        
    }
}
