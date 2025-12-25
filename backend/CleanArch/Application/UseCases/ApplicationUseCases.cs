using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using System;
using System.Xml.Linq;
using Newtonsoft.Json;
using Application.Services;
using System.Text.Json;
using System.Reflection;
using System.Text.Encodings.Web;
using System.Diagnostics;
using System.Linq;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using FluentResults;
using static Application.Services.SendNotificationService;
using System.Text.RegularExpressions;
using StackExchange.Redis;
using Messaging.Services;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text;
using System.Net;
using DocumentFormat.OpenXml.Office2010.Drawing;

namespace Application.UseCases
{
    public class ApplicationUseCases : IApplicationUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IEmployeeInStructureRepository _employeeInStructureRepository;
        private readonly Iapplication_task_assigneeRepository _applicationTaskAssigneeRepository;
        private readonly IApplicationRoadRepository _applicationRoadRepository;
        private readonly Iuploaded_application_documentUseCases _uploadedApplicationDocumentUseCase;
        private readonly IN8nService _n8nService;
        private readonly ISendNotification sendNotification;
        private readonly IDatabase _redis;
        private readonly IRabbitMQPublisher _rabbitMQPublisher;
        private readonly IBgaService _bgaService;
        private readonly FileUseCases _fileUseCases;

        public ApplicationUseCases(IUnitOfWork unitOfWork,
            IEmployeeRepository employeeRepository,
            IEmployeeInStructureRepository employeeInStructureRepository,
            Iapplication_task_assigneeRepository applicationTaskAssigneeRepository,
            IApplicationRoadRepository applicationRoadRepository,
            ISendNotification SendNotification,
            Iuploaded_application_documentUseCases uplAppDocUseCase,
            IN8nService n8nService,
            IRabbitMQPublisher rabbitMQPublisher, IBgaService bgaService, FileUseCases fileUseCases,
            In8nRepository n8NRepository, IConnectionMultiplexer redis)
        {
            this.unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
            _employeeInStructureRepository = employeeInStructureRepository;
            _applicationTaskAssigneeRepository = applicationTaskAssigneeRepository;
            _applicationRoadRepository = applicationRoadRepository;
            _n8nService = n8nService;
            _uploadedApplicationDocumentUseCase = uplAppDocUseCase;
            this.sendNotification = SendNotification;
            _rabbitMQPublisher = rabbitMQPublisher;
            _bgaService = bgaService;
            _fileUseCases = fileUseCases;
            _redis = redis.GetDatabase();
        }

        public async Task<string> GetNextNumber()
        {
            var res = await unitOfWork.ApplicationRepository.GetLastNumber();
            return res.ToString();
        }
        public Task<List<Domain.Entities.Application>> GetAll()
        {
            return unitOfWork.ApplicationRepository.GetAll();
        }
        public Task<List<Domain.Entities.Application>> GetMyArchiveApplications(string pin)
        {
            return unitOfWork.ApplicationRepository.GetMyArchiveApplications(pin);
        }
        public Task<List<Domain.Entities.Application>> GetFromCabinet()
        {
            return unitOfWork.ApplicationRepository.GetFromCabinet();
        }
        public async Task<List<Domain.Entities.Application>> GetByFilterFromCabinet(PaginationFields filter)
        {
            // Trim filter fields like in GetPaginated
            filter.pin = filter.pin?.Trim();
            filter.customerName = filter.customerName?.Trim();
            filter.address = filter.address?.Trim();
            filter.number = filter.number?.Trim();
            filter.common_filter = filter.common_filter?.Trim();
            filter.incoming_numbers = filter.incoming_numbers?.Trim();
            filter.outgoing_numbers = filter.outgoing_numbers?.Trim();
            filter.application_code = filter.application_code?.Trim();

            // Handle isMyOrgApplication filter
            if (filter.isMyOrgApplication != null && filter.isMyOrgApplication.Value)
            {
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var orgs = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
                filter.structure_ids = orgs.Select(org => org.structure_id).ToArray();
            }
            filter.only_cabinet = true;
            // Call the repository method
            return await unitOfWork.ApplicationRepository.GetByFilterFromCabinet(filter, false);
        }

        public async Task<Domain.Entities.PaidAmmount> GetPaidInfoByApplicationGuid(string guid)
        {
            var application = await unitOfWork.ApplicationRepository.GetOneByGuid(guid);

            var result = new PaidAmmount
            {
                total_payed = application.total_payed,
                total_sum = application.total_sum
            };
            return result;
        }

        public async Task<PaginatedList<Domain.Entities.Application>> GetByFilterForEO(PaginationFields filter)
        {
            // Trim filter fields like in GetPaginated
            filter.pin = filter.pin?.Trim();
            filter.customerName = filter.customerName?.Trim();
            filter.address = filter.address?.Trim();
            filter.number = filter.number?.Trim();
            filter.common_filter = filter.common_filter?.Trim();
            filter.incoming_numbers = filter.incoming_numbers?.Trim();
            filter.outgoing_numbers = filter.outgoing_numbers?.Trim();
            filter.application_code = filter.application_code?.Trim();

            // Handle isMyOrgApplication filter
            if (filter.isMyOrgApplication != null && filter.isMyOrgApplication.Value)
            {
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var orgs = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
                filter.structure_ids = orgs.Select(org => org.structure_id).ToArray();
            }

            // Call the repository method
            return await unitOfWork.ApplicationRepository.GetByFilterFromEO(filter, false);
        }


        public async Task<PaginatedList<Domain.Entities.Application>> GetCountFilterForEO(PaginationFields filter)
        {
            return await unitOfWork.ApplicationRepository.GetByFilterFromEO(filter, true);
        }
        
        public async Task<PaginatedList<Domain.Entities.Application>> GetByFilterRefusal(PaginationFields filter)
        {
            // Trim filter fields like in GetPaginated
            filter.pin = filter.pin?.Trim();
            filter.customerName = filter.customerName?.Trim();
            filter.address = filter.address?.Trim();
            filter.number = filter.number?.Trim();
            filter.common_filter = filter.common_filter?.Trim();
            filter.incoming_numbers = filter.incoming_numbers?.Trim();
            filter.outgoing_numbers = filter.outgoing_numbers?.Trim();
            filter.application_code = filter.application_code?.Trim();

            // Handle isMyOrgApplication filter
            if (filter.isMyOrgApplication != null && filter.isMyOrgApplication.Value)
            {
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var orgs = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
                filter.structure_ids = orgs.Select(org => org.structure_id).ToArray();
            }

            // Call the repository method
            return await unitOfWork.ApplicationRepository.GetByFilterRefusal(filter, false);
        }


        public async Task<PaginatedList<Domain.Entities.Application>> GetCountFilterRefusal(PaginationFields filter)
        {
            return await unitOfWork.ApplicationRepository.GetByFilterRefusal(filter, true);
        }
        
        public Task<int> GetCountAppsFromCabinet()
        {
            return unitOfWork.ApplicationRepository.GetCountAppsFromCabinet();
        }

        public async Task<Domain.Entities.Application> GetOneByID(int id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(id);
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(user_id);
            app.is_favorite = await unitOfWork.ApplicationRepository.GetStatusFavorite(id, employee.id);
            var tasks = await unitOfWork.application_taskRepository.GetByapplication_id(id);
            app.workflow_task_structure_id = tasks.OrderBy(x => x.id).FirstOrDefault()?.task_template_id;
            return app;
        }

        public async Task<Domain.Entities.Application> GetOneByGuid(string guid)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByGuid(guid);
            var steps = await unitOfWork.application_stepRepository.GetByapplication_id(app.id);
            app.current_step = steps.OrderBy(x => x.id).FirstOrDefault(x => x.status == "in_progress" || x.status == "completed");
            return app;
        }

        public Task<int> GetFileId(int id)
        {
            return unitOfWork.ApplicationRepository.GetFileId(id);
        }


        public async Task<Result<Domain.Entities.Application>> Create(Domain.Entities.Application domain, int? cabinetStatusId = null, bool skipNumber = false, bool fromCabinet = false)
        {
            if (domain.customer == null)
                return Result.Fail(new LogicError("Заказчик не может быть пустым!"));
            //if (domain.customer.id == 0)
            //{
            domain.registration_date = DateTime.Now;

            if (domain.saveWithoutCheck.HasValue && !domain.saveWithoutCheck.Value)
            {
                var hasCreated = await unitOfWork.ApplicationRepository.CheckHasCreated(domain);
                if (hasCreated != null)
                {
                    return Result.Fail(new LogicError("Уже регистрировано!", new { id = hasCreated.id, code = "alreadyCreated" }));
                }
            }

            await InvalidatePaginationCache();
            domain.customer.id = 0;
            var customer_id = await unitOfWork.CustomerRepository.Add(domain.customer);
            domain.customer_id = customer_id;
            domain.customer.id = customer_id;

            var comments = await unitOfWork.application_commentRepository.GetByapplication_id(domain.id);
            var user = await unitOfWork.UserRepository.GetUserInfo();
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(user.Id);
            var districts = await unitOfWork.DistrictRepository.GetAll();

            var cashed_inf = new ApplicationCashedInfo
            {
                customer = domain.customer.full_name,
                customer_contacts = string.Join(", ", (new List<string> { domain.customer.sms_1, domain.customer.sms_2, domain.customer.email_1, domain.customer.email_2 }).Where(x => x != "").ToList()),
                customer_pin = domain.customer.pin,
                arch_objects = string.Join(", ", domain.archObjects.Select(x => x.address).ToList()),
                assignees = "",
                assignee_ids = new List<int>(),
                comments = string.Join(", ", (comments.Select(x => x.comment).ToList())),
                registrator_id = employee.id,
                registrator_name = employee.first_name + " " + employee.second_name + " " + employee.last_name

            };

            cashed_inf.district_names = string.Join(", ", districts.Where(x => cashed_inf.district_ids?.Contains(x.id) ?? false).Select(x => x.name));

            var assignees = new List<string>();
            //}
            //else
            //{
            //    await unitOfWork.CustomerRepository.Update(domain.customer);
            //    domain.customer_id = domain.customer_id;
            //}
            await AddOrUpdateCustomerContacts(domain);
            await AddOrUpdateCustomerRepresentatives(domain);
            //foreach (var customerRepresentatives in domain.customer.customerRepresentatives)
            //{
            //    customerRepresentatives.customer_id = domain.customer_id;
            //    await unitOfWork.CustomerRepresentativeRepository.Add(customerRepresentatives);
            //}
            if (!skipNumber)
            {
                var number = await unitOfWork.ApplicationRepository.GetLastNumber();
                domain.number = number.ToString();
            }

            domain.application_code = Guid.NewGuid().ToString("N").Substring(0, 5);

            var statuses = await unitOfWork.ApplicationStatusRepository.GetAll();
            var review = statuses.FirstOrDefault(x => x.code == "review");
            if (review != null)
            {
                domain.status_id = review.id;
            }
            if (cabinetStatusId != null)
            {
                domain.status_id = cabinetStatusId.Value;
            }

            foreach (var archObject in domain.archObjects)
            {
                archObject.id = 0;
                var arch_object_id = await unitOfWork.ArchObjectRepository.Add(archObject);
                archObject.id = arch_object_id;
                //var arch_object_id = await unitOfWork.ArchObjectRepository.Add(domain.archObject);
                domain.arch_object_id = arch_object_id;
                if (archObject.tags != null)
                {
                    foreach (var tag in archObject.tags)
                    {
                        arch_object_tag object_Tag = new arch_object_tag
                        {
                            id_object = arch_object_id,
                            id_tag = tag
                        };
                        var newTag = await unitOfWork.arch_object_tagRepository.Add(object_Tag);
                    }
                }
            }



            var deadline = await CalculateDeadlineService(domain.service_id);
            domain.deadline = deadline;
            var status_assign = await unitOfWork.task_statusRepository.GetOneByCode("assigned");
            var result = await unitOfWork.ApplicationRepository.Add(domain);
            domain.id = result;


            foreach (var archObject in domain.archObjects)
            {
                await unitOfWork.application_objectRepository.Add(new application_object
                {
                    arch_object_id = archObject.id,
                    application_id = result,
                });
            }

            if (!fromCabinet)
            {
                deadline = await CalculateDeadlineService(domain.service_id);
                domain.deadline = deadline;

                var tasks = await unitOfWork.WorkflowTaskTemplateRepository.GetByServiceId(domain.service_id);

                if (domain.workflow_task_structure_id != null)
                {
                    tasks = tasks.Where(x => x.id == domain.workflow_task_structure_id).ToList();
                }

                var main_order = tasks.OrderBy(x => x.order).FirstOrDefault()?.order;
                var added_task_id = 0;

                foreach (var task in tasks)
                {
                    application_task apptask = new application_task
                    {
                        name = task.name ?? "",
                        comment = task.description ?? "",
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        task_deadline = domain.deadline,
                        structure_id = task.structure_id,
                        application_id = result,
                        task_template_id = task.id,
                        type_id = task.type_id,
                        is_required = task.is_required,
                        order = task.order,
                        status_id = status_assign.id,
                        is_main = false
                    };

                    if (main_order != null && task.order == main_order)
                    {
                        apptask.is_main = true;
                        main_order = null;
                    }

                    var taskId = await unitOfWork.application_taskRepository.Add(apptask);
                    added_task_id = taskId;

                    unitOfWork.Commit();
                    if (task.structure_id != null)
                    {
                        var headStructures = await _employeeInStructureRepository.GetByStructureAndPost(task.structure_id, "head_structure");
                        foreach (var headStructure in headStructures)
                        {
                            await unitOfWork.application_task_assigneeRepository.Add(new application_task_assignee
                            {
                                application_task_id = taskId,
                                structure_employee_id = headStructure.id,
                                created_at = DateTime.Now,
                                updated_at = DateTime.Now
                            });
                            assignees.Add(headStructure.employee_name);
                            cashed_inf.assignee_ids.Add(headStructure.employee_id);
                            //await _applicationTaskAssigneeRepository.Add();

                            var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(headStructure.id);
                            //var userId = await unitOfWork.EmployeeRepository.GetUserIdByEmployeeID(empInStr.employee_id);
                            var application = await unitOfWork.ApplicationRepository.GetOneByID(result);
                            var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);
                            var customer = await unitOfWork.CustomerRepository.GetOneByID(application.customer_id);
                            var archObjects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(application.id);
                            var arch_adress = string.Join(", ", archObjects.Select(x => x.address));

                            var param = new Dictionary<string, string>();
                            param.Add("application_number", application.number);
                            param.Add("service_name", service.name);
                            param.Add("customer_name", customer.full_name);
                            param.Add("arch_adress", arch_adress);
                            param.Add("task_id", taskId.ToString());
                            await sendNotification.SendNotification("new_task", empInStr.employee_id, param);

                        }
                    }
                }




                var paths = await unitOfWork.service_pathRepository.GetByservice_id(domain.service_id); //TODO get only defaule
                var path = paths.FirstOrDefault(x => x.is_default == true && x.is_active == true);
                if (path != null)
                {
                    var steps = await unitOfWork.path_stepRepository.GetBypath_id(path.id);
                    var approvers = await unitOfWork.document_approverRepository.GetByPathId(path.id); //TODO
                    approvers = approvers.OrderBy(x => x.approval_order).ToList();

                    var requiredDocs = await unitOfWork.step_required_documentRepository.GetAll(); //TODO

                    await unitOfWork.ApplicationRepository.SetElectronicOnly(domain.id, true);

                    steps = steps.OrderBy(x => x.order_number).ToList();
                    for (var i = 0; i < steps.Count; i++)
                    {
                        var apStep = new application_step
                        {
                            application_id = result,
                            step_id = steps[i].id,
                            status = "waiting",
                            order_number = steps[i].order_number,
                            planned_duration = steps[i].estimated_days,
                            start_date = DateTime.UtcNow.AddHours(6), //todo
                        };

                        if (steps[i].estimated_days != null)
                        {
                            apStep.due_date = DateTime.Now.AddDays(steps[i].estimated_days.Value);
                        }

                        if (i == 0) apStep.status = "in_progress"; //TODO
                        var stepId = await unitOfWork.application_stepRepository.Add(apStep);

                        var docs = requiredDocs.Where(x => x.step_id == apStep.step_id).ToList();
                        var stepRequiredCalc = await unitOfWork.StepRequiredCalcRepository.GetOneByStepIdAndStructureId(steps[i].id, steps[i].responsible_org_id.Value);
                        if (stepRequiredCalc != null)
                        {
                            var appRequiredCalc = new ApplicationRequiredCalc
                            {
                                application_id = result,
                                application_step_id = stepId,
                                structure_id = steps[i].responsible_org_id
                            };
                            await unitOfWork.ApplicationRequiredCalcRepository.Add(appRequiredCalc);
                        }


                        foreach (var d in docs)
                        {
                            var apprs = approvers.Where(x => x.step_doc_id == d.id).ToList();
                            foreach (var a in apprs)
                            {
                                var da = new document_approval
                                {
                                    app_step_id = stepId,
                                    app_document_id = null,
                                    department_id = a.department_id,
                                    position_id = a.position_id,
                                    document_type_id = d.document_type_id,
                                    status = "waiting",
                                    created_at = DateTime.UtcNow.AddHours(6),
                                    is_required_approver = a.is_required,
                                    is_required_doc = d.is_required,

                                    // ✅ ДОБАВЛЕНО: Заполняем order_number из document_approver.approval_order
                                    order_number = a.approval_order,

                                    // Дополнительно: связываем с источником для синхронизации
                                    source_approver_id = a.id,
                                    is_manually_modified = false,
                                    last_sync_at = DateTime.UtcNow
                                };
                                await unitOfWork.document_approvalRepository.Add(da);
                            }
                        }

                        var work_docs = await unitOfWork.step_required_work_documentRepository.GetBystep_id(steps[i].id);
                        foreach (var doc in work_docs)
                        {
                            var ad = new ApplicationWorkDocument
                            {
                                id_type = doc.work_document_type_id,
                                task_id = added_task_id == 0 ? null : added_task_id,
                                app_step_id = stepId,
                                is_required = doc.is_required,

                            };
                            await unitOfWork.ApplicationWorkDocumentRepository.Add(ad);
                        }

                    }
                    unitOfWork.Commit();
                }
            }

            unitOfWork.Commit();


            cashed_inf.assignees = string.Join(", ", assignees);
            domain.cashed_info = JsonConvert.SerializeObject(cashed_inf);
            await unitOfWork.ApplicationRepository.Update(domain);

            var contacts = await unitOfWork.customer_contactRepository.GetBycustomer_id(domain.customer_id);
            var email = contacts.FirstOrDefault(x => x.type_name == "Почта"); //TODO

            await _n8nService.NotifyNewApplication(domain.id, email?.value);

            // mariadb executes
            if (unitOfWork.MariaDbRepository.HasMariaDbConnection())
            {
                var maria_db_statement_id = await SaveStatementToMariaDb(domain);
                await unitOfWork.ApplicationRepository.SaveMariaDbId(domain.id, maria_db_statement_id);
            }
            unitOfWork.Commit();

            return domain;
        }

        private async Task<int> SaveStatementToMariaDb(Domain.Entities.Application domain)
        {

            var customer = await unitOfWork.CustomerRepository.GetOneByID(domain.customer_id);
            var customer_contacts = await unitOfWork.customer_contactRepository.GetBycustomer_id(domain.customer_id);
            var representatives = await unitOfWork.CustomerRepresentativeRepository.GetByidCustomer(domain.customer_id);
            var representative = representatives.FirstOrDefault();
            var cus_tel = string.Join(", ", customer_contacts.Select(x => x.value));
            var service = await unitOfWork.ServiceRepository.GetOneByID(domain.service_id);

            var arch_object = await unitOfWork.ArchObjectRepository.GetOneByID(domain.arch_object_id ?? 0);
            var user = await unitOfWork.UserRepository.GetUserInfo();
            var maria_users = await unitOfWork.MariaDbRepository.GetEmployeesByEmail(user.Email ?? "");


            var tasks = await unitOfWork.WorkflowTaskTemplateRepository.GetByidWorkflow(service.workflow_id ?? 0);
            var task = tasks.FirstOrDefault();


            //var last_statement = await unitOfWork.MariaDbRepository.GetLastAddedApplication();

            //int last_sid = 0;
            //int.TryParse(last_statement.sid, out last_sid);
            //last_sid += 1;

            var maria_user_id = maria_users.FirstOrDefault()?.id;
            var workers = maria_user_id != null ? maria_user_id.ToString() : "1339";

            if (task != null)
            {
                var eis = await unitOfWork.EmployeeInStructureRepository.GetByStructureAndPost(task.structure_id, "head_structure");
                foreach (var e in eis)
                {
                    var emp2 = await unitOfWork.EmployeeRepository.GetOneByID(e.employee_id);
                    var maria_users2 = await unitOfWork.MariaDbRepository.GetEmployeesByEmail(emp2.email ?? "");
                    var mu = maria_users2.FirstOrDefault()?.id;
                    if (mu != null)
                    {
                        workers += "," + mu;
                    }
                }

            }

            var started = ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds();


            long pin = 8;
            long.TryParse("8" + customer.pin, out pin);
            var state = new Statement
            {
                app_number = domain.number,
                branch = 101,
                inn = pin,
                step = 1,
                service = domain.service_id,
                started = started,
                finished = domain.deadline == null ? 0 : ((DateTimeOffset)domain.deadline).ToUnixTimeSeconds(),
                issue = 0,
                fact = 0,
                sid = "1012" + domain.number,
                workers = workers,
                realize = 0,
                ticket = 0,
                _object = arch_object?.name + " " + arch_object?.address,
                person = customer.full_name

            };
            var maria_db_statement_id = await unitOfWork.MariaDbRepository.Add(state);

            var statementJson = new StatementJson
            {
                Save = "statements",
                Redirect = "statements",
                Step = "1",
                ServiceDays = service?.day_count?.ToString() ?? "0",
                FinishedOld = domain.deadline?.ToString("yyyy-MM-dd"),
                Service = domain.service_id.ToString(),
                Started = DateTime.Now.ToString("yyyy-MM-dd"),
                Finished = domain.deadline?.ToString("yyyy-MM-dd"),
                OName = domain.work_description ?? "",
                ODesc = arch_object.description ?? "",
                OAddress = arch_object.address ?? "",
                District = arch_object.district_id.ToString(),
                Inn = customer.pin,
                PType = "1", // паспорт КР
                PSurname = customer.individual_surname ?? "",
                PName = customer.individual_name ?? "",
                PPapi = customer.individual_secondname ?? "",
                PSeries = customer.registration_number ?? "",
                PMvd = customer.document_whom_issued ?? "",
                PDate = customer.document_date_issue?.ToString("yyyy-MM-dd") ?? "",
                PLife = customer.address ?? "",
                PTel = cus_tel.ToString(),

                //        [JsonPropertyName("com_name")]
                //public string com_name { get; set; }
                com_name = customer.full_name ?? "",
                com_address = customer.address ?? "",
                com_regs = customer.registration_number ?? "",
                com_tel = cus_tel ?? "",
                com_mail = "",
                com_ruks = customer.director ?? "",
                com_ugns = customer.ugns ?? "",
                com_rs = customer.payment_account ?? "",
                com_bank = customer.bank ?? "",
                com_bik = customer.bik ?? "",



                ProxyName = representative?.last_name + " " + representative?.first_name,
                ProxyNumber = representative?.notary_number ?? "",
                ProxyDate = representative?.date_start?.ToString("yyyy-MM-dd") ?? "",
                Docs = new List<string> { },
                ExtDocs1 = "",
                ExtDocs2 = "",
                ExtDocs3 = ""
            };
            var options = new JsonSerializerOptions { WriteIndented = true, Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };
            string json = System.Text.Json.JsonSerializer.Serialize(statementJson, options);


            //var body = new CreateFileJson
            //{
            //    json = json,
            //    sid = last_sid.ToString(),
            //};
            //string jsonBody = System.Text.Json.JsonSerializer.Serialize(body, options);

            //using var client = new HttpClient();
            //var request = new HttpRequestMessage(HttpMethod.Post,
            //    "https://localhost:7008/CreateFile");

            //var content = new StringContent(jsonBody, System.Text.Encoding.UTF8, "application/json");
            //request.Content = content;
            //var response = await client.SendAsync(request);
            //response.EnsureSuccessStatusCode();

            var year = "2024";
            if (domain.number.StartsWith("5"))
                year = "2025";
            var folderPath = "/var/www/okno.gosstroy.gov.kg/docs/101/" + year + "/" + ("1012" + domain.number) + "/txt";
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            if (System.IO.File.Exists(folderPath + "/state"))
            {
                System.IO.File.WriteAllText(folderPath + "/state2", json);
            }
            else
            {
                System.IO.File.WriteAllText(folderPath + "/state", json);
            }


            return maria_db_statement_id;
        }
        public class CreateFileJson
        {
            public string json { get; set; }
            public string sid { get; set; }
        }


        public async Task<Result<Domain.Entities.Application>> Update(Domain.Entities.Application domain)
        {
            var entity = await unitOfWork.ApplicationRepository.GetOneByID(domain.id);
            if (entity.updated_at != domain.updated_at)
            {
                //return Result.Fail<Domain.Entities.Application>(ErrorType.ALREADY_UPDATED);
                return Result.Fail(new AlreadyUpdatedError("Эта заявка уже обновлена кем-то, обновите страницу и попробуйте еще раз!"));
            }
            var districts = await unitOfWork.DistrictRepository.GetAll();

            var old_cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(entity.cashed_info);


            var comments = await unitOfWork.application_commentRepository.GetByapplication_id(domain.id);
            var cashed_inf = new ApplicationCashedInfo
            {
                customer = domain.customer.full_name,
                customer_contacts = string.Join(", ", (new List<string> { domain.customer.sms_1, domain.customer.sms_2, domain.customer.email_1, domain.customer.email_2 }).Where(x => x != "").ToList()),
                customer_pin = domain.customer.pin,
                arch_objects = string.Join(", ", domain.archObjects.Select(x => x.address).ToList()),
                assignees = "",
                district_ids = domain.archObjects.Select(x => x.district_id ?? 0).ToList(),
                assignee_ids = new List<int>(),
                comments = string.Join(", ", (comments.Select(x => x.comment).ToList())),
                registrator_name = old_cash.registrator_name,
                registrator_id = old_cash.registrator_id
            };
            cashed_inf.district_names = string.Join(", ", districts.Where(x => cashed_inf.district_ids.Contains(x.id)).Select(x => x.name));
            var assignees_str = new List<string>();

            //domain.customer.id = 0;
            //await unitOfWork.CustomerRepository.Add(domain.customer);
            await unitOfWork.CustomerRepository.Update(domain.customer);

            await AddOrUpdateCustomerContacts(domain);

            //await unitOfWork.ArchObjectRepository.Update(domain.archObject);
            await AddOrUpdateArchObjects(domain);

            await AddOrUpdateCustomerRepresentatives(domain);

            await InvalidatePaginationCache();

            if (entity.service_id != domain.service_id)
            {

                var status = await unitOfWork.ApplicationStatusRepository.GetById(entity.id);

                if (status == null || status.code.ToLower() == "review")
                {

                    var oldtasks = await unitOfWork.application_taskRepository.GetByapplication_id(entity.id);

                    foreach (var item in oldtasks)
                    {
                        var subtasks = await unitOfWork.application_subtaskRepository.GetByapplication_task_id(item.id);
                        foreach (var task in subtasks)
                        {
                            var subtaskAssignee = await unitOfWork.application_subtask_assigneeRepository.GetByapplication_subtask_id(task.id);
                            foreach (var subAssignee in subtaskAssignee)
                            {
                                await unitOfWork.application_subtask_assigneeRepository.Delete(subAssignee.id);
                            }
                            await unitOfWork.application_subtaskRepository.Delete(task.id);

                        }

                        var assignees = await unitOfWork.application_task_assigneeRepository.GetByapplication_task_id(item.id);
                        foreach (var assignee in assignees)
                        {
                            await unitOfWork.application_task_assigneeRepository.Delete(assignee.id);
                        }
                        await unitOfWork.application_taskRepository.Delete(item.id);
                    }
                }

                unitOfWork.Commit();

                var deadline = await CalculateDeadlineService(domain.service_id, entity.registration_date);
                domain.deadline = deadline;

                var status_assign = await unitOfWork.task_statusRepository.GetOneByCode("assigned");

                var tasks = await unitOfWork.WorkflowTaskTemplateRepository.GetByServiceId(domain.service_id);

                var added_task_id = 0;
                foreach (var task in tasks)
                {
                    var taskId = await unitOfWork.application_taskRepository.Add(new application_task
                    {
                        name = task.name ?? "",
                        comment = task.description ?? "",
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        structure_id = task.structure_id,
                        application_id = domain.id,
                        task_template_id = task.id,
                        type_id = task.type_id,
                        is_required = task.is_required,
                        order = task.order,
                        status_id = status_assign.id,
                    });
                    added_task_id = taskId;
                    unitOfWork.Commit();
                    if (task.structure_id != null)
                    {
                        var headStructures = await _employeeInStructureRepository.GetByStructureAndPost(task.structure_id, "head_structure");
                        foreach (var headStructure in headStructures)
                        {
                            await unitOfWork.application_task_assigneeRepository.Add(new application_task_assignee
                            {
                                application_task_id = taskId,
                                structure_employee_id = headStructure.id,
                                created_at = DateTime.Now,
                                updated_at = DateTime.Now
                            });
                            assignees_str.Add(headStructure.employee_name);
                            cashed_inf.assignee_ids.Add(headStructure.employee_id);

                            var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(headStructure.id);
                            //var userId = await unitOfWork.EmployeeRepository.GetUserIdByEmployeeID(empInStr.employee_id);
                            var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.id);
                            var service = await unitOfWork.ServiceRepository.GetOneByID(application.service_id);
                            var customer = await unitOfWork.CustomerRepository.GetOneByID(application.customer_id);
                            var archObjects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(application.id);
                            var arch_adress = string.Join(", ", archObjects.Select(x => x.address));

                            var param = new Dictionary<string, string>();
                            param.Add("application_number", application.number);
                            param.Add("service_name", service.name);
                            param.Add("customer_name", customer.full_name);
                            param.Add("arch_adress", arch_adress);
                            param.Add("task_id", taskId.ToString());
                            await sendNotification.SendNotification("new_task", empInStr.employee_id, param);

                        }
                    }
                }
                cashed_inf.assignees = string.Join(", ", assignees_str);
                await unitOfWork.application_stepRepository.DeleteByApplicationId(domain.id);
                await CreateApplicationStep(domain.service_id, domain.id, added_task_id);
            }
            else
            {
                var cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(entity.cashed_info);
                cashed_inf.assignees = cash.assignees;
            }
            domain.cashed_info = JsonConvert.SerializeObject(cashed_inf);
            await unitOfWork.ApplicationRepository.Update(domain);
            unitOfWork.Commit();
            return Result.Ok(domain);
        }

        private async Task CreateApplicationStep(int service_id, int application_id, int apptask)
        { 
            var paths = await unitOfWork.service_pathRepository.GetByservice_id(service_id); //TODO get only defaule
            var path = paths.FirstOrDefault(x => x.is_default == true && x.is_active == true);
            if (path != null)
            {
                var steps = await unitOfWork.path_stepRepository.GetBypath_id(path.id);
                var approvers = await unitOfWork.document_approverRepository.GetByPathId(path.id); //TODO
                approvers = approvers.OrderBy(x => x.approval_order).ToList();

                var requiredDocs = await unitOfWork.step_required_documentRepository.GetAll(); //TODO

                await unitOfWork.ApplicationRepository.SetElectronicOnly(application_id, true);

                steps = steps.OrderBy(x => x.order_number).ToList();
                for (var i = 0; i < steps.Count; i++)
                    {
                        var apStep = new application_step
                        {
                            application_id = application_id,
                            step_id = steps[i].id,
                            status = "waiting",
                            planned_duration = steps[i].estimated_days,
                            start_date = DateTime.UtcNow.AddHours(6), //todo
                        };

                        if (steps[i].estimated_days != null)
                        {
                            apStep.due_date = DateTime.Now.AddDays(steps[i].estimated_days.Value);
                        }

                        if (i == 0) apStep.status = "in_progress"; //TODO
                        var stepId = await unitOfWork.application_stepRepository.Add(apStep);

                        var docs = requiredDocs.Where(x => x.step_id == apStep.step_id).ToList();
                        var stepRequiredCalc = await unitOfWork.StepRequiredCalcRepository.GetOneByStepIdAndStructureId(steps[i].id, steps[i].responsible_org_id.Value);
                        if (stepRequiredCalc != null)
                        {
                            var appRequiredCalc = new ApplicationRequiredCalc
                            {
                                application_id = application_id,
                                application_step_id = stepId,
                                structure_id = steps[i].responsible_org_id
                            };
                            await unitOfWork.ApplicationRequiredCalcRepository.Add(appRequiredCalc);
                        }


                        foreach (var d in docs)
                        {
                            var apprs = approvers.Where(x => x.step_doc_id == d.id).ToList();
                            foreach (var a in apprs)
                            {
                                var da = new document_approval
                                {
                                    app_step_id = stepId,
                                    app_document_id = null,
                                    department_id = a.department_id,
                                    position_id = a.position_id,
                                    document_type_id = d.document_type_id,
                                    status = "waiting",
                                    created_at = DateTime.UtcNow.AddHours(6), //TODO
                                    is_required_approver = a.is_required,
                                    is_required_doc = d.is_required

                                };
                                await unitOfWork.document_approvalRepository.Add(da);
                            }
                        }

                        var work_docs = await unitOfWork.step_required_work_documentRepository.GetBystep_id(steps[i].id);
                        foreach (var doc in work_docs)
                        {
                            var ad = new ApplicationWorkDocument
                            {
                                id_type = doc.work_document_type_id,
                                task_id = apptask == 0 ? null : apptask,
                                app_step_id = stepId,
                                is_required = doc.is_required,

                            };
                            await unitOfWork.ApplicationWorkDocumentRepository.Add(ad);
                        }

                    }
                unitOfWork.Commit();
            }
        }
        
        async Task AddOrUpdateObjectTags(ArchObject domain)
        {
            var existingTags = await unitOfWork.arch_object_tagRepository.GetByIdObject(domain.id);
            var newTags = domain.tags;

            List<arch_object_tag> listToDelete = new List<arch_object_tag> { };
            var tagsToDelete = existingTags.Where(t => !newTags.Contains(t.id_tag));
            if (tagsToDelete != null)
            {
                listToDelete = tagsToDelete.ToList();
            }
            foreach (var tagToDelete in listToDelete)
            {
                await unitOfWork.arch_object_tagRepository.Delete(tagToDelete.id);
            }

            var tagsToAdd = newTags.Where(tag => !existingTags.Any(t => t.id_tag == tag)).ToList();
            foreach (var tag in tagsToAdd)
            {
                arch_object_tag newTag = new arch_object_tag
                {
                    id_object = domain.id,
                    id_tag = tag
                };
                await unitOfWork.arch_object_tagRepository.Add(newTag);
            }
        }
        async Task DeleteObjectTags(int arch_object_id)
        {
            var existingTags = await unitOfWork.arch_object_tagRepository.GetByIdObject(arch_object_id);
            foreach (var tagToDelete in existingTags)
            {
                await unitOfWork.arch_object_tagRepository.Delete(tagToDelete.id);
            }
        }

        async Task AddOrUpdateArchObjects(Domain.Entities.Application domain)
        {
            //var existingObjects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(domain.id);

            //var curr_ids = domain.archObjects.Select(x => x.id).ToList();
            //var forDelete = existingObjects.Where(x => !curr_ids.Contains(x.id)).Select(x => x.id).ToList();
            //foreach (var forD in forDelete)
            //{
            //    await DeleteObjectTags(forD);
            //    unitOfWork.
            //}
            //var newTags = domain.archObject.tags;
            var curr_ids = domain.archObjects.Select(x => x.id).ToList();
            var existingObjects = await unitOfWork.application_objectRepository.GetByapplication_id(domain.id);
            var forDelete = existingObjects.Where(x => !curr_ids.Contains(x.arch_object_id)).Select(x => x.id).ToList();
            foreach (var forD in forDelete)
            {
                await unitOfWork.application_objectRepository.Delete(forD);
            }

            foreach (var obj in domain.archObjects)
            {
                if (obj.id < 0)
                {
                    obj.id = 0;
                    var obj_id = await unitOfWork.ArchObjectRepository.Add(obj);
                    obj.id = obj_id;
                    await unitOfWork.application_objectRepository.Add(new application_object
                    {
                        application_id = domain.id,
                        arch_object_id = obj_id,
                    });
                    await AddOrUpdateObjectTags(obj);
                }
                else
                {
                    await unitOfWork.ArchObjectRepository.Update(obj);
                    await AddOrUpdateObjectTags(obj);
                }
            }

        }

        async Task AddOrUpdateCustomerRepresentatives(Domain.Entities.Application domain)
        {
            var oldReprs = await unitOfWork.CustomerRepresentativeRepository.GetByidCustomer(domain.customer_id);
            foreach (var item in oldReprs) // for delete
            {
                if (!domain.customer.customerRepresentatives.Any(x => x.id == item.id))
                {
                    await unitOfWork.CustomerRepresentativeRepository.Delete(item.id);
                }
            }
            foreach (var item in domain.customer.customerRepresentatives)
            {
                item.customer_id = domain.customer.id;
                if (item.id < 1) // for add
                {
                    item.id = 0;
                    await unitOfWork.CustomerRepresentativeRepository.Add(item);
                }
                else
                {
                    await unitOfWork.CustomerRepresentativeRepository.Update(item);
                }
            }
        }

        async Task AddOrUpdateCustomerContacts(Domain.Entities.Application domain)
        {
            var contacts = await unitOfWork.customer_contactRepository.GetBycustomer_id(domain.customer_id);
            var smsType = await unitOfWork.contact_typeRepository.GetOneByCode("sms");
            var emailType = await unitOfWork.contact_typeRepository.GetOneByCode("email");
            var telegramType = await unitOfWork.contact_typeRepository.GetOneByCode("telegram");

            var smss = contacts.Where(x => x.type_code == "sms").ToList();
            var emails = contacts.Where(x => x.type_code == "email").ToList();
            var telegrams = contacts.Where(x => x.type_code == "telegram").ToList();
            if (smss.Count > 0)
            {
                smss[0].value = domain.customer.sms_1;
                await unitOfWork.customer_contactRepository.Update(smss[0]);
            }
            else
            {
                await AddCustomerContactIfNotNull(domain.customer.sms_1, domain.customer.id, smsType.id);
            }
            if (smss.Count > 1)
            {
                smss[1].value = domain.customer.sms_2;
                await unitOfWork.customer_contactRepository.Update(smss[1]);
            }
            else
            {
                await AddCustomerContactIfNotNull(domain.customer.sms_2, domain.customer.id, smsType.id);
            }
            if (emails.Count > 0)
            {
                emails[0].value = domain.customer.email_1;
                await unitOfWork.customer_contactRepository.Update(emails[0]);
            }
            else
            {
                await AddCustomerContactIfNotNull(domain.customer.email_1, domain.customer.id, emailType.id);
            }
            if (emails.Count > 1)
            {
                emails[1].value = domain.customer.email_2;
                await unitOfWork.customer_contactRepository.Update(emails[1]);
            }
            else
            {
                await AddCustomerContactIfNotNull(domain.customer.email_2, domain.customer.id, emailType.id);
            }
            if (telegrams.Count > 0)
            {
                telegrams[0].value = domain.customer.telegram_1;
                await unitOfWork.customer_contactRepository.Update(telegrams[0]);
            }
            else
            {
                await AddCustomerContactIfNotNull(domain.customer.telegram_1, domain.customer.id, telegramType.id);
            }
            if (telegrams.Count > 1)
            {
                telegrams[1].value = domain.customer.telegram_2;
                await unitOfWork.customer_contactRepository.Update(telegrams[1]);
            }
            else
            {
                await AddCustomerContactIfNotNull(domain.customer.telegram_2, domain.customer.id, telegramType.id);
            }

        }
        async Task AddCustomerContactIfNotNull(string? value, int customerId, int typeId)
        {
            if (!string.IsNullOrEmpty(value))
            {
                await unitOfWork.customer_contactRepository.Add(new customer_contact
                {
                    customer_id = customerId,
                    type_id = typeId,
                    value = value
                });
            }
        }

        public async Task<PaginatedList<Domain.Entities.Application>> GetPagniated(PaginationFields filter)
        {
            filter.pin = filter.pin?.Trim();
            filter.customerName = filter.customerName?.Trim();
            filter.address = filter.address?.Trim();
            filter.number = filter.number?.Trim();
            filter.common_filter = filter.common_filter?.Trim();
            filter.incoming_numbers = filter.incoming_numbers?.Trim();
            filter.outgoing_numbers = filter.outgoing_numbers?.Trim();
            filter.application_code = filter.application_code?.Trim();

            string cacheKey = GenerateCacheKey(filter);
            int ttlSeconds = 300;

            string cachedResult = await _redis.StringGetAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedResult))
            {
                var res = JsonConvert.DeserializeObject<PaginatedList<Domain.Entities.Application>>(cachedResult);
                return res;
            }

            PaginatedList<Domain.Entities.Application> result;
            if (filter.issued_employee_id != null)
            {
                result = await unitOfWork.ApplicationRepository.GetPaginatedDashboardIssuedFromRegister(filter, false);
            }

            if (filter.isMyOrgApplication != null && filter.isMyOrgApplication.Value)
            {
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var orgs = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
                filter.structure_ids = orgs.Select(org => org.structure_id).ToArray();
            }


            if (filter.pageSize == 70)
            {
                filter.useCommon = false;
                if (filter.common_filter?.All(char.IsDigit) == true)
                {
                    filter.pin = filter.common_filter;
                }
                else
                {
                    filter.address = filter.common_filter;
                }
            }

            result = await unitOfWork.ApplicationRepository.GetPaginated(filter, filter.only_count, false);

            if (result.TotalCount == 0)
            {
                result.TotalCount = result.Items?.Count ?? 0;
                result.TotalPages = 1;
            }

            var appIds = result.Items.Select(x => x.id).ToList();
            if (((filter.journals_id != null && filter.journals_id != 0) || (filter.is_journal != null && filter.is_journal.Value)) && appIds.Count > 0)
            {
                var journals = await unitOfWork.JournalApplicationRepository.GetByAppID(appIds);
                var journalMap = journals
                    .GroupBy(x => x.application_id)
                    .ToDictionary(
                        g => g.Key,
                        g => g.First()
                    );

                foreach (var app in result.Items)
                {
                    if (journalMap.TryGetValue(app.id, out var journalInfo))
                    {
                        app.journal_name = journalInfo.journal_name;
                        app.journal_outgoing_number = journalInfo.outgoing_number;
                        app.journal_added_at = journalInfo.created_at;
                    }
                }
            }

            var serializeOptions = new JsonSerializerOptions { IgnoreNullValues = true };
            string serializedOutcome = System.Text.Json.JsonSerializer.Serialize(result, serializeOptions);
            await _redis.StringSetAsync(cacheKey, serializedOutcome, TimeSpan.FromSeconds(ttlSeconds));

            return result;
        }

        private string GenerateCacheKey(PaginationFields filter)
        {
            var filterJson = System.Text.Json.JsonSerializer.Serialize(filter, new JsonSerializerOptions
            {
                IgnoreNullValues = true
            });
            using var sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(filterJson);
            byte[] hash = sha256.ComputeHash(bytes);
            string hashString = Convert.ToBase64String(hash).Replace("/", "_").Replace("+", "-");

            return $"applications:pagination:{hashString}";
        }

        public async Task InvalidatePaginationCache()
        {
            var multiplexer = _redis.Multiplexer;
            var server = multiplexer.GetServer(multiplexer.GetEndPoints().First());

            var keys = server.Keys(pattern: "applications:pagination:*").ToArray();
            if (keys.Any())
            {
                await _redis.KeyDeleteAsync(keys);
            }
        }

        public async Task<PaginatedList<Domain.Entities.Application>> GetPagniatedFinPlan(PaginationFields filter)
        {
            filter.pin = filter?.pin?.Trim();
            filter.customerName = filter?.customerName?.Trim();
            filter.address = filter?.address?.Trim();
            filter.number = filter?.number?.Trim();
            filter.common_filter = filter?.common_filter?.Trim();
            filter.incoming_numbers = filter?.incoming_numbers?.Trim();
            filter.outgoing_numbers = filter?.outgoing_numbers?.Trim();
            filter.application_code = filter?.application_code?.Trim();

            string cacheKey = GenerateCacheKey(filter);
            int ttlSeconds = 300;

            string cachedResult = await _redis.StringGetAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedResult))
            {
                return JsonConvert.DeserializeObject<PaginatedList<Domain.Entities.Application>>(cachedResult);
            }


            var res = await unitOfWork.ApplicationRepository.GetPaginated(filter, false, true);
            res.TotalCount = res.Items?.Count ?? 0;

            var reestrs = await unitOfWork.application_in_reestrRepository.GetByApplicationIds(res.Items.Select(x => x.id).ToArray());

            res.Items.ForEach(app =>
            {
                var reestr = reestrs.FirstOrDefault(x => x.application_id == app.id);
                if (reestr != null)
                {
                    app.reestr_id = reestr.reestr_id;
                    app.reestr_name = reestr.reestr_name;
                }
            });

            return res;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationRepository.Delete(id);
            unitOfWork.Commit();
        }

        public Task<Domain.Entities.ApplicationStatus> GetStatusById(int id)
        {
            return unitOfWork.ApplicationRepository.GetStatusById(id);
        }

        public Task<List<ApplicationPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            return unitOfWork.ApplicationRepository.GetForPivotDashboard(date_start, date_end, service_id, status_id);
        }

        public async Task<List<ApplicationPivot>> GetForPivotDashboardMyStructure(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ApplicationRepository.GetForPivotDashboard(date_start, date_end, service_id, status_id, user_id);
        }

        public Task<List<Domain.Entities.ApplicationReport>> GetForReport(bool? isOrg, int? mount, int? year,
            int? structure)
        {
            return unitOfWork.ApplicationRepository.GetForReport(isOrg, mount, year, structure);
        }

        public async Task<PaginatedList<Domain.Entities.ApplicationReport>> GetForReportPaginated(bool? isOrg, int? mount, int? year, int? structure,
            int pageSize, int pageNumber, string orderBy, string? orderType)
        {
            return await unitOfWork.ApplicationRepository.GetForReportPaginated(isOrg, mount, year, structure, pageSize, pageNumber, orderBy, orderType);
        }

        public async Task<Result<int>> sendDpOutgoingNumber(int application_id, string? dp_outgoing_number)
        {
            var res = await unitOfWork.ApplicationRepository.sendDpOutgoingNumber(application_id, dp_outgoing_number);
            unitOfWork.Commit();
            return Result.Ok(res);
        }

        public async Task<Result<int>> ChangeStatus(int application_id, int status_id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            var curRoad = await _applicationRoadRepository.GetByStatuses(app.status_id, status_id);
            if (curRoad == null)
            {
                var error = new ErrorDetails
                {
                    ru = "Статус уже был обновлен, перезагрузите страницу",
                    kg = "Статус уже был обновлен, перезагрузите страницу"
                };

                var errorJson = JsonConvert.SerializeObject(error, Formatting.Indented);
                return Result.Fail(new LogicError(errorJson));
            }

            if (!string.IsNullOrEmpty(curRoad.validation_url))
            {
                var checkResponse = await _n8nService.ValidateWorkflow(application_id, curRoad.validation_url);
                var check = checkResponse.FirstOrDefault();
                if (check?.valid != null && !check.valid.Value)
                {
                    var errorJson = JsonConvert.SerializeObject(check.error, Formatting.Indented);
                    return Result.Fail(new LogicError(errorJson));
                }
            }
            await InvalidatePaginationCache();
            var old_application = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            var res = await unitOfWork.ApplicationRepository.ChangeStatus(application_id, status_id);
            var status = await unitOfWork.ApplicationStatusRepository.GetById(status_id);


            if (status.code == "approved_cabinet")
            {
                var districts = await unitOfWork.DistrictRepository.GetAll();

                var old_cash = JsonConvert.DeserializeObject<ApplicationCashedInfo>(app.cashed_info);

                var assignees = new List<string>();
                {
                    var status_assign = await unitOfWork.task_statusRepository.GetOneByCode("assigned");
                    var deadline = await CalculateDeadlineService(app.service_id);
                    app.deadline = deadline;

                    var tasks = await unitOfWork.WorkflowTaskTemplateRepository.GetByServiceId(app.service_id);

                    if (app.workflow_task_structure_id != null)
                    {
                        tasks = tasks.Where(x => x.id == app.workflow_task_structure_id).ToList();
                    }

                    var main_order = tasks.OrderBy(x => x.order).FirstOrDefault()?.order;
                    var added_task_id = 0;

                    foreach (var task in tasks)
                    {
                        application_task apptask = new application_task
                        {
                            name = task.name ?? "",
                            comment = task.description ?? "",
                            created_at = DateTime.Now,
                            updated_at = DateTime.Now,
                            task_deadline = app.deadline,
                            structure_id = task.structure_id,
                            application_id = app.id,
                            task_template_id = task.id,
                            type_id = task.type_id,
                            is_required = task.is_required,
                            order = task.order,
                            status_id = status_assign.id,
                            is_main = false
                        };

                        if (main_order != null && task.order == main_order)
                        {
                            apptask.is_main = true;
                            main_order = null;
                        }

                        var taskId = await unitOfWork.application_taskRepository.Add(apptask);
                        added_task_id = taskId;

                        unitOfWork.Commit();
                        if (task.structure_id != null)
                        {
                            var headStructures = await _employeeInStructureRepository.GetByStructureAndPost(task.structure_id, "head_structure");
                            foreach (var headStructure in headStructures)
                            {
                                await unitOfWork.application_task_assigneeRepository.Add(new application_task_assignee
                                {
                                    application_task_id = taskId,
                                    structure_employee_id = headStructure.id,
                                    created_at = DateTime.Now,
                                    updated_at = DateTime.Now
                                });
                                assignees.Add(headStructure.employee_name);
                                if (old_cash.assignee_ids  == null)
                                {
                                    old_cash.assignee_ids = new List<int>();
                                }
                                old_cash.assignee_ids.Add(headStructure.employee_id);
                                //await _applicationTaskAssigneeRepository.Add();

                                var empInStr = await unitOfWork.EmployeeInStructureRepository.GetOneByID(headStructure.id);
                                //var userId = await unitOfWork.EmployeeRepository.GetUserIdByEmployeeID(empInStr.employee_id);
                                var service = await unitOfWork.ServiceRepository.GetOneByID(app.service_id);
                                var customer = await unitOfWork.CustomerRepository.GetOneByID(app.customer_id);
                                var archObjects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(app.id);
                                var arch_adress = string.Join(", ", archObjects.Select(x => x.address));

                                var param = new Dictionary<string, string>();
                                param.Add("application_number", app.number);
                                param.Add("service_name", service.name);
                                param.Add("customer_name", customer.full_name);
                                param.Add("arch_adress", arch_adress);
                                param.Add("task_id", taskId.ToString());
                                await sendNotification.SendNotification("new_task", empInStr.employee_id, param);

                            }
                        }
                    }




                    var paths = await unitOfWork.service_pathRepository.GetByservice_id(app.service_id); //TODO get only defaule
                    var path = paths.FirstOrDefault(x => x.is_default == true && x.is_active == true);
                    if (path != null)
                    {
                        var steps = await unitOfWork.path_stepRepository.GetBypath_id(path.id);
                        var approvers = await unitOfWork.document_approverRepository.GetByPathId(path.id); //TODO
                        approvers = approvers.OrderBy(x => x.approval_order).ToList();

                        var requiredDocs = await unitOfWork.step_required_documentRepository.GetAll(); //TODO

                        await unitOfWork.ApplicationRepository.SetElectronicOnly(app.id, true);

                        steps = steps.OrderBy(x => x.order_number).ToList();
                        for (var i = 0; i < steps.Count; i++)
                        {
                            var apStep = new application_step
                            {
                                application_id = app.id,
                                step_id = steps[i].id,
                                status = "waiting",
                                planned_duration = steps[i].estimated_days,
                                start_date = DateTime.UtcNow.AddHours(6), //todo
                            };

                            if (steps[i].estimated_days != null)
                            {
                                apStep.due_date = DateTime.Now.AddDays(steps[i].estimated_days.Value);
                            }

                            if (i == 0) apStep.status = "in_progress"; //TODO
                            var stepId = await unitOfWork.application_stepRepository.Add(apStep);

                            var docs = requiredDocs.Where(x => x.step_id == apStep.step_id).ToList();
                            var stepRequiredCalc = await unitOfWork.StepRequiredCalcRepository.GetOneByStepIdAndStructureId(steps[i].id, steps[i].responsible_org_id.Value);
                            if (stepRequiredCalc != null)
                            {
                                var appRequiredCalc = new ApplicationRequiredCalc
                                {
                                    application_id = app.id,
                                    application_step_id = stepId,
                                    structure_id = steps[i].responsible_org_id
                                };
                                await unitOfWork.ApplicationRequiredCalcRepository.Add(appRequiredCalc);
                            }


                            foreach (var d in docs)
                            {
                                var apprs = approvers.Where(x => x.step_doc_id == d.id).ToList();
                                foreach (var a in apprs)
                                {
                                    var da = new document_approval
                                    {
                                        app_step_id = stepId,
                                        app_document_id = null,
                                        department_id = a.department_id,
                                        position_id = a.position_id,
                                        document_type_id = d.document_type_id,
                                        status = "waiting",
                                        created_at = DateTime.UtcNow.AddHours(6), //TODO
                                        is_required_approver = a.is_required,
                                        is_required_doc = d.is_required

                                    };
                                    await unitOfWork.document_approvalRepository.Add(da);
                                }
                            }

                            var work_docs = await unitOfWork.step_required_work_documentRepository.GetBystep_id(steps[i].id);
                            foreach (var doc in work_docs)
                            {
                                var ad = new ApplicationWorkDocument
                                {
                                    id_type = doc.work_document_type_id,
                                    task_id = added_task_id == 0 ? null : added_task_id,
                                    app_step_id = stepId,
                                    is_required = doc.is_required,

                                };
                                await unitOfWork.ApplicationWorkDocumentRepository.Add(ad);
                            }

                        }
                        unitOfWork.Commit();
                    }
                }

                unitOfWork.Commit();


                old_cash.assignees = string.Join(", ", assignees);
                app.cashed_info = JsonConvert.SerializeObject(old_cash);
                await unitOfWork.ApplicationRepository.Update(app);
            }


            if (status.code == "deleted")
            {
                var tasks = unitOfWork.application_taskRepository.GetByapplication_id(application_id);
                foreach (var task in tasks.Result)
                {
                    var assignees = unitOfWork.application_task_assigneeRepository.GetByapplication_task_id(task.id);
                    foreach (var assignee in assignees.Result)
                    {
                        await unitOfWork.application_task_assigneeRepository.Delete(assignee.id);
                    }
                    var subtasks = unitOfWork.application_subtaskRepository.GetByapplication_task_id(task.id);
                    foreach (var subtask in subtasks.Result)
                    {
                        var subAssignees = unitOfWork.application_subtask_assigneeRepository.GetByapplication_subtask_id(subtask.id);
                        foreach (var subAssignee in subAssignees.Result)
                        {
                            await unitOfWork.application_subtask_assigneeRepository.Delete(subAssignee.id);
                        }
                        await unitOfWork.application_subtaskRepository.Delete(subtask.id);
                    }
                    await unitOfWork.application_taskRepository.Delete(task.id);
                }
            }

            if (status.code == "document_ready" && app.app_cabinet_uuid != null)
            {
                await _bgaService.SendReadyDocRequestAsync(app.app_cabinet_uuid, app.number);
            }
            //if (status.code == "preparation" && app.app_cabinet_uuid != null && app.deadline != null)
            //{
            //    var title = "Заявка принята в работу";
            //    var message = $"Ваша заявка под номером {app.number} принята в работу, Ожидаемая дата выполнения - {app.deadline.Value.ToString("dd.MM.yyyy")}";
            //    await _bgaService.SendNotificationToCabinet(app.app_cabinet_uuid, title, message);

            //    var contacts = await unitOfWork.customer_contactRepository.GetBycustomer_id(app.customer_id);
            //    var emails = contacts.Where(x => x.type_code == "email").ToList();
            //    if (emails[0] != null)
            //    {
            //        var notification = new SendMessageN8n
            //        {
            //            subject = title,
            //            message = message,
            //            value = emails[0]?.value,
            //            type_con = "email",
            //            application_id = app.id,
            //            customer_id = app.customer_id
            //        };
            //        var notifications = new List<SendMessageN8n> { notification };
            //        await sendNotification.SendRawNotification(notifications);
            //    }
            //}



            var userID = await unitOfWork.UserRepository.GetUserID();
            var history = new ApplicationStatusHistory
            {
                application_id = application_id,
                status_id = status_id,
                date_change = DateTime.Now,
                user_id = userID,
                old_status_id = old_application.status_id
            };

            var addHistory = await unitOfWork.ApplicationStatusHistoryRepository.Add(history);

            unitOfWork.Commit();


            var journals = await unitOfWork.DocumentJournalsRepository.GetAll(); //TODO
            var applicationsInJournal = await unitOfWork.JournalApplicationRepository.GetAll();
            var filteredJournals = journals.Where(x => x.status_ids != null && x.status_ids.Contains(status_id)).ToList();
            if (filteredJournals.Count > 0)
            {
                if (!applicationsInJournal.Any(x => x.application_id == application_id))
                {

                    var serviceJournal = await unitOfWork.ServiceStatusNumberingRepository.GetByServiceId(old_application.service_id);
                    serviceJournal = serviceJournal.Where(x => x.is_active == true && (x.date_start.Date <= DateTime.Now.Date) && (x.date_end == null || x.date_end.Value.Date >= DateTime.Now.Date)).ToList();
                    var allplaceholders = await unitOfWork.S_PlaceHolderTemplateRepository.GetAll();

                    foreach (var j in filteredJournals)
                    {
                        if (!serviceJournal.Any(x => x.journal_id == j.id)) continue;

                        var journalNumber = j.current_number;
                        var journalPlaceholders = await unitOfWork.JournalPlaceholderRepository.GetByDocumentJournalId(j.id);
                        journalPlaceholders = journalPlaceholders.OrderBy(x => x.order_number).ToList();
                        var ids = journalPlaceholders.Select(x => x.placeholder_id).ToList();

                        var placeholders = allplaceholders.Where(x => ids.Contains(x.id)).ToList();

                        var queriedPlaceholders = new Dictionary<int, string>();

                        foreach (var item in placeholders)
                        {
                            var result = await unitOfWork.S_QueryRepository.CallQuery(item.idQuery, new Dictionary<string, object> { { "application_id", application_id } });

                            if (item.S_PlaceHolderType.code == "text")
                            {
                                if (result.Count != 0)
                                {
                                    var pl = (IDictionary<string, object>)result.First();
                                    queriedPlaceholders.Add(item.id, pl[item.value]?.ToString());
                                }
                            }

                        }

                        var number = "";
                        foreach (var pl in journalPlaceholders)
                        {
                            if (pl.template_code == "number")
                            {
                                number += ++journalNumber;
                            }
                            else if (!string.IsNullOrWhiteSpace(pl.raw_value))
                            {
                                number += pl.raw_value;
                            }
                            else if (pl.placeholder_id != null)
                            {
                                number += queriedPlaceholders[pl.placeholder_id.Value];
                            }
                        }

                        var ja = new JournalApplication
                        {
                            journal_id = j.id,
                            application_id = application_id,
                            application_status_id = status_id,
                            outgoing_number = number
                        };
                        await unitOfWork.JournalApplicationRepository.Add(ja);
                        j.current_number = journalNumber;
                        await unitOfWork.DocumentJournalsRepository.Update(j);

                        await unitOfWork.ApplicationRepository.sendOutgoingNumber(application_id, number);
                    }

                }
            }
            unitOfWork.Commit();



            if (!string.IsNullOrEmpty(curRoad.post_function_url))
            {
                await _n8nService.ExecuteWorkflow(application_id, curRoad.post_function_url);
            }

            // mariadb executes
            try
            {
                if (unitOfWork.MariaDbRepository.HasMariaDbConnection())
                {
                    await this.ChangeStepMariaDb(app, status_id);
                }
            }
            catch
            {

            }

            if (status.code == "document_issued")
            {
                await _n8nService.RegisterInFinBook(app, true);
            }

            return Result.Ok(res);
        }

        private async Task ChangeStepMariaDb(Domain.Entities.Application app, int status_id)
        {
            var statement = await unitOfWork.MariaDbRepository.GetStatementById(app.maria_db_statement_id ?? 0);
            if (statement == null)
            {
                return;
            }
            var statuses = await unitOfWork.ApplicationStatusRepository.GetAll();
            var status = statuses.FirstOrDefault(x => x.id == status_id);

            if (status?.description != null)
            {
                int step_id = 0;
                if (int.TryParse(status.description, out step_id))
                {
                    try
                    {
                        // Чтение JSON-данных из файла
                        var js = await System.IO.File.ReadAllTextAsync("jsons/" + statement.sid + ".json");

                        var options = new JsonSerializerOptions { WriteIndented = true, Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };

                        StatementJson statemen = System.Text.Json.JsonSerializer.Deserialize<StatementJson>(js, options);
                        if (statemen != null)
                        {
                            statemen.Step = step_id.ToString();

                            string json = System.Text.Json.JsonSerializer.Serialize(statemen, options);

                            System.IO.File.WriteAllText("jsons/" + statement.sid + ".json", json);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Ошибка при чтении JSON-файла: {ex.Message}");
                    }
                    await unitOfWork.MariaDbRepository.ChangeStepApplication(statement.id, step_id);
                }
            }


        }


        public List<string> check = new List<string>
        {
            //Application status codes
            "in_progress"
        };

        public async Task<List<Domain.Entities.ApplicationTask>> GetMyApplications(string searchField, string orderBy, string orderType, int skipItem, int getCountItems, string? codeFilter)
        {
            var userID = await unitOfWork.UserRepository.GetUserUID();
            var queryFilter = string.Empty;
            if (!string.IsNullOrEmpty(codeFilter))
            {
                queryFilter = await unitOfWork.QueryFiltersRepository.GetSqlByCode("application_task", codeFilter);
            }
            //var statuses = await unitOfWork.ApplicationStatusRepository.GetAll();
            var res = await unitOfWork.ApplicationRepository.GetApplicationsByUserId(userID, searchField, orderBy, orderType, skipItem, getCountItems, queryFilter);
            var result = new List<Domain.Entities.ApplicationTask>();
            foreach (var item in res)
            {
                if (item.application_status_code != null && check.Any(x => x == item.application_status_group_code))
                {
                    item.application_status_color = ChechApplicationStatusColor(item);
                    result.Add(item);
                }
            }
            return result;
        }

        public string? ChechApplicationStatusColor(ApplicationTask item)
        {
            //TODO add colors to different checks in the future

            var status = item.application_status_color;


            if (item.application_status_code != null && check.Any(x => x != item.application_status_group_code))
            {
                status = "#000000";
            }

            return status;

        }

        private bool IsWorkingDay(WorkSchedule schedule, List<WorkDay> workDays, List<WorkScheduleException> exceptions, DateTime date)
        {
            var isInException = exceptions.Any(e => date >= e.date_start && date <= e.date_end);

            if (isInException)
            {
                var isHoliday = exceptions
                    .FirstOrDefault(e => date >= e.date_start && date <= e.date_end)?
                    .is_holiday;

                if (isHoliday == true)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            var dayOfWeek = (int)date.DayOfWeek;
            return workDays.Any(wd => wd.week_number == dayOfWeek);
        }


        public async Task<DateTime?> CalculateDeadlineService(int service_id, DateTime? register_date = null)
        {
            var currentYear = DateTime.Now.Year;

            var service = await unitOfWork.ServiceRepository.GetOneByID(service_id);
            if (service == null)
            {
                return null; //todo
            }

            var workSchedules = await unitOfWork.WorkScheduleRepository.GetAll();

            var currentYearSchedule = workSchedules.FirstOrDefault(ws => ws.is_active == true && ws.year == currentYear);
            if (currentYearSchedule == null) return null; //todo
            var currentWorkDays = await unitOfWork.WorkDayRepository.GetByschedule_id(currentYearSchedule.id);
            var currentExceptions = await unitOfWork.WorkScheduleExceptionRepository.GetByschedule_id(currentYearSchedule.id);


            var nextYearSchedule = workSchedules.FirstOrDefault(ws => ws.is_active == true && ws.year == (currentYear + 1));
            List<WorkDay>? nextWorkDays = null;
            List<WorkScheduleException>? nextExceptions = null;
            if (nextYearSchedule != null)
            {
                nextWorkDays = await unitOfWork.WorkDayRepository.GetByschedule_id(nextYearSchedule.id);
                nextExceptions = await unitOfWork.WorkScheduleExceptionRepository.GetByschedule_id(nextYearSchedule.id);
            }

            int workingDaysCount = 1;
            DateTime currentDate = register_date != null ? register_date.Value : DateTime.Today;
            DateTime resultDate = register_date != null ? register_date.Value : DateTime.Today;

            while (workingDaysCount <= service.day_count)
            {
                bool isWorkingDay = false;

                if (currentDate.Year == currentYear)
                    isWorkingDay = IsWorkingDay(currentYearSchedule, currentWorkDays, currentExceptions, currentDate);
                else if (nextYearSchedule != null)
                    isWorkingDay = IsWorkingDay(nextYearSchedule, nextWorkDays, nextExceptions, currentDate);

                if (isWorkingDay)
                {
                    workingDaysCount++;
                    resultDate = currentDate;
                }

                currentDate = currentDate.AddDays(1);
            }

            return resultDate;
        }

        public async Task<int> UpdateApplicationTags(int application_id, int structure_id, int structure_tag_id, int object_tag_id, int district_id, double application_square_value, int application_square_unit_type_id, int tech_decision_id, Domain.Entities.File? file)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();

            var application = await unitOfWork.ApplicationRepository.GetOneByID(application_id);

            if (application.object_tag_id != object_tag_id)
            {
                await unitOfWork.ApplicationRepository.UpdateObjectTag(application_id, object_tag_id, user_id);
            }

            if (structure_tag_id != 0) // если 0 то тип услуги нет в отделе
            {
                var str_tag = await unitOfWork.structure_tag_applicationRepository.GetForApplication(structure_id, application_id);
                if (str_tag == null)
                {
                    await unitOfWork.structure_tag_applicationRepository.Add(new structure_tag_application
                    {
                        created_at = DateTime.Now,
                        created_by = user_id,
                        structure_id = structure_id,
                        application_id = application_id,
                        structure_tag_id = structure_tag_id,
                    });
                }
                else
                {
                    if (str_tag.structure_tag_id != structure_tag_id)
                    {
                        str_tag.structure_tag_id = structure_tag_id;
                        str_tag.updated_at = DateTime.Now;
                        str_tag.updated_by = user_id;
                        await unitOfWork.structure_tag_applicationRepository.Update(str_tag);
                    }
                }
            }
            var arch_objects = await unitOfWork.ArchObjectRepository.GetByAppIdApplication(application_id);
            foreach (var arch_object in arch_objects)
            {
                arch_object.district_id = district_id;
                arch_object.updated_by = user_id;
                arch_object.updated_at = DateTime.Now;
                await unitOfWork.ArchObjectRepository.Update(arch_object);
            }

            // площадь объекта
            var squares = await unitOfWork.application_squareRepository.GetByapplication_id(application_id);
            var square = squares?.FirstOrDefault(x => x.structure_id == structure_id);
            if (square == null)
            {
                await unitOfWork.application_squareRepository.Add(new application_square
                {
                    structure_id = structure_id,
                    application_id = application_id,
                    unit_type_id = application_square_unit_type_id,
                    value = application_square_value,
                    created_at = DateTime.Now,
                    created_by = user_id,
                });
            }
            else
            {
                if (square.value != application_square_value || square.unit_type_id != application_square_unit_type_id)
                {
                    square.value = application_square_value;
                    square.unit_type_id = application_square_unit_type_id;
                    square.updated_at = DateTime.Now;
                    square.updated_by = user_id;
                    await unitOfWork.application_squareRepository.Update(square);
                }
            }



            int? id_file = null;
            if (file != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(file);
                id_file = await unitOfWork.FileRepository.Add(document);
                //unitOfWork.Commit();
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var eisId = (await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id))?.FirstOrDefault();
                var techDocType = await unitOfWork.WorkDocumentTypeRepository.GetOneByCode("tech_decision_doc");
                var tasks = await unitOfWork.application_taskRepository.GetByapplication_id(application_id);
                if (tasks != null)
                {
                    var task = tasks.Where(x => x.is_main).FirstOrDefault();
                    var workdoc = await unitOfWork.ApplicationWorkDocumentRepository.Add(new ApplicationWorkDocument
                    {
                        created_at = DateTime.Now,
                        structure_employee_id = eisId != null ? eisId.id : null,
                        structure_id = structure_id,
                        task_id = task.id,
                        id_type = techDocType.id,
                        file_id = id_file,
                    });
                }

            }

            if (tech_decision_id != null && tech_decision_id > 0)
            {
                application.tech_decision_id = tech_decision_id;
                await unitOfWork.ApplicationRepository.UpdateTechDecision(application);
                //unitOfWork.Commit();

            }

            unitOfWork.Commit();

            return application_id;
        }

        public async Task<int> UpdateApplicationTechTags(int application_id, int tech_decision_id, Domain.Entities.File? file)
        {
            var application = await unitOfWork.ApplicationRepository.GetOneByID(application_id);

            int? id_file = null;
            if (file != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(file);
                id_file = await unitOfWork.FileRepository.Add(document);
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var eisId = (await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id))?.FirstOrDefault();
                var techDocType = await unitOfWork.WorkDocumentTypeRepository.GetOneByCode("tech_decision_doc");
                var tasks = await unitOfWork.application_taskRepository.GetByapplication_id(application_id);
                if (tasks != null)
                {
                    var task = tasks.Where(x => x.is_main).FirstOrDefault();
                    var workdoc = await unitOfWork.ApplicationWorkDocumentRepository.Add(new ApplicationWorkDocument
                    {
                        created_at = DateTime.Now,
                        structure_employee_id = eisId != null ? eisId.id : null,
                        task_id = task.id,
                        id_type = techDocType.id,
                        file_id = id_file,
                    });
                }
            }

            if (tech_decision_id != null && tech_decision_id > 0)
            {
                application.tech_decision_id = tech_decision_id;
                application.tech_decision_date = DateTime.Now;
                await unitOfWork.ApplicationRepository.UpdateTechDecision(application);
            }

            unitOfWork.Commit();

            return application_id;
        }

        public async Task<ReestrOtcheData> GetForReestrOtchet(int year, int month, string status, int structure_id)
        {
            var res = await unitOfWork.ApplicationRepository.GetForReestrOtchet(year, month, status, structure_id);

            var data = new ReestrOtcheData
            {
                your_lico = res.Where(x => x.customer_is_organization == true).ToList(),
                fiz_lico = res.Where(x => x.customer_is_organization != true).ToList(),
            };
            return data;

        }

        public async Task<List<Domain.Entities.Application>> GetForReestrRealization(int year, int month, string status, int[]? structure_ids)
        {
            var res = await unitOfWork.ApplicationRepository.GetForReestrRealization(year, month, status, structure_ids);

            return res;
        }


        public async Task<bool> SendNotification(SendCustomerNotification notification)
        {
            var isel = false;
            if (notification.application_id.HasValue)
            {
                var app = await unitOfWork.ApplicationRepository.GetOneByID(notification.application_id.Value);
                isel = app.is_electronic_only ?? false;
            }

            var messages = new List<SendMessageN8n>();
            var smsMsg = notification.smsNumbers?.Select(x => new SendMessageN8n
            {
                message = notification.textSms,
                value = Regex.Replace(x, @"\D", "") + (isel ? "12345" : ""),
                type_con = Constants.ContactType.SMS,
                application_id = notification.application_id,
                customer_id = notification.customer_id,
            }).ToList();
            if (smsMsg != null) messages.AddRange(smsMsg);

            foreach (var tg in notification.telegramNumbers)
            {
                var tgNumber = Regex.Replace(tg, @"\D", "")?.Trim();
                var chats = await unitOfWork.customer_contactRepository.GetTelegramByNumber(tgNumber);
                var tgMsg = chats.Select(x => new SendMessageN8n
                {
                    message = notification.textTelegram,
                    value = x.chat_id,
                    type_con = Constants.ContactType.Telegram,
                    application_id = notification.application_id,
                    customer_id = notification.customer_id,
                }).ToList();
                messages.AddRange(tgMsg);
            }

            foreach (var message in messages)
            {
                var app = await unitOfWork.ApplicationRepository.GetOneByID(message.application_id.Value);
                message.application_uuid = app.app_cabinet_uuid;
                await _rabbitMQPublisher.PublishMessageAsync(message);
            }

            return await sendNotification.SendRawNotification(messages);
        }

        public async Task<Domain.Entities.Application> GetOneByApplicationCode(string code, string contact, long chat_id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByApplicationCode(code);
            if (app == null) return null;
            app.matched_contact = false;

            var customerContact = await unitOfWork.customer_contactRepository.GetByNumber(contact);
            var types = await unitOfWork.contact_typeRepository.GetAll();

            var cc = customerContact?.FirstOrDefault(x => x.customer_id == app.customer_id);
            if (cc != null)
            {
                var tgNumber = Regex.Replace(contact, @"\D", "")?.Trim();
                var tg = await unitOfWork.customer_contactRepository.GetOneTelegram(chat_id.ToString(), tgNumber);
                if (tg == null)
                {
                    await unitOfWork.customer_contactRepository.AddTelegram(new telegram
                    {
                        chat_id = chat_id.ToString(),
                        number = tgNumber
                    });
                    unitOfWork.Commit();
                }

                app.matched_contact = true;
            }
            return app;
        }
        public async Task<bool> CheckCalucationForApplication(int application_id)
        {
            var tasks = await unitOfWork.application_taskRepository.GetByapplication_id(application_id);
            var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(application_id);
            var pay_structures = payments.Select(x => x.structure_id).ToList();

            var allStrs = await unitOfWork.OrgStructureRepository.GetAll();

            var ok = true;
            foreach (var t in tasks)
            {
                var ts = allStrs.Where(x => x.parent_id == t.structure_id || x.id == t.structure_id).Select(x => x.id).ToList();
                bool hasCommon = ts.Any(x => pay_structures.Contains(x));
                if (!hasCommon) ok = false;
                //t.structure_id;
            }

            return ok;

            return tasks.All(x => pay_structures.Contains(x.structure_id)); ;
        }

        public async Task SendOutcomingDocs(int application_id)
        {
            await _fileUseCases?.SendFiles(application_id);
        }

        public async Task<int> SaveDataFromClient(Domain.Entities.Application application)
        {
            try
            {
                var status = await unitOfWork.ApplicationStatusRepository.GetByCode("from_cabinet"); //TODO
                // TODO set status for cabinet application 
                var appId = await Create(application, status.id, true, true);
                await unitOfWork.ApplicationRepository.SetHtmlFromCabinet(appId.Value.id, application.dogovorTemplate);
                unitOfWork.Commit();

                return appId.Value.id;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error create application {e}");
                throw;
            }

        }

        public async Task<int> SaveResendDataFromClient(Domain.Entities.Application application)
        {
            try
            {
                var status = await unitOfWork.ApplicationStatusRepository.GetByCode("from_cabinet"); //TODO
                application.status_id = status.id;

                var appId = await Update(application);
                //await unitOfWork.ApplicationRepository.SetHtmlFromCabinet(appId.Value.id, application.dogovorTemplate);
                unitOfWork.Commit();

                return appId.Value.id;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error create application {e}");
                throw;
            }

        }

        public async Task<Result> Approve(string uuid, string number)
        {
            try
            {
                await _bgaService.SendApproveRequestAsync(uuid, number);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return Result.Ok();
        }

        public async Task<Result> Reject(string uuid, string html, string number, int[] serviceDocIds)
        {
            try
            {
                //var rejectedDocument = new List<UpdatedDocument>();
                //foreach (var documentId in documentIds)
                //{
                //    await unitOfWork.uploaded_application_documentRepository.SetDocumentStatus(documentId, "rejected");
                //    var item = await unitOfWork.uploaded_application_documentRepository.GetUpdatedDocumentById(documentId);
                //    rejectedDocument.Add(item);
                //}
                //var fileName = await _fileUseCases?.CreateRejectFile(html);
                var file = await _fileUseCases?.HtmlToFile(html);
                file.name = "Замечания.pdf";
                var app = await unitOfWork.ApplicationRepository.GetOneByGuid(uuid);

                var serviceDocuments = await unitOfWork.ServiceDocumentRepository.GetByidService(app.service_id);
                var appDocument = await unitOfWork.ApplicationDocumentRepository.GetOneByNameAndType("Замечания", "zamechanie");

                var serviceDocumentRejectId = serviceDocuments.FirstOrDefault(d => d.application_document_id == appDocument.id)?.id;
                if (serviceDocumentRejectId == null)
                {
                    serviceDocumentRejectId = await unitOfWork.ServiceDocumentRepository.Add(new ServiceDocument
                    {
                        service_id = app.service_id,
                        application_document_id = appDocument.id
                    });
                }

                var uploadedApplicationDocumentReject = new uploaded_application_document
                {
                    add_sign = true,
                    application_document_id = app.id,
                    name = "Замечания",
                    service_document_id = serviceDocumentRejectId.Value,
                    document = file
                };
                var upl = await _uploadedApplicationDocumentUseCase.Create(uploadedApplicationDocumentReject);

                unitOfWork.Commit();

                await _bgaService.SendRejectRequestAsync(uuid, html, number, upl.Value.file_id ?? 0, file.path, serviceDocIds);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return Result.Ok();
        }

        public async Task<List<MyApplication>> GetMyApplication()
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var result = await unitOfWork.ApplicationRepository.GetMyApplication(user_id);
            return result;
        }

        public async Task<int?> AddToFavorite(int application_id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            if (app == null)
            {
                return null;
            }
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(user_id);
            var result = await unitOfWork.ApplicationRepository.AddToFavorite(application_id, employee.id);
            unitOfWork.Commit();
            return result;
        }
        
        public async Task<int?> DeleteToFavorite(int application_id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            if (app == null)
            {
                return null;
            }
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(user_id);
            var result = await unitOfWork.ApplicationRepository.DeleteToFavorite(application_id, employee.id);
            unitOfWork.Commit();
            return result;
        }
        
        public async Task<bool> GetStatusFavorite(int application_id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            if (app == null)
            {
                return false;
            }
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(user_id);
            var result = await unitOfWork.ApplicationRepository.GetStatusFavorite(application_id, employee.id);
            return result;
        }
    }
}