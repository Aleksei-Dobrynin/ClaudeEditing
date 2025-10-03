using Application.Models;
using Application.Repositories;
using Application.Services;
using DocumentFormat.OpenXml.Wordprocessing;
using Domain;
using Domain.Entities;
using FluentResults;
using HTMLQuestPDF.Extensions;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using static Application.Services.SendNotificationService;
using Document = QuestPDF.Fluent.Document;
using File = Domain.Entities.File;

namespace Application.UseCases
{
    public class ApplicationWorkDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IWatermarkService _watermarkService;
        private readonly ISendNotification sendNotification;
        private readonly FileUseCases _fileUseCases;
        private readonly string _apiCabinetUrl;

        public ApplicationWorkDocumentUseCases(
            IUnitOfWork unitOfWork,
            IEmployeeRepository employeeRepository,
            IWatermarkService watermarkService,
            IConfiguration configuration,
            ISendNotification sendNotification,
            FileUseCases fileUseCases)
        {
            this.unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
            _watermarkService = watermarkService;
            _apiCabinetUrl = configuration.GetValue<string>("ExternalApi:CabinetUrl") ?? "http://localhost:3001";
            this.sendNotification = sendNotification;
            _fileUseCases = fileUseCases;
        }

        public Task<List<ApplicationWorkDocument>> GetAll()
        {
            return unitOfWork.ApplicationWorkDocumentRepository.GetAll();
        }
        
        public Task<List<uploaded_application_document>> GetByStepID(int app_step_id)
        {
            return unitOfWork.ApplicationWorkDocumentRepository.GetByStepID(app_step_id);
        }

        public Task<ApplicationWorkDocument> GetOneByID(int id)
        {
            return unitOfWork.ApplicationWorkDocumentRepository.GetOneByID(id);
        }

        public async Task<ApplicationWorkDocument> DeactivateDocument(int id, string reason)
        {
            var domain = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByID(id);
            domain.reason_deactivated = reason;
            domain.deactivated_by = await unitOfWork.UserRepository.GetUserID();
            domain.deactivated_at = DateTime.Now;
            domain.is_active = false;
            await unitOfWork.ApplicationWorkDocumentRepository.DeactivateDocument(domain);

            unitOfWork.Commit();

            return domain;
        }
        public Task<List<ApplicationWorkDocument>> GetByIDTask(int idTask)
        {
            return unitOfWork.ApplicationWorkDocumentRepository.GetByIDTask(idTask);
        }

        public Task<List<ApplicationWorkDocument>> GetByIDApplication(int idApplication)
        {
            return unitOfWork.ApplicationWorkDocumentRepository.GetByIDApplication(idApplication);
        }
        
        public Task<List<ApplicationWorkDocument>> GetByGuid(string guid)
        {
            return unitOfWork.ApplicationWorkDocumentRepository.GetByGuid(guid);
        }
        public async Task<ApplicationWorkDocument> GetOneByGuid(string guid)
        {
            var res = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByPath(guid);
            if(res != null)
            {
                res.signs = await unitOfWork.FileRepository.GetSignByFileIds(new int[] {res.file_id ?? 0});
            }

            return res;
        }

        public async Task<ApplicationWorkDocument> GetOneEncryptedByGuid(string guid)
        {

            //TODO Decrypt file body if needed
            var decrypted = _watermarkService.DecryptSecureLink(guid);
            var res = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByPath(decrypted.Guid);
            if (res != null)
            {
                res.signs = await unitOfWork.FileRepository.GetSignByFileIds(new int[] { res.file_id ?? 0 });
            }

            return res;
        }

        public async Task<bool> SendDocumentsToEmail(SendDocumentsToEmailRequest request)
        {
            var application = await unitOfWork.ApplicationRepository.GetOneByID(request.application);
            if (application == null)
            {
                return false;
            }

            var filesToArchive = new List<Domain.Entities.File>();

            // Добавляем рабочие документы
            if (request.workDocumenstIds != null && request.workDocumenstIds.Count > 0)
            {
                foreach (var workDocumentId in request.workDocumenstIds)
                {
                    var document = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByID(workDocumentId);
                    if (document?.file_id != null)
                    {
                        var file = await unitOfWork.FileRepository.GetOne(document.file_id.Value);
                        if (file != null)
                        {
                            // Загружаем содержимое файла
                            if (file.body == null || file.body.Length == 0)
                            {
                                file.body = await unitOfWork.FileRepository.GetByPath(file.path);
                            }
                            filesToArchive.Add(file);
                        }
                    }
                }
            }

            // Добавляем загруженные документы
            if (request.upoloadedDocumentsIds != null && request.upoloadedDocumentsIds.Count > 0)
            {
                foreach (var documentId in request.upoloadedDocumentsIds)
                {
                    var document = await unitOfWork.uploaded_application_documentRepository.GetOne(documentId);
                    if (document?.file_id != null)
                    {
                        var file = await unitOfWork.FileRepository.GetOne(document.file_id.Value);
                        if (file != null)
                        {
                            // Загружаем содержимое файла
                            if (file.body == null || file.body.Length == 0)
                            {
                                file.body = await unitOfWork.FileRepository.GetByPath(file.path);
                            }
                            filesToArchive.Add(file);
                        }
                    }
                }
            }

            if (!filesToArchive.Any())
            {
                return false; // Нет файлов для отправки
            }

            // Создаем архив используя FileUseCases
            var archiveFile = await _fileUseCases.CreateArchive(filesToArchive);

            // Генерируем зашифрованную ссылку для архива
            var encryptedLink = _watermarkService.GenerateSecureLink(application.customer_pin, archiveFile.path, true);
            var downloadLink = $"{_apiCabinetUrl}/secure-document-download?guid={encryptedLink}";

            // Формируем сообщение
            string message = $"БГА сообщает, что ваши документы по заявке #{application.number} готовы и могут быть скачаны архивом по ссылке: {downloadLink}\n" +
                             $"Данная ссылка активна 24 часа, до {DateTime.Now.AddDays(1):dd.MM.yyyy HH:mm}";

            // Получаем контакты клиента
            var contacts = await unitOfWork.customer_contactRepository.GetBycustomer_id(application.customer_id);
            var emails = contacts.Where(x => x.type_code == "email").ToList();

            if (!emails.Any())
            {
                return false; // Нет email для отправки
            }

            // Отправляем уведомление
            var notification = new SendMessageN8n
            {
                message = message,
                value = emails[0]?.value,
                type_con = "email",
                application_id = application.id,
                customer_id = application.customer_id,
                subject = $"Документы заявки #{application.number} готовы к скачиванию (архив)",
            };

            var notifications = new List<SendMessageN8n> { notification };
            var result = await sendNotification.SendRawNotification(notifications);

            return result;
        }
        public async Task<bool> ApplicationPaymentCheck(int idApplication)
        {
            var result = true;
            var applicationPayments = await unitOfWork.application_paymentRepository.GetByapplication_id(idApplication);

            if (applicationPayments != null && applicationPayments.Count > 0)
            {
                foreach (var applicationPayment in applicationPayments)
                {
                    if(applicationPayment.file_id == null)
                    {
                        result = false;
                        break;
                    };
                }
            }

            return result;
        }

        public async Task<Result<ApplicationWorkDocument>> AddDocument(ApplicationWorkDocument domain)
        {
            var employee_in_structure = await _employeeRepository.GetEmployeeInStructure();

            domain.structure_employee_id = employee_in_structure?.id;

            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);

                if (document.name?.EndsWith(".pdf") == true && false)
                {
                    var mark = new List<string> { "Дата создания: " + DateTime.Now.ToString("dd.MM.yyyy"), "QR-код для проверки ЭЦП", document.path };


                    var task = await unitOfWork.application_taskRepository.GetOne(domain.task_id.Value);
                    var application = await unitOfWork.ApplicationRepository.GetOneByID(task.application_id);

                    var encryptedLink = _watermarkService.GenerateSecureLink(application.customer_pin, document.path);
                    var res = await _watermarkService.AddSignatureStampDirectlyToPdfAsync(document.body, mark, encryptedLink, 0);
                    document.body = res.Value;
                    document = unitOfWork.FileRepository.UpdateDocumentFilePath(document);
                }

                var idFile = await unitOfWork.FileRepository.Add(document);
                domain.file_id = idFile;
            }
            else
            {
                return Result.Fail(new LogicError("Документ не должен быть пустым!"));
            }
            
            var result = await unitOfWork.ApplicationWorkDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationWorkDocument> AddDocumentFromTemplate(ApplicationWorkDocument domain)
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
                            handler.SetHtml(domain.document_body);
                        });
                    });
                });
            });

            var file = new File
            {
                id = 0,
                name = $"{domain.document_name}.pdf",
            };
            
            using (var stream = new MemoryStream())
            {
                pdfDocument.GeneratePdf(stream);
                file.body = stream.ToArray();
            }
            
            var employee_in_structure = await _employeeRepository.GetEmployeeInStructure();
            
            domain.structure_employee_id = employee_in_structure?.id;
            var document = unitOfWork.FileRepository.AddDocument(file);
            var idFile = await unitOfWork.FileRepository.Add(document);
            domain.file_id = idFile;
            
            var result = await unitOfWork.ApplicationWorkDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationWorkDocument> Update(ApplicationWorkDocument domain)
        {
            await unitOfWork.ApplicationWorkDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Result<ApplicationWorkDocument>> SetFileToDocument(int id, File file, string comment)
        {
            var file_id = 0;
            if (file != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(file);
                var idFile = await unitOfWork.FileRepository.Add(document);
                file_id = idFile;
            }
            else
            {
                return Result.Fail(new LogicError("Документ не должен быть пустым!"));
            }

            var domain = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByID(id);
            domain.file_id = file_id;
            await unitOfWork.FileRepository.AddHistoryLog(new FileHistoryLog
            {
                entity_name = "ApplicationWorkDocument",
                entity_id = id,
                action = "ADD_FILE",
                file_id = file_id,
            });
            await unitOfWork.ApplicationWorkDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationWorkDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationWorkDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationWorkDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
