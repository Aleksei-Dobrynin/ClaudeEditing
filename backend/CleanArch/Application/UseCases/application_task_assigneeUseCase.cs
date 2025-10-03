using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Newtonsoft.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Application.UseCases
{
    public class application_task_assigneeUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ISendNotification sendNotification;
        private readonly ApplicationUseCases _applicationUseCases;

        public application_task_assigneeUseCases(IUnitOfWork unitOfWork, ISendNotification SendNotification, ApplicationUseCases applicationUseCases)
        {
            this.unitOfWork = unitOfWork;
            this.sendNotification = SendNotification;
            _applicationUseCases = applicationUseCases;
        }

        public Task<List<application_task_assignee>> GetAll()
        {
            return unitOfWork.application_task_assigneeRepository.GetAll();
        }
        public Task<application_task_assignee> GetOne(int id)
        {
            return unitOfWork.application_task_assigneeRepository.GetOne(id);
        }
        public async Task<application_task_assignee> Create(application_task_assignee domain)
        {
            domain.updated_at = DateTime.Now;
            domain.created_at = DateTime.Now;
            var result = await unitOfWork.application_task_assigneeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();

            var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(domain.structure_employee_id);


            var task = await unitOfWork.application_taskRepository.GetOne(domain.application_task_id);
            var application = await unitOfWork.ApplicationRepository.GetOneByID(task.application_id);
            var customer = await unitOfWork.CustomerRepository.GetOneByID(application.customer_id);
            var archObjects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(application.id);
            var arch_adress = string.Join(", ", archObjects.Select(x => x.address));
            var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);
            
            var statuses = await unitOfWork.ApplicationStatusRepository.GetAll();
            var reviewStatus = statuses.FirstOrDefault(x => x.code == "review");
            var preparationStatus = statuses.FirstOrDefault(x => x.code == "preparation");
            var road = await unitOfWork.ApplicationRoadRepository.GetByStatuses(application.status_id, preparationStatus.id);
            if (application.status_id == reviewStatus?.id && road != null)
            {
                var res = await _applicationUseCases.ChangeStatus(application.id, preparationStatus.id);
                application.status_id = preparationStatus.id;
            }

            try
            {
                var emplyoee = await unitOfWork.EmployeeRepository.GetOneByID(empInStr.employee_id);
                var maria_users = await unitOfWork.MariaDbRepository.GetEmployeesByEmail(emplyoee.email ?? "");
                var maria_user_id = maria_users.FirstOrDefault()?.id;
                var workers = maria_user_id?.ToString();

                if (application.maria_db_statement_id != null)
                {
                    var statement = await unitOfWork.MariaDbRepository.GetStatementById(application.maria_db_statement_id.Value);
                    if (statement != null)
                    {
                        if (!statement.workers?.Contains(workers) ?? false)
                        {
                            if (task != null)
                            {
                                statement.workers += "," + workers;
                                await unitOfWork.MariaDbRepository.UpdateWorkers(statement);
                                unitOfWork.Commit();
                            }
                        }
                    }
                }
            }
            catch
            {

            }

            var all_assignees = await unitOfWork.application_task_assigneeRepository.GetByapplication_id(task.application_id);


            var cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(application.cashed_info);
            cash.assignees = string.Join(", ", all_assignees.Select(x => x.employee_name));

            application.cashed_info = JsonConvert.SerializeObject(cash);
            await unitOfWork.ApplicationRepository.Update(application);

            var param = new Dictionary<string, string>();
            param.Add("application_number", application.number);
            param.Add("service_name", service.name);
            param.Add("customer_name", customer.full_name);
            param.Add("arch_adress", arch_adress);
            param.Add("task_id", domain.application_task_id.ToString());
            await sendNotification.SendNotification("new_task", empInStr.employee_id, param);
            await _applicationUseCases.InvalidatePaginationCache();
            return domain;
        }

        public async Task<application_task_assignee> Update(application_task_assignee domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.application_task_assigneeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_task_assignee>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_task_assigneeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            var assigne = await unitOfWork.application_task_assigneeRepository.GetOne(id);
            var task = await unitOfWork.application_taskRepository.GetOne(assigne.application_task_id);
            var application = await unitOfWork.ApplicationRepository.GetOneByID(task.application_id);

            await unitOfWork.application_task_assigneeRepository.Delete(id);
            unitOfWork.Commit();

            var all_assignees = await unitOfWork.application_task_assigneeRepository.GetByapplication_id(task.application_id);
            var cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(application.cashed_info);
            cash.assignees = string.Join(", ", all_assignees.Select(x => x.employee_name));

            application.cashed_info = JsonConvert.SerializeObject(cash);
            await unitOfWork.ApplicationRepository.Update(application);

            unitOfWork.Commit();

            await _applicationUseCases.InvalidatePaginationCache();
            return id;
        }



        public Task<List<application_task_assignee>> GetByapplication_task_id(int application_task_id)
        {
            return unitOfWork.application_task_assigneeRepository.GetByapplication_task_id(application_task_id);
        }

    }
}
