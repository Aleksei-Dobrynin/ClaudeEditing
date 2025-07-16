using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;
using Newtonsoft.Json;

namespace Application.UseCases
{
    public class architecture_processUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public architecture_processUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<architecture_process>> GetAll()
        {
            return unitOfWork.architecture_processRepository.GetAll();
        }
        public Task<List<architecture_process>> GetAllToArchive()
        {
            return unitOfWork.architecture_processRepository.GetAllToArchive();
        }
        public Task<architecture_process> GetOne(int id)
        {
            return unitOfWork.architecture_processRepository.GetOne(id);
        }
        public async Task<architecture_process> Create(architecture_process domain)
        {
            var result = await unitOfWork.architecture_processRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<architecture_process> SendToDutyPlan(int app_id, string? dp_outgoing_number, List<int> workDocs, List<int> uplDocs)
        {
            var res = await unitOfWork.architecture_processRepository.GetOne(app_id);
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var proc_st = await unitOfWork.architecture_statusRepository.GetAll();
            var duty_statuses = await unitOfWork.status_dutyplan_objectRepository.GetAll();

            if (res == null)
            {
                var begin_statatus = proc_st.FirstOrDefault(x => x.code == "to_dutyplan");
                var app_duty_status = duty_statuses.FirstOrDefault(x => x.code == "application");
                var app = await unitOfWork.ApplicationRepository.GetOneByID(app_id);
                var employee = await unitOfWork.EmployeeRepository.GetByUserId(user_id); 
                var cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(app.cashed_info);
                cash.dp_registrator_id = user_id;
                cash.dp_registrator_name = employee.first_name + " " + employee.last_name + " " + employee.second_name;
                cash.dp_created_at =  DateTime.Now;

                app.cashed_info = JsonConvert.SerializeObject(cash);
                await unitOfWork.ApplicationRepository.Update(app);

                await unitOfWork.architecture_processRepository.Add(new architecture_process
                {
                    id = app_id,
                    status_id = begin_statatus?.id ?? null,
                    created_by = cash.registrator_id != null ? cash.registrator_id : user_id,
                    created_at = DateTime.Now,
                });

                var arch_object = await unitOfWork.ArchObjectRepository.GetOneByID(app.arch_object_id ?? 0);
                var id_duty = await unitOfWork.ArchiveObjectRepository.Add(new ArchiveObject
                {
                    created_by = user_id,
                    created_at = DateTime.Now,
                    address = arch_object?.address,
                    //latitude = arch_object?.xcoordinate,
                    //longitude = arch_object?.ycoordinate,
                    status_dutyplan_object_id = app_duty_status?.id,
                });

                unitOfWork.Commit();

                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var dutyLog = await unitOfWork.DutyPlanLogRepository.Add(new DutyPlanLog
                {
                    application_id = app_id, 
                    doc_number = dp_outgoing_number, 
                    date = DateTime.UtcNow,
                    from_employee_id = emp.id,
                    archive_object_id = id_duty,
                }); 
                
                await unitOfWork.application_duty_objectRepository.Add(new application_duty_object
                {
                    dutyplan_object_id = id_duty,
                    application_id = app_id,
                    created_by = user_id,
                    created_at = DateTime.Now,
                });

                foreach (var workDocId in workDocs)
                {
                    var doc = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByID(workDocId);
                    await unitOfWork.ArchiveObjectFileRepository.Add(new ArchiveObjectFile
                    {
                        archive_object_id = id_duty,
                        file_id = doc.file_id ?? 0,
                        name = doc.id_type_name,
                    });
                }

                foreach (var uplDocId in uplDocs)
                {
                    var doc = await unitOfWork.uploaded_application_documentRepository.GetOne(uplDocId);
                    await unitOfWork.ArchiveObjectFileRepository.Add(new ArchiveObjectFile
                    {
                        archive_object_id = id_duty,
                        file_id = doc.file_id ?? 0,
                        name = (doc.name != null && doc.name != "") ? doc.name : doc.app_doc_name,
                    });
                }


                res = await unitOfWork.architecture_processRepository.GetOne(app_id);


                unitOfWork.Commit();


            }
            else
            {
                var dutyes = await unitOfWork.status_dutyplan_objectRepository.GetByIdApplicaiton(app_id);

            }
            return res;
        }


        public async Task<Result<int>> ChangeStatus(int application_id, int status_id)
        {
            var res = await unitOfWork.architecture_processRepository.GetOne(application_id);
            if(res == null)
            {
                return Result.Fail(new LogicError("Заявка не найдена!"));
            }

            res.status_id = status_id;
            var user_id = await unitOfWork.UserRepository.GetUserID();
            res.updated_by = user_id;
            res.updated_at = DateTime.Now;

            await unitOfWork.architecture_processRepository.Update(res);

            unitOfWork.Commit();

            return Result.Ok(res.id);
        }


        public async Task<architecture_process> Update(architecture_process domain)
        {
            await unitOfWork.architecture_processRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<architecture_process>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.architecture_processRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.architecture_processRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<architecture_process>>  GetBystatus_id(int status_id)
        {
            return unitOfWork.architecture_processRepository.GetBystatus_id(status_id);
        }
        
    }
}
