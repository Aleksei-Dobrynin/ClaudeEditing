using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain;
using Domain.Entities;
using FluentResults;
using HTMLQuestPDF.Extensions;
using Infrastructure.Services;
using Microsoft.Extensions.Logging.Abstractions;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace Application.UseCases
{
    public class uploaded_application_documentUseCases : Iuploaded_application_documentUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IN8nService _n8nService;
        private readonly IWatermarkService _watermarkService;
        private readonly IAuthRepository _authRepository;

        public uploaded_application_documentUseCases(IUnitOfWork unitOfWork, IWatermarkService watermarkService, IN8nService n8nService, IAuthRepository authRepository)
        {
            this.unitOfWork = unitOfWork;
            _n8nService = n8nService;
            _watermarkService = watermarkService;
            this._authRepository = authRepository;
        }

        public Task<List<uploaded_application_document>> GetAll()
        {
            return unitOfWork.uploaded_application_documentRepository.GetAll();
        }
        public Task<uploaded_application_document> GetOne(int id)
        {
            return unitOfWork.uploaded_application_documentRepository.GetOne(id);
        }

        public async Task<Result<uploaded_application_document>> UploadDogovorTemplate(string html, int applicationId, string typeDoc)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            var pdfDocument = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);

                    page.Content().Column(col =>
                    {
                        col.Item().HTML(handler =>
                        {
                            handler.SetHtml(html);
                        });
                    });
                });
            });


            var doc = await unitOfWork.ApplicationDocumentRepository.GetOneByType(typeDoc);

            var file = new Domain.Entities.File
            {
                id = 0,
                name = $"{typeDoc}.pdf",
            };

            using (var stream = new MemoryStream())
            {
                pdfDocument.GeneratePdf(stream);
                file.body = stream.ToArray();
            }


            var app = await unitOfWork.ApplicationRepository.GetOneByID(applicationId);
            var sds = await unitOfWork.ServiceDocumentRepository.GetByidService(app.service_id);
            var sd = sds.FirstOrDefault(x => x.application_document_id == doc.id);

            var upl = new uploaded_application_document
            {
                document = file,
                application_document_id = applicationId,
                service_document_id = sd?.id,
            };
            await Create(upl);

            return upl;
            //var document = unitOfWork.FileRepository.AddDocument(file);
            //var idFile = await unitOfWork.FileRepository.Add(document);

            //unitOfWork.uploaded_application_documentRepository.Add(new uploaded_application_document
            //{

            //});

            //unitOfWork.Commit();
        }

        public async Task<List<UploadedApplicationDocumentToCabinet>> GetUploadsByGuidCabinet(string guid)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByGuid(guid);
            if (app == null) return new List<UploadedApplicationDocumentToCabinet>();

            var res = await unitOfWork.UploadedApplicationDocumentRepository.GetUpoadsToCabinetById(app.id);

            return res;
        }
        public async Task<Result<uploaded_application_document>> Create(uploaded_application_document domain)
        {
            var status_valid = await unitOfWork.document_statusRepository.GetOneByCode("not_valid");
            domain.status_id = status_valid?.id;

            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);

                var serviceDoc = await unitOfWork.ServiceDocumentRepository.GetOneByID(domain.service_document_id ?? 0);
                var appDoc = await unitOfWork.ApplicationDocumentRepository.GetOneByID(serviceDoc?.application_document_id ?? 0);

                if (appDoc.doc_is_outcome == true || domain.add_sign == true)
                {
                    if (document.name?.EndsWith(".pdf") == true)
                    {
                        var mark = new List<string> { "Дата создания: " + DateTime.Now.ToString("dd.MM.yyyy"), "QR-код для проверки ЭЦП", document.path };

                        var secured = _watermarkService.GenerateSecureLink("", document.path);
                        var res = await _watermarkService.AddSignatureStampDirectlyToPdfAsync(document.body, mark, secured, serviceDoc?.application_document_id ?? 0);
                        document.body = res.Value;
                        document = unitOfWork.FileRepository.UpdateDocumentFilePath(document);
                    }
                }
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
            }
            else
            {
                return Result.Fail(new LogicError("Документ не может быть пустым!"));
            }

            var result = await unitOfWork.uploaded_application_documentRepository.Add(domain);
            domain.id = result;

            if(domain.app_step_id != null && domain.app_step_id != 0)
            {
                var serviceDoc = await unitOfWork.ServiceDocumentRepository.GetOneByID(domain.service_document_id ?? 0);
                var stepIds = (await unitOfWork.application_stepRepository.GetByapplication_id(domain.application_document_id.Value)).Select(x => x.id).ToArray();
                var apprvals = await unitOfWork.document_approvalRepository.GetByAppStepIds(stepIds);
                foreach (var item in apprvals)
                {
                    if(item.document_type_id == serviceDoc.application_document_id)
                    {
                        item.app_document_id = result;
                        item.file_sign_id = null;
                        item.status = "waiting";
                        item.approval_date = null;
                        await unitOfWork.document_approvalRepository.Update(item);
                    }
                }
            }

            unitOfWork.Commit();

            var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_document_id.Value);

            await _n8nService.NotifyNewDocumentUpload(application.id);
            
            return domain;
        }

        public async Task<Result<uploaded_application_document>> CreateWithoutUser(uploaded_application_document domain)
        {
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
            }
            else
            {
                return Result.Fail(new LogicError("Документ не может быть пустым!"));
            }

            var result = await unitOfWork.uploaded_application_documentRepository.CreateWithoutUser(domain);
            domain.id = result;
            unitOfWork.Commit();

            var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_document_id.Value);

            await _n8nService.NotifyNewDocumentUpload(application.id);

            return domain;
        }

        
        public async Task<uploaded_application_document> Add(uploaded_application_document domain)
        {
            if (string.IsNullOrWhiteSpace(domain.name) && (domain.app_docs == null || domain.app_docs.Count == 0))
            {
                throw new ArgumentException("���� 'name' �����������, ���� �� ������� app_docs.");
            }

            if (domain.app_docs != null && domain.app_docs.Count > 0)
            {
                foreach (var docName in domain.app_docs)
                {
                    var newDoc = new uploaded_application_document
                    {
                        id = domain.id,
                        application_document_id = domain.application_document_id,
                        name = docName,
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        created_by = domain.created_by,
                        updated_by = domain.updated_by,

                    };

                    await unitOfWork.uploaded_application_documentRepository.Add(newDoc);
                }
            }
            if (string.IsNullOrWhiteSpace(domain.name) == false || (domain.app_docs == null || domain.app_docs.Count == 0))
            {
                var result = await unitOfWork.uploaded_application_documentRepository.Add(domain);
                domain.id = result;
            }
        
            unitOfWork.Commit();
            return domain;
        }
        public async Task<uploaded_application_document> CopyUploadedDocument(CopyUploadedDocumentDto domain)
        {
            int? service_document_id = domain.service_document_id == 0 ? null : domain.service_document_id;
            var newDoc = new uploaded_application_document
            {
                application_document_id = domain.application_id,
                service_document_id = service_document_id,
                file_id = domain.file_id,
                created_at = DateTime.Now,
                updated_at = DateTime.Now,
            };

            if (domain.upl_id == null)
            {
                await unitOfWork.uploaded_application_documentRepository.Add(newDoc);
            }
            else
            {
                newDoc = await unitOfWork.uploaded_application_documentRepository.GetOne(domain.upl_id ?? 0);
                newDoc.file_id = domain.file_id;

                await unitOfWork.uploaded_application_documentRepository.Update(newDoc);
            }


            unitOfWork.Commit();
            return newDoc;
        }
        public async Task<uploaded_application_document> AccepDocumentWithoutFile(uploaded_application_document domain)
        {
            var result = await unitOfWork.uploaded_application_documentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }
        public async Task<int> RejectDocument(int id)
        {
            var result = await unitOfWork.uploaded_application_documentRepository.RejectDocument(id);
            unitOfWork.Commit();
            return id;
        }
        

        public async Task<uploaded_application_document> Update(uploaded_application_document domain)
        {
            var old = await GetOne(domain.id);
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);

                var serviceDoc = await  unitOfWork.ServiceDocumentRepository.GetOneByID(domain.service_document_id ?? 0);
                var appDoc = await unitOfWork.ApplicationDocumentRepository.GetOneByID(serviceDoc?.application_document_id ?? 0);

                if (appDoc.doc_is_outcome == true)
                {
                    if (document.name?.EndsWith(".pdf") == true)
                    {
                        var mark = new List<string> { "Дата создания: " + DateTime.Now.ToString("dd.MM.yyyy"), "QR-код для проверки ЭЦП", document.path };
                        var secured = _watermarkService.GenerateSecureLink("", document.path);
                        var res = await _watermarkService.AddSignatureStampDirectlyToPdfAsync(document.body, mark, secured, serviceDoc?.application_document_id ?? 0);
                        document.body = res.Value;
                        document = unitOfWork.FileRepository.UpdateDocumentFilePath(document);
                    }
                }

                var id_file = await unitOfWork.FileRepository.Add(document);
                old.file_id = id_file;
            }
            old.document_number = domain.document_number;
            await unitOfWork.uploaded_application_documentRepository.Update(old);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<uploaded_application_document>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.uploaded_application_documentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.uploaded_application_documentRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<uploaded_application_document>> GetByfile_id(int file_id)
        {
            return unitOfWork.uploaded_application_documentRepository.GetByfile_id(file_id);
        }

        public Task<List<uploaded_application_document>> GetByapplication_document_id(int application_document_id)
        {
            return unitOfWork.uploaded_application_documentRepository.GetByapplication_document_id(application_document_id);
        }
        
        public Task<List<uploaded_application_document>> ByApplicationIdAndStepId(int application_document_id, int app_step_id)
        {
            return unitOfWork.uploaded_application_documentRepository.ByApplicationIdAndStepId(application_document_id, app_step_id);
        }

        public Task<List<uploaded_application_document>> GetByservice_document_id(int service_document_id)
        {
            return unitOfWork.uploaded_application_documentRepository.GetByservice_document_id(service_document_id);
        }
        public async Task<List<CustomUploadedDocument>> GetCustomByApplicationId(int application_document_id)
        {
            var res = await unitOfWork.uploaded_application_documentRepository.GetCustomByApplicationId(application_document_id);

            var file_ids = res.Where(x => x.is_outcome == true && x.file_id != null).Select(x => x.file_id ?? 0).ToArray();
            var upl_ids = res.Where(x => x.is_outcome == true && x.file_id != null).Select(x => x.id).ToArray();

            var signs = await unitOfWork.FileRepository.GetSignByFileIds(file_ids);
            var approvals = await unitOfWork.document_approvalRepository.GetByUplIds(upl_ids);

            for (var i=0; i<signs.Count; i++)
            {
                var sign = signs[i];
                var data = await unitOfWork.EmployeeInStructureRepository.GetByEmployeeStructureId(sign.structure_employee_id ?? 0, sign.employee_id);
                signs[i].post_ids = data.Select(x => x.post_id).ToArray();
            }

            var approvers = await unitOfWork.document_approverRepository.GetAll(); //todo

            var structs = await unitOfWork.OrgStructureRepository.GetAll();
            var posts = await unitOfWork.StructurePostRepository.GetAll();
            var stepDocs = await unitOfWork.step_required_documentRepository.GetAll();

            foreach (var item in res)
            {
                item.signs = signs?.Where(x => x.file_id == item.file_id).ToList();
                //item.users = new List<WhoMustSignDoc> { new WhoMustSignDoc { id = 1, employee_id = 2044, structure_name = "Отдел ДТР", post_name = "Начальник", post_id = 1, structure_id = 1 } };

                var docs = stepDocs.Where(x => x.document_type_id == item.app_doc_id).Select(x=>x.id).ToList() ;

                var apprvals = approvals.Where(x => x.app_document_id == item.id).ToList();

                var users = approvers.Where(x=> docs.Contains(x.step_doc_id ?? 0)).Select(x => new WhoMustSignDoc
                {
                    structure_id = x.department_id ?? 0,
                    post_id = x.position_id ?? 0,
                    structure_name = structs.FirstOrDefault(z => z.id == x.department_id)?.name,
                    post_name = posts.FirstOrDefault(z => z.id == x.position_id)?.name,
                    apprval = apprvals.Find(y => y.position_id == x.position_id && y.department_id == x.department_id)
                }).ToList();


                item.users = users;
            }

            return res;
        }


        public async Task<List<application_step>> GetStepsWithInfo(int app_id)
        {

            var app = await unitOfWork.ApplicationRepository.GetOneByID(app_id);
            var service_docs = await unitOfWork.ServiceDocumentRepository.GetByidService(app.service_id);

            var res = await unitOfWork.application_stepRepository.GetByapplication_id(app_id);
            var path_ids = res.Select(x => x.step_id ?? 0).ToArray();

            for (var i = 0; i < res.Count; i++)
            {
                var preqs = await unitOfWork.step_dependencyRepository.GetByprerequisite_step_id(res[i].step_id ?? 0);
                var blocks = await unitOfWork.step_dependencyRepository.GetBydependent_step_id(res[i].step_id ?? 0);
                res[i].dependencies = preqs.Select(x => x.dependent_step_id ?? 0).ToArray();
                res[i].blocks = blocks.Select(x => x.prerequisite_step_id ?? 0).ToArray();
            }

            var roles = await _authRepository.GetMyRoleIds();
            var user_id = await unitOfWork.UserRepository.GetUserID();

            var orgs = await unitOfWork.EmployeeInStructureRepository.GetInMyStructure(user_id);
            var role_id = roles?.FirstOrDefault() ?? 0;
            var org_id = orgs?.FirstOrDefault()?.structure_id ?? 0;

            var step_docs = await unitOfWork.step_required_documentRepository.GetByPathIds(path_ids);
            var step_docs_ids = step_docs.Select(x => x.id).ToArray();

            var apprvers = await unitOfWork.document_approverRepository.GetBystep_doc_ids(step_docs_ids);

            var upls = await unitOfWork.uploaded_application_documentRepository.GetByapplication_document_id(app_id);
            var upl_ids = upls.Where(x => x.file_id != null).Select(x => x.id).ToArray();
            var file_ids = upls.Where(x => x.file_id != null).Select(x => x.file_id ?? 0).ToArray();

            var signs = await unitOfWork.FileRepository.GetSignByFileIds(file_ids);

            var approvals = await unitOfWork.document_approvalRepository.GetByUplIds(upl_ids);

            foreach (var step in res)
            {
                step.docs = step_docs
                    .Where(x => x.step_id == step.path_id)
                    .Select(x => new step_required_document
                    {
                        id = x.id,
                        step_id = x.step_id,
                        document_type_id = x.document_type_id,
                        doc_name = x.doc_name,
                        is_required = x.is_required,
                        approvers = new List<document_approver>()
                    })
                    .ToList();


                foreach (var doc in step.docs)
                {
                    doc.upl_doc = upls.FirstOrDefault(x => x.app_step_id == step.id && x.file_id != null && x.document_type_id == doc.document_type_id);
                    doc.approvers = apprvers.Where(x => x.step_doc_id == doc.id).Select(x => new document_approver
                    {
                        id = x.id,
                        step_doc_id = x.step_doc_id,
                        position_id = x.position_id,
                        department_id = x.department_id,
                        department_name = x.department_name,
                        position_name = x.position_name,
                        is_required = x.is_required,
                        approval_order = x.approval_order,
                    }).ToList();

                    doc.service_doc_id = service_docs.Find(x => x.application_document_id == doc.document_type_id)?.id;

                    if (doc.upl_doc != null)
                    {
                        foreach (var apprver in doc.approvers)
                        {
                            apprver.apprval = approvals?.FirstOrDefault(x => x.app_document_id == doc.upl_doc.id && x.position_id == apprver.position_id && x.department_id == apprver.department_id);
                            if (apprver.apprval != null)
                            {
                                apprver.apprval.signInfo = signs.FirstOrDefault(x => x.file_id == doc.upl_doc?.file_id);
                            }
                        }
                        var appver = doc.approvers.FirstOrDefault(x => x.position_id == role_id && x.department_id == org_id);
                        if (appver != null)
                        {
                            if (appver.apprval != null && appver.apprval.signInfo != null)
                            {
                                doc.can_assign = false;
                                doc.assign_status = "already_signed";
                            }
                            else
                            {
                                doc.can_assign = true;
                                doc.assign_status = "has_access";
                            }
                        }
                        else
                        {
                            doc.can_assign = false;
                            doc.assign_status = "no_access";
                        }
                    }
                    else
                    {
                        doc.can_assign = false;
                        doc.assign_status = "not_uploaded";
                    }

                }

            }

            return res;
        }
        public async Task<List<application_step>> GetStepDocuments(int app_id)
        {

            var app = await unitOfWork.ApplicationRepository.GetOneByID(app_id);
            var service_docs = await unitOfWork.ServiceDocumentRepository.GetByidService(app.service_id);

            var res = await unitOfWork.application_stepRepository.GetByapplication_id(app_id);
            var applicationRequiredCalcs = await unitOfWork.ApplicationRequiredCalcRepository.GetByApplicationId(app_id);
            var path_ids = res.Select(x => x.step_id ?? 0).ToArray();
            var appStepIds = res.Select(x => x.id).ToArray();
            var app_step_ids = res.Select(x => x.id).ToArray();

            for (var i = 0; i < res.Count; i++)
            {
                var preqs = await unitOfWork.step_dependencyRepository.GetByprerequisite_step_id(res[i].step_id ?? 0);
                var blocks = await unitOfWork.step_dependencyRepository.GetBydependent_step_id(res[i].step_id ?? 0);
                res[i].dependencies = preqs.Select(x => x.dependent_step_id ?? 0).ToArray();
                res[i].blocks = blocks.Select(x => x.prerequisite_step_id ?? 0).ToArray();
            }

            var roles = await _authRepository.GetMyRoleIds();
            var user_id = await unitOfWork.UserRepository.GetUserID();

            var orgs = await unitOfWork.EmployeeInStructureRepository.GetInMyStructure(user_id);
            var role_id = roles?.FirstOrDefault() ?? 0;
            var org_id = orgs?.FirstOrDefault()?.structure_id ?? 0;

            var step_docs = await unitOfWork.step_required_documentRepository.GetByPathIds(path_ids);
            var step_docs_ids = step_docs.Select(x => x.id).ToArray();

            var apprvers = await unitOfWork.document_approverRepository.GetBystep_doc_ids(step_docs_ids);

            var upls = await unitOfWork.uploaded_application_documentRepository.GetByapplication_document_id(app_id);
            var upl_ids = upls.Where(x => x.file_id != null).Select(x => x.id).ToArray();
            var file_ids = upls.Where(x => x.file_id != null).Select(x => x.file_id ?? 0).ToArray();

            var signs = await unitOfWork.FileRepository.GetSignByFileIds(file_ids);

            var approvals = await unitOfWork.document_approvalRepository.GetByAppStepIds(appStepIds);
            var work_docs = await unitOfWork.ApplicationWorkDocumentRepository.GetByAppStepIds(app_step_ids);


            foreach (var step in res)
            {
                step.workDocuments = work_docs.Where(x => x.app_step_id == step.id).ToList();
                step.requiredCalcs = applicationRequiredCalcs.Where(x => x.application_step_id == step.id).ToList();;
                var docs = approvals.Where(x => x.app_step_id == step.id).GroupBy(x => x.document_type_id).Select(x => new StepDocument
                {
                    id = x.FirstOrDefault()?.id ?? 0,
                    upl_id = x.FirstOrDefault()?.app_document_id ?? 0,
                    document_type_id = x.Key,
                    is_required = x.FirstOrDefault()?.is_required_doc
                    //approvals = approvals.Where(y => y.document_type_id == x.FirstOrDefault()?.document_type_id).ToList(),
                }).OrderBy(x => x.id).ToList();

                foreach (var doc in docs)
                {
                    doc.service_document_id = service_docs.Find(x => x.application_document_id == doc.document_type_id)?.id;
                    doc.approvals = approvals.Where(x => x.document_type_id == doc.document_type_id && (x.app_step_id == step.id || x.status == "signed")).ToList();
                    doc.upl = upls?.FirstOrDefault(x => x.id == doc.upl_id);
                    doc.document_type_name = service_docs.FirstOrDefault(x => x.application_document_id == doc.document_type_id)?.application_document_name;


                    foreach (var appr in doc.approvals)
                    {
                        appr.signInfo = signs.FirstOrDefault(x => x.id == appr.file_sign_id && x.is_called_out != true );
                        appr.is_required = appr.is_required_approver;
                    }

                    if(doc.upl != null)
                    {
                        var userId = await unitOfWork.UserRepository.GetUserID();
                        var signed = doc.approvals.FirstOrDefault(x => x.department_id == org_id && x.position_id == role_id && x.updated_by == userId);
                        if (signed != null)
                        {
                            doc.can_assign = false;
                            doc.assign_status = "already_signed";
                        }
                        var hasApprval = doc.approvals.FirstOrDefault(x => x.department_id == org_id && x.position_id == role_id && x.status == "waiting");
                        if(hasApprval != null && signed == null)
                        {
                            if(hasApprval.signInfo != null)
                            {
                                doc.can_assign = false;
                                doc.assign_status = "already_signed";
                            }
                            else
                            {
                                doc.can_assign = true;
                                doc.assign_status = "has_access";
                            }
                        }
                        else
                        {
                            doc.can_assign = false;
                            doc.assign_status = "no_access";
                        }
                    }
                    else
                    {
                        doc.can_assign = false;
                        doc.assign_status = "not_uploaded";
                    }
                }
                step.documents = docs;
            }

            return res;
        }



    }
}
