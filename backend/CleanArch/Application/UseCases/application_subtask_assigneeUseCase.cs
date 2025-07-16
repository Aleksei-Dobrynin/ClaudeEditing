using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using static System.Net.Mime.MediaTypeNames;

namespace Application.UseCases
{
    public class application_subtask_assigneeUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ISendNotification sendNotification;

        public application_subtask_assigneeUseCases(IUnitOfWork unitOfWork, ISendNotification SendNotification)
        {
            this.unitOfWork = unitOfWork;
            this.sendNotification = SendNotification;
        }

        public Task<List<application_subtask_assignee>> GetAll()
        {
            return unitOfWork.application_subtask_assigneeRepository.GetAll();
        }
        public Task<application_subtask_assignee> GetOne(int id)
        {
            return unitOfWork.application_subtask_assigneeRepository.GetOne(id);
        }
        public async Task<application_subtask_assignee> Create(application_subtask_assignee domain)
        {
            domain.updated_at = DateTime.Now;
            domain.created_at = DateTime.Now;
            var result = await unitOfWork.application_subtask_assigneeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();

            var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(domain.structure_employee_id);
            var subtask = await unitOfWork.application_subtaskRepository.GetOne(domain.application_subtask_id);
            var task = await unitOfWork.application_taskRepository.GetOne(subtask.application_task_id);
            var application = await unitOfWork.ApplicationRepository.GetOneByID(task.application_id);
            var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);

            var param = new Dictionary<string, string>();
            param.Add("application_number", application.number);
            param.Add("service_name", service.name);
            param.Add("subtask_id", domain.application_subtask_id.ToString());
            await sendNotification.SendNotification("new_subtask", empInStr.employee_id, param);

            return domain;
        }

        public async Task<application_subtask_assignee> Update(application_subtask_assignee domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.application_subtask_assigneeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_subtask_assignee>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_subtask_assigneeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_subtask_assigneeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<application_subtask_assignee>>  GetBystructure_employee_id(int structure_employee_id)
        {
            return unitOfWork.application_subtask_assigneeRepository.GetBystructure_employee_id(structure_employee_id);
        }
        
        public Task<List<application_subtask_assignee>>  GetByapplication_subtask_id(int application_subtask_id)
        {
            return unitOfWork.application_subtask_assigneeRepository.GetByapplication_subtask_id(application_subtask_id);
        }
        
    }
}
