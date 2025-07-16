using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain;
using Domain.Entities;
using System.Reflection;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;
using FluentResults;
using Error = FluentResults.Error;

namespace Application.UseCases
{
    public class application_taskUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ISendNotification sendNotification;

        public application_taskUseCases(IUnitOfWork unitOfWork, ISendNotification sendNotification)
        {
            this.unitOfWork = unitOfWork;
            this.sendNotification = sendNotification;
        }

        public string? ChechApplicationStatusColor(application_task item)
        {
            //TODO add colors to different checks in the future

            var status = item.application_status_color;


            if (item.application_status_code != null && check.Any(x => x != item.application_status_code))
            {
                status = "#000000";
            }

            return status;

        }

        public List<string> check = new List<string>
        {
            //Application status codes
            "review","executor_assignment","preparation","return_to_eo","ready_for_eo"
        };

        public Task<List<application_task>> GetAll()
        {
            return unitOfWork.application_taskRepository.GetAll();
        }
        public async Task<application_task> GetOne(int id)
        {
            var res = await unitOfWork.application_taskRepository.GetOne(id);

            var squares = await unitOfWork.application_squareRepository.GetByapplication_id(res.application_id);
            var square = squares?.FirstOrDefault(x => x.structure_id == res.structure_id);
            res.application_square_id = square?.id;
            res.application_square_unit_type_id = square?.unit_type_id;
            res.application_square_value = square?.value;

            return res;
        }
        public async Task<Result<application_task>> Create(application_task domain)
        {
            var validResult = domain.Validate();
            if (!validResult.IsValid)
            {
                return Result.Fail(new ValidationError());
            }

            var status = await unitOfWork.task_statusRepository.GetOneByCode("assigned");
            domain.status_id = status.id;

            var result = await unitOfWork.application_taskRepository.Add(domain);
            domain.id = result;

            var applicaiton_logs = await unitOfWork.structure_application_logRepository.GetByOrgAndApp(domain.structure_id ?? 0, domain.application_id);
            if(applicaiton_logs.Count == 0)
            {
                await unitOfWork.structure_application_logRepository.Add(new structure_application_log
                {
                    application_id = domain.application_id,
                    structure_id = domain.structure_id,
                    updated_at = DateTime.Now,
                    created_at = DateTime.Now,
                    status_code = "pending",
                    status = "В ожидании",
                });
            }

            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                //domain.file_id = id_file;
                unitOfWork.Commit();
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var eisId = unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id).Result.FirstOrDefault();
                var paymentType = await unitOfWork.WorkDocumentTypeRepository.GetOneByCode("work");
                await unitOfWork.ApplicationWorkDocumentRepository.Add(new ApplicationWorkDocument
                {
                    created_at = DateTime.Now,
                    structure_employee_id = eisId != null ? eisId.id : null,
                    structure_id = domain.structure_id,
                    task_id = result,
                    id_type = paymentType.id,
                    file_id = id_file,
                });
            }


            unitOfWork.Commit();
            //var headStructures = await unitOfWork.EmployeeInStructureRepository.GetByStructureAndPost(domain.structure_id, "head_structure");
            //foreach (var headStructure in headStructures)
            //{
            //    await unitOfWork.application_task_assigneeRepository.Add(new application_task_assignee
            //    {
            //        application_task_id = result,
            //        structure_employee_id = headStructure.id,
            //        created_at = DateTime.Now,
            //        updated_at = DateTime.Now
            //    });

            //    var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(headStructure.id);
            //    var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
            //    var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);

            //    var param = new Dictionary<string, string>();
            //    param.Add("application_number", application.number);
            //    param.Add("service_name", service.name);
            //    param.Add("task_id", result.ToString());
            //    await sendNotification.SendNotification("new_task", empInStr.employee_id, param);

            //}
            List<int> employee_in_structure_ids = domain.employee_in_structure_ids?
            .Split(',')               
            .Select(int.Parse)        
            .ToList();

            if(employee_in_structure_ids != null)
            {
                foreach (var eis_id in employee_in_structure_ids)
                {
                    await unitOfWork.application_task_assigneeRepository.Add(new application_task_assignee
                    {
                        application_task_id = result,
                        structure_employee_id = eis_id,
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now
                    });

                    var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(eis_id);
                    var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
                    var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);

                    var param = new Dictionary<string, string>();
                    param.Add("application_number", application.number);
                    param.Add("service_name", service.name);
                    param.Add("task_id", result.ToString());
                    await sendNotification.SendNotification("new_task", empInStr.employee_id, param);
                }
            }

            return Result.Ok(domain);
        }

        public async Task<Result<application_task>> Update(application_task domain)
        {
            var entity = await unitOfWork.application_taskRepository.GetOne(domain.id);
            if (entity.updated_at != domain.updated_at)
            {
                return Result.Fail(new AlreadyUpdatedError("Эта задаче уже обновлена кем-то, обновите страницу и попробуйте еще раз!"));
            }
            await unitOfWork.application_taskRepository.Update(domain);

            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                //domain.file_id = id_file;
                unitOfWork.Commit();
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var eisId = unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id).Result.FirstOrDefault();
                var paymentType = await unitOfWork.WorkDocumentTypeRepository.GetOneByCode("work");
                await unitOfWork.ApplicationWorkDocumentRepository.Add(new ApplicationWorkDocument
                {
                    created_at = DateTime.Now,
                    structure_employee_id = eisId != null ? eisId.id : null,
                    structure_id = domain.structure_id,
                    task_id = domain.id,
                    id_type = paymentType.id,
                    file_id = id_file,
                });
            }

            unitOfWork.Commit();

            return Result.Ok(domain);
        }


        public Task<PaginatedList<application_task>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_taskRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_taskRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public async Task<List<application_task>> GetByapplication_id(int application_id)
        {
            var assignees = await unitOfWork.application_task_assigneeRepository.GetByapplication_id(application_id);

            var res = await unitOfWork.application_taskRepository.GetByapplication_id(application_id);
            foreach (var item in res)
            {
                item.employees = assignees.Where(x => x.application_task_id == item.id).ToList();
            }
            return res;
        }
        public Task<List<application_task>> GetOtherTaskByTaskId(int task_id)
        {
            return unitOfWork.application_taskRepository.GetOtherTaskByTaskId(task_id);
        }

        public Task<List<application_task>> GetBytask_template_id(int task_template_id)
        {
            return unitOfWork.application_taskRepository.GetBytask_template_id(task_template_id);
        }

        public Task<List<ApplicationTaskPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            return unitOfWork.application_taskRepository.GetForPivotDashboard(date_start, date_end, out_of_date);
        }
        public async Task<List<ApplicationTaskPivot>> GetForPivotDashboardMyStructure(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var result = await unitOfWork.application_taskRepository.GetForPivotDashboard(date_start, date_end, out_of_date, user_id);
            return result;
        }

        public async Task<List<ApplicationTaskPivot>> GetForPivotHeadDashboard(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var emp = await unitOfWork.EmployeeRepository.GetByUserId(userId);
            var works = await unitOfWork.EmployeeInStructureRepository.GetEmployeesHeadStructures(emp.id);

            return await unitOfWork.application_taskRepository.GetForPivotHeadDashboard(date_start, date_end, out_of_date, works.Select(x=>x.structure_id).ToArray());
        }

        public Task<List<application_task>> GetBystatus_id(int status_id)
        {
            return unitOfWork.application_taskRepository.GetBystatus_id(status_id);
        }
        public async Task<int> ChangeStatus(int task_id, int status_id )
        {
            var applicationStatus = await unitOfWork.ApplicationRepository.GetStatusByIdTask(task_id);
            var taskStatus = await unitOfWork.task_statusRepository.GetOne(status_id);
            if (applicationStatus.code == "review" && taskStatus.code == "at_work")
            {
                var task = await unitOfWork.application_taskRepository.GetOne(task_id);
                var preparationStatus = await unitOfWork.ApplicationStatusRepository.GetByCode("preparation");
                await unitOfWork.ApplicationRepository.ChangeStatus(task.application_id, preparationStatus.id);
            }
            var res = await unitOfWork.application_taskRepository.ChangeStatus(task_id, status_id);
            unitOfWork.Commit();
            return res;
        }
        public async Task<List<datanested>> GetMyTasks(string search, DateTime? date_start, DateTime? date_end, bool? isExpiredTasks,bool? showResolwed)
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var result = await unitOfWork.application_taskRepository.GetTasksByUserId(userId, search, date_start, date_end, isExpiredTasks);
            var subs = await unitOfWork.application_subtaskRepository.GetSubtasksByUserId(userId);
            var ress = new List<datanested>();
            List<application_task> res = new List<application_task>();
            foreach (var item in result)
            {
                if (showResolwed == true)
                {
                    item.application_status_color = ChechApplicationStatusColor(item);
                    res.Add(item);
                }
                else
                {
                    if (item.application_status_code != null && check.Any(x => x == item.application_status_code))
                    {
                        item.application_status_color = ChechApplicationStatusColor(item);
                        res.Add(item);
                    }
                }

            }
            res.ForEach(x =>
            {
                var nest = new mytasknested
                {
                    id = x.id,
                    name = x.name,
                    comment = x.comment,
                    type_name = x.type_name,
                    status_idNavName = x.status_idNavName,
                    done_subtasks = x.done_subtasks,
                    subtasks = x.subtasks,
                    application_number = x.application_number,
                    application_id = x.application_id,
                    assignees = x.assignees,
                    structure_idNavName = x.structure_idNavName,
                    status_textcolor = x.status_text_color,
                    status_backcolor = x.status_back_color,
                    full_name = x.full_name,
                    pin = x.pin,
                    contact = x.contact,
                    address = x.address,
                    service_name = x.service_name,
                    is_task = true,
                    deadline = x.task_deadline,
                    app_deadline = x.app_deadline
                };
                var children = new List<datanested>();
                subs.Where(y => y.application_task_id == x.id).ToList().ForEach(sub =>
                {
                    children.Add(new datanested
                    {
                        data = new mytasknested
                        {
                            id = sub.id,
                            name = sub.name,
                            comment = "",
                            application_id = x.application_id,
                            application_number = x.application_number,
                            status_idNavName = sub.status_name,
                            status_code = sub.status_code,
                            type_name = sub.type_name,
                            status_textcolor = sub.status_text_color,
                            status_backcolor = sub.status_back_color,
                            is_task = false,
                            deadline = sub.subtask_deadline
                        },
                    });
                });
                nest.subtasks = children.Count();
                nest.done_subtasks = children.Where(x => x.data.status_code == "done").Count();

                var datane = new datanested
                {
                    data = nest,
                    children = children,
                    id = x.id,
                    key = x.id,
                };
                ress.Add(datane);
            });

            var task_ids = res.Select(x => x.id).ToList();
            var not_in_tasks = subs.Where(x => !task_ids.Contains(x.application_task_id)).ToList().Select(x => x.application_task_id).Distinct();
            foreach (var task_id in not_in_tasks.Take(100 - res.Count))
            {
                var task = await unitOfWork.application_taskRepository.GetOneWithAppInfo(task_id);

                var nest = new mytasknested
                {
                    id = task.id,
                    name = task.name,
                    comment = task.comment,
                    type_name = task.type_name,
                    status_idNavName = task.status_idNavName,
                    done_subtasks = task.done_subtasks,
                    subtasks = task.subtasks,
                    application_number = task.application_number,
                    application_id = task.application_id,
                    structure_idNavName = task.structure_idNavName,
                    status_textcolor = task.status_text_color,
                    status_backcolor = task.status_back_color,
                    full_name = task.full_name,
                    pin = task.pin,
                    contact = task.contact,
                    assignees = task.assignees,
                    address = task.address,
                    service_name = task.service_name,
                    is_task = true,
                    deadline = task.task_deadline,
                    app_deadline = task.app_deadline,
                };
                var datane = new datanested
                {
                    data = nest,
                    children = null,
                    id = task.id,
                    key = task.id,
                };
                ress.Add(datane);
            }

            return ress;
        }

        public async Task<List<datanested>> GetStructureTasks(string search, DateTime? date_start, DateTime? date_end, bool? isExpiredTasks, bool? showResolwed)
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var result = await unitOfWork.application_taskRepository.GetMyStructuresTasks(userId, search, date_start, date_end, isExpiredTasks);
            //var subs = await unitOfWork.application_subtaskRepository.GetMyStructureSubtasks(userId);
            List<application_task> res = new List<application_task>();
            foreach (var item in result)
            {
                if (showResolwed == true)
                {
                    item.application_status_color = ChechApplicationStatusColor(item);
                    res.Add(item);
                }
                else
                {
                    if (item.application_status_code != null && check.Any(x => x == item.application_status_code))
                    {
                        item.application_status_color = ChechApplicationStatusColor(item);
                        res.Add(item);
                    }
                }

            }

            var ress = new List<datanested>();
            res.ForEach(x =>
            {
                var nest = new mytasknested
                {
                    id = x.id,
                    name = x.name,
                    comment = x.comment,
                    type_name = x.type_name,
                    status_idNavName = x.status_idNavName,
                    done_subtasks = x.done_subtasks,
                    assignees = x.assignees,
                    subtasks = x.subtasks,
                    application_number = x.application_number,
                    application_id = x.application_id,
                    work_description = x.work_description,
                    pin = x.pin,
                    structure_idNavName = x.structure_idNavName,
                    status_textcolor = x.status_text_color,
                    full_name = x.full_name,
                    address = x.address,
                    contact = x.contact,
                    service_name = x.service_name,
                    status_backcolor = x.status_back_color,
                    is_task = true,
                    deadline = x.task_deadline,
                    app_deadline = x.app_deadline,
                };
                var children = new List<datanested>();
                //subs.Where(y => y.application_task_id == x.id).ToList().ForEach(sub =>
                //{
                //    children.Add(new datanested
                //    {
                //        data = new mytasknested
                //        {
                //            id = sub.id,
                //            name = sub.name,
                //            comment = "",
                //            application_id = x.application_id,
                //            application_number = x.application_number,
                //            status_idNavName = sub.status_name,
                //            status_code = sub.status_code,
                //            type_name = sub.type_name,
                //            status_textcolor = sub.status_text_color,
                //            status_backcolor = sub.status_back_color,
                //            deadline = sub.subtask_deadline,
                //            is_task = false
                //        },
                //    });
                //});
                //nest.subtasks = children.Count();
                //nest.done_subtasks = children.Where(x => x.data.status_code == "done").Count();

                var datane = new datanested
                {
                    data = nest,
                    children = children,
                    id = x.id,
                    key = x.id,
                };
                ress.Add(datane);
            });

            return ress;
        }
        
        public async Task<PaginatedList<application_task>> GetAllTasks(string search, DateTime? date_start, DateTime? date_end, int page, int pageSize)
        {
            var res = await unitOfWork.application_taskRepository.GetAllTasks(search, date_start, date_end, page, pageSize);
            var ress = new List<datanested>();
            return res;
        }


    }
}
