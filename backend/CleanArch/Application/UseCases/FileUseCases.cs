using Application.Repositories;
using DocumentFormat.OpenXml.InkML;
using Domain.Entities;
using HTMLQuestPDF.Extensions;
using Messaging.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Org.BouncyCastle.Cms;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using System.IO.Compression;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using File = Domain.Entities.File;

namespace Application.UseCases
{
    public class FileUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private IUserRepository? _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IBgaService _bgaService;
        private readonly IAuthRepository _authRepository;
        private readonly IServiceProvider _provider;

        public FileUseCases(IUnitOfWork unitOfWork, IUserRepository? userRepository, IConfiguration configuration, IBgaService bgaService, IAuthRepository authRepository, IServiceProvider provider)
        {
            this.unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _configuration = configuration;
            _bgaService = bgaService;
            this._authRepository = authRepository;
            _provider = provider;
        }

        public Task<List<Domain.Entities.File>> GetAll()
        {
            return unitOfWork.FileRepository.GetAll();
        }

        public Task<List<Domain.Entities.FileSign>> GetSignByFileIds(int[] ids)
        {
            return unitOfWork.FileRepository.GetSignByFileIds(ids);
        }

        public async Task<bool> SendCode(string pin)
        {
            return true;
            try
            {
                var userGuid = await _userRepository.GetUserUID();
                var employee = await unitOfWork.EmployeeRepository.GetByUserId(userGuid);
                var obj = new SendPin
                {
                    personIdnp = pin,
                    method = "email",
                    organizationInn = "00709199210188",
                };
                if (!string.IsNullOrWhiteSpace(employee.remote_id))
                {
                    obj.organizationInn = null;
                }

                using var client = new HttpClient();
                string token = "ZH75XQXnVwhDSxC2iFhz3FMjC9kW__1adROKUua6e3s";
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                client.DefaultRequestHeaders.Add("User-Agent", "bga");

                var request = new HttpRequestMessage(HttpMethod.Post, "https://cdsapi.srs.kg/api/get-pin-code");

                var json = JsonConvert.SerializeObject(obj);

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                request.Content = content;
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        // Путь: backend/CleanArch/Application/UseCases/FileUseCases.cs
        // Метод: SignDocument (ЗАМЕНА существующего метода)

        public async Task<int> SignDocument(int id, int? uplId, string pin, string code,
            int? selectedPositionId = null, int? selectedDepartmentId = null)
        {
            // Валидация входных параметров
            if (id == 0 && uplId == 0)
                return 1;

            // Получение базовых данных
            var signs = await unitOfWork.FileRepository.GetSignByFileIds(new int[] { id });
            var userId = await _userRepository.GetUserID();
            var userGuid = await _userRepository.GetUserUID();
            var docType = 0;

            // Получение информации о документе
            var uploaded_document = await unitOfWork.uploaded_application_documentRepository.GetByfile_id(id);
            var doc = uploaded_document.FirstOrDefault()?.service_document_id;
            if (doc != null)
            {
                var serviceDoc = await unitOfWork.ServiceDocumentRepository.GetOneByID(doc.Value);
                if (serviceDoc.application_document_id != null)
                {
                    docType = serviceDoc.application_document_id.Value;
                }
            }

            // Получение информации о сотруднике и его должностях
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(userGuid);
            if (employee == null)
            {
                throw new Exception("Сотрудник не найден");
            }

            var structures = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(employee.id);

            // Фильтруем только активные записи
            var activeStructures = structures.Where(x =>
                x.date_start <= DateTime.Now &&
                (x.date_end == null || x.date_end > DateTime.Now)
            ).ToList();

            if (!activeStructures.Any())
            {
                throw new Exception("У сотрудника нет активных должностей");
            }

            // Определение выбранной структуры
            EmployeeInStructure selectedStructure = null;

            if (selectedPositionId.HasValue && selectedDepartmentId.HasValue)
            {
                // Если роль явно указана - используем её
                selectedStructure = activeStructures.FirstOrDefault(x =>
                    x.post_id == selectedPositionId.Value &&
                    x.structure_id == selectedDepartmentId.Value
                );

                if (selectedStructure == null)
                {
                    throw new Exception("Выбранная роль не найдена или не активна для текущего пользователя");
                }
            }
            else
            {
                // Если роль не указана - выбираем первую (по умолчанию)
                // Если ролей несколько - все равно берем первую, но в будущем фронтенд будет передавать выбор
                selectedStructure = activeStructures.First();
            }

            // КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: Проверка существующей подписи по композитному ключу
            // (user_id + structure_employee_id) вместо только user_id
            var existingSign = signs.FirstOrDefault(x =>
                x.user_id == userId &&
                x.structure_employee_id == selectedStructure.id
            );

            if (existingSign != null)
            {
                var sign_id = existingSign.id;

                // Обновление согласования если нужно
                if (uplId != null && uplId != 0)
                {
                    var item = (await unitOfWork.document_approvalRepository.GetByapp_document_id(uplId.Value))
                        .FirstOrDefault(x =>
                            x.position_id == selectedStructure.post_id &&
                            x.department_id == selectedStructure.structure_id &&
                            x.status == "waiting"
                        );

                    if (item != null)
                    {
                        item.file_sign_id = sign_id;
                        item.status = "signed";
                        item.approval_date = DateTime.Now;
                        item.updated_by = userId;
                        item.updated_at = DateTime.Now;
                        await unitOfWork.document_approvalRepository.Update(item);
                    }
                    unitOfWork.Commit();
                }

                return sign_id;
            }

            // ============================================
            // СОЗДАНИЕ НОВОЙ ПОДПИСИ
            // ============================================

            var userToken = "";
            var personFio = "";

            // TODO: Раскомментировать для работы с реальной ЭЦП
            //try
            //{
            //    using var client = new HttpClient();
            //    string token = "ZH75XQXnVwhDSxC2iFhz3FMjC9kW__1adROKUua6e3s";
            //    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            //    client.DefaultRequestHeaders.Add("User-Agent", "bga");
            //
            //    var obj = new SendAuth
            //    {
            //        personIdnp = pin,
            //        organizationInn = "00709199210188",
            //        byPin = code
            //    };
            //    if (!string.IsNullOrWhiteSpace(employee.remote_id))
            //    {
            //        obj.organizationInn = null;
            //    }
            //
            //    var request = new HttpRequestMessage(HttpMethod.Post, "https://cdsapi.srs.kg/api/account/auth");
            //    var json = JsonConvert.SerializeObject(obj);
            //    var content = new StringContent(json, Encoding.UTF8, "application/json");
            //    request.Content = content;
            //    var response = await client.SendAsync(request);
            //    response.EnsureSuccessStatusCode();
            //
            //    var responseJson = await response.Content.ReadAsStringAsync();
            //    var result = JsonConvert.DeserializeObject<TokenResponse>(responseJson);
            //    userToken = result.Token;
            //    personFio = result.PersonFio;
            //}
            //catch (Exception ex)
            //{
            //    throw new Exception("Ошибка аутентификации в системе ЭЦП: " + ex.Message);
            //}

            var signResult = "";
            var signTime = 0L;

            // TODO: Раскомментировать для работы с реальной ЭЦП
            //try
            //{
            //    var file = await unitOfWork.FileRepository.GetOne(id);
            //    var fullPath = unitOfWork.FileRepository.GetFullPath(file.path);
            //    var hash = GetFileSHA256Hash(fullPath);
            //
            //    using var client = new HttpClient();
            //    string token = "ZH75XQXnVwhDSxC2iFhz3FMjC9kW__1adROKUua6e3s";
            //    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            //    client.DefaultRequestHeaders.Add("User-Agent", "bga");
            //
            //    var request = new HttpRequestMessage(HttpMethod.Post, "https://cdsapi.srs.kg/api/get-sign/for-hash");
            //    var json = JsonConvert.SerializeObject(new
            //    {
            //        hash = hash,
            //        userToken = userToken
            //    });
            //
            //    var content = new StringContent(json, Encoding.UTF8, "application/json");
            //    request.Content = content;
            //    var response = await client.SendAsync(request);
            //    response.EnsureSuccessStatusCode();
            //
            //    var responseJson = await response.Content.ReadAsStringAsync();
            //    var result = JsonConvert.DeserializeObject<SignResponse>(responseJson);
            //
            //    if (result.IsSuccesfull != true)
            //    {
            //        throw new Exception("Ошибка получения электронной подписи");
            //    }
            //    signResult = result.Sign;
            //    signTime = result.Timestamp;
            //}
            //catch (Exception ex)
            //{
            //    throw new Exception("Ошибка при формировании ЭЦП: " + ex.Message);
            //}

            // Формирование данных о подписанте с использованием выбранной роли
            var fullname = $"{employee.last_name} {employee.first_name} {employee.second_name}".Trim();
            var structure_name = selectedStructure.structure_name;
            var post_name = selectedStructure.post_name;
            var whoSigned = $"{fullname} - {structure_name} - {post_name}";

            // Создание новой записи подписи
            var res = await unitOfWork.FileRepository.AddSign(new FileSign
            {
                sign_hash = signResult,
                sign_timestamp = signTime,
                pin_user = pin,
                user_id = userId,
                user_full_name = whoSigned,
                pin_organization = personFio,
                employee_id = employee.id,
                employee_fullname = fullname,
                structure_employee_id = selectedStructure.id, // КРИТИЧЕСКИ ВАЖНО: ID конкретной должности
                structure_fullname = structure_name,
                timestamp = DateTime.UtcNow.AddHours(6), //TODO: Убрать хардкод часового пояса
                file_id = id,
                file_type_id = docType != 0 ? docType : null,
                is_called_out = false
            });

            // Обновление согласования если нужно
            if (uplId != null && uplId != 0)
            {
                var item = (await unitOfWork.document_approvalRepository.GetByapp_document_id(uplId.Value))
                    .FirstOrDefault(x =>
                        x.position_id == selectedStructure.post_id &&
                        x.department_id == selectedStructure.structure_id &&
                        x.status == "waiting"
                    );

                if (item != null)
                {
                    item.file_sign_id = res;
                    item.status = "signed";
                    item.approval_date = DateTime.Now;
                    item.updated_by = userId;
                    item.updated_at = DateTime.Now;
                    await unitOfWork.document_approvalRepository.Update(item);
                }
            }

            await CheckSingFiles(uploaded_document.FirstOrDefault()?.application_document_id);
            unitOfWork.Commit();

            return res;
        }

        // Путь: backend/CleanArch/Application/UseCases/FileUseCases.cs
        // Метод: GetAvailableSigningRoles (НОВЫЙ метод - добавить в класс FileUseCases)

        public async Task<List<AvailableSigningRoleDto>> GetAvailableSigningRoles(int fileId)
        {
            var userId = await _userRepository.GetUserID();
            var userGuid = await _userRepository.GetUserUID();

            // Получить все роли пользователя
            var employee = await unitOfWork.EmployeeRepository.GetByUserId(userGuid);
            if (employee == null)
            {
                return new List<AvailableSigningRoleDto>();
            }

            var structures = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(employee.id);

            // Фильтруем только активные записи
            var activeStructures = structures.Where(x =>
                x.date_start <= DateTime.Now &&
                (x.date_end == null || x.date_end > DateTime.Now)
            ).ToList();

            // Получить существующие подписи для этого файла
            var existingSigns = await unitOfWork.FileRepository.GetSignByFileIds(new[] { fileId });

            // Получить требуемые согласования для документа
            var uploadedDoc = await unitOfWork.uploaded_application_documentRepository.GetByfile_id(fileId);
            var approvals = new List<document_approval>();

            if (uploadedDoc.Any())
            {
                var uplId = uploadedDoc.FirstOrDefault()?.id ?? 0;
                if (uplId > 0)
                {
                    approvals = await unitOfWork.document_approvalRepository.GetByapp_document_id(uplId);
                }
            }

            var result = activeStructures.Select(s => new AvailableSigningRoleDto
            {
                PositionId = s.post_id,
                PositionName = s.post_name,
                DepartmentId = s.structure_id,
                DepartmentName = s.structure_name,
                StructureEmployeeId = s.id,
                AlreadySigned = existingSigns.Any(sign =>
                    sign.user_id == userId &&
                    sign.structure_employee_id == s.id
                ),
                IsRequired = approvals.Any(a =>
                    a.position_id == s.post_id &&
                    a.department_id == s.structure_id &&
                    a.status == "waiting"
                ),
                IsActive = true,
                DateStart = s.date_start,
                DateEnd = s.date_end
            }).ToList();

            return result;
        }

        public async Task<int> CallOutSignDocument(int id)
        {
            var signs = await unitOfWork.FileRepository.GetSignByFileIds(new int[] { id });
            var userId = await _userRepository.GetUserID();
            var userGuid = await _userRepository.GetUserUID();
            int res = 0;

            var sign = signs.Find(x => x.user_id == userId);
            if(sign != null)
            {
                sign.is_called_out = true;
                res = await unitOfWork.FileRepository.UpdateSign(sign);
            }

            return res;

        }
        private async Task CheckSingFiles(int? id)
        {
            if (id == null)
            {
                return;
            }
            var app = await unitOfWork.ApplicationRepository.GetOneByID(id.Value);
            if (app != null && app.status_code == "ready_for_signing_eo")
            {
                var files = await unitOfWork.FileRepository.GetSignsByApplicationId(app.id);
                var unsignedFiles = files
                    .GroupBy(f => f.service_document_id)
                    .Any(g => g.All(x => x.file_id == null) || g.All(x => x.employee_id == null));

                if (!unsignedFiles)
                {
                    var newStatus = await unitOfWork.ApplicationStatusRepository.GetByCode("document_ready");
                    var _applicationUseCases = _provider.GetRequiredService<ApplicationUseCases>();
                    await _applicationUseCases.ChangeStatus(app.id, newStatus.id);
                }
            }
        }

        public async Task<List<FileSign>> GetAllSignByUser()
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            var result = await unitOfWork.FileRepository.GetAllSignForUser(user_id);
            return result;
        }
        
        public async Task<List<FileSignInfo>> GetSignEmployeeListByFile(int id)
        {
            var result = await unitOfWork.FileRepository.GetSignEmployeeListByFile(id);
            return result;
        }
        
        private string GetFileSHA256Hash(string filePath)
        {
            using var sha256 = SHA256.Create();
            using var stream = System.IO.File.OpenRead(filePath);

            byte[] hashBytes = sha256.ComputeHash(stream);
            return Convert.ToHexString(hashBytes); // Returns uppercase hex
        }

        public class SendPin
        {
            [JsonProperty("personIdnp")]
            public string personIdnp { get; set; }

            [JsonProperty("method")]
            public string method { get; set; }
            [JsonProperty("organizationInn")]
            public string organizationInn { get; set; }

        }


        public class SendAuth
        {
            [JsonProperty("personIdnp")]
            public string personIdnp { get; set; }

            [JsonProperty("byPin")]
            public string byPin { get; set; }
            [JsonProperty("organizationInn")]
            public string organizationInn { get; set; }

        }

        public class SignResponse
        {
            [JsonProperty("sign")]
            public string Sign { get; set; }

            [JsonProperty("isSuccesfull")]
            public bool IsSuccesfull { get; set; }
            [JsonProperty("timestamp")]
            public long Timestamp { get; set; }

        }
        public class TokenResponse
        {
            [JsonProperty("createAt")]
            public string CreateAt { get; set; }

            [JsonProperty("expireAt")]
            public string ExpireAt { get; set; }

            [JsonProperty("subjectType")]
            public int SubjectType { get; set; }

            [JsonProperty("personIdnp")]
            public long PersonIdnp { get; set; }

            [JsonProperty("personFio")]
            public string PersonFio { get; set; }

            [JsonProperty("organizationInn")]
            public string OrganizationInn { get; set; }

            [JsonProperty("organizationName")]
            public string OrganizationName { get; set; }

            [JsonProperty("isActive")]
            public bool IsActive { get; set; }

            [JsonProperty("token")]
            public string Token { get; set; }
        }

        public async Task<Domain.Entities.File> DownloadDocument(int id, bool skipUser = false)
        {
            var file = await unitOfWork.FileRepository.GetOne(id);

            if (!skipUser)
            {
                var userInfo = await unitOfWork.EmployeeRepository.GetUser();
                await unitOfWork.FileDownloadLogRepository.Add(
                    userInfo.id,
                    userInfo.last_name + " " + userInfo.first_name + " " + userInfo.second_name,
                    file.id,
                    file.name);
            }

            file.body = await unitOfWork.FileRepository.GetByPath(file.path);
            unitOfWork.Commit();
            return file;
        }

        public async Task<Domain.Entities.File> DownloadDocumentFromCabinet(int id)
        {
            var file = await unitOfWork.FileRepository.GetOne(id);
            file.body = await unitOfWork.FileRepository.GetByPath(file.path);
            unitOfWork.Commit();
            return file;
        }

        public async Task ReadExcel(MemoryStream stream, string bank_identifier)
        {
            List<IPaymentRecord> invoiceData;
            if (bank_identifier == "mbank")
            {
                var mbankRecords = await unitOfWork.FileRepository.ReadPaymentMbankRecords(stream);
                invoiceData = mbankRecords.Cast<IPaymentRecord>().ToList();
            }
            else
            {
                var paymentRecords = await unitOfWork.FileRepository.ReadPaymentRecords(stream);
                invoiceData = paymentRecords.Cast<IPaymentRecord>().ToList();
            }

            var applicationData = await unitOfWork.ApplicationRepository.GetAll();

            foreach (var invoice in invoiceData)
            {
                var app = applicationData.FirstOrDefault(a => a.number == invoice.ContractNumber);
                if (app != null)
                {
                    var invoices = await unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(app.id);
                    if (invoices.FirstOrDefault(i => i.date == invoice.PaymentDate && i.sum == invoice.Amount) == null)
                    {
                        await unitOfWork.ApplicationPaidInvoiceRepository.Add(new ApplicationPaidInvoice
                        {
                            application_id = app.id,
                            date = invoice.PaymentDate,
                            bank_identifier = bank_identifier,
                            sum = invoice.Amount,
                            payment_identifier = invoice.PaymentId,
                        });
                        unitOfWork.Commit();

                        var invoiceSum = invoices.Sum(x => x.sum) + invoice.Amount;
                        var service = await unitOfWork.ServiceRepository.GetOneByID(app.service_id);
                        if (invoiceSum >= (service.price ?? 0))
                        {
                            app.is_paid = true;
                            await unitOfWork.ApplicationRepository.UpdatePaid(app);
                            unitOfWork.Commit();
                        }
                    }
                }
            }
        }

        public async Task SendFiles(int application_id)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            var files = await unitOfWork.uploaded_application_documentRepository.GetCustomByApplicationId(application_id);
            var outcomingFiles = files.Where(f => f.file_id != null && f.is_outcome == true).ToList();
            var message = new CabinetMessage();
            message.ApplicationUUID = app.app_cabinet_uuid;
            message.Files = new List<UploadedDocumentData>();
            foreach (var item in outcomingFiles)
            {
                var file = await DownloadDocument(item.file_id.Value, true);
                await UploadFileToFtp(file.path, file.body);
                message.Files.Add(new UploadedDocumentData
                {
                    DocName = item.doc_name,
                    ServiceDocumentId = item.id,
                    AppDocId = item.app_doc_id,
                    TypeName = item.type_name,
                    UploadId = item.upload_id,
                    UploadName = item.upload_name,
                    IsOutcome = item.is_outcome,
                    DocumentNumber = item.document_number,
                    File = new FileData
                    {
                        Name = file.name,
                        Path = file.path
                    }
                });
            }
            await _bgaService.SendCabinetFilesAsync(message);
        }

        public async Task<string> CreateRejectFile(string html)
        {
            var fileName = Guid.NewGuid().ToString();

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

            using (var stream = new MemoryStream())
            {
                pdfDocument.GeneratePdf(stream);
                var fileBody = stream.ToArray();
                await UploadFileToFtp(fileName, fileBody);
            }

            return fileName;
        }

        public async Task<Domain.Entities.File> HtmlToFile(string html)
        {
            var fileName = Guid.NewGuid().ToString();

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

            using (var stream = new MemoryStream())
            {
                pdfDocument.GeneratePdf(stream);
                var fileBody = stream.ToArray();
                await UploadFileToFtp(fileName, fileBody);
                return new Domain.Entities.File
                {
                    path = fileName,
                    body = fileBody,
                };
            }
        }

        private async Task UploadFileToFtp(string fileName, byte[] fileContent)
        {
            while (true)
            {
                try
                {
                    var ftpHost = _configuration["FTP:Host"];
                    var ftpUsername = _configuration["FTP:Username"];
                    var ftpPassword = _configuration["FTP:Password"];
                    var ftpPort = _configuration["FTP:Port"];

                    var ftpRequest = (FtpWebRequest)WebRequest.Create($"ftp://{ftpHost}:{ftpPort}/{fileName}");
                    ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;
                    ftpRequest.Credentials = new NetworkCredential(ftpUsername, ftpPassword);
                    ftpRequest.KeepAlive = false;
                    ftpRequest.UseBinary = true;
                    ftpRequest.ContentLength = fileContent.Length;
                    ftpRequest.Timeout = 600000;
                    ftpRequest.ReadWriteTimeout = 600000;

                    using (var requestStream = await ftpRequest.GetRequestStreamAsync())
                    {
                        int bufferSize = 8192;
                        for (int offset = 0; offset < fileContent.Length; offset += bufferSize)
                        {
                            int chunkSize = Math.Min(bufferSize, fileContent.Length - offset);
                            await requestStream.WriteAsync(fileContent, offset, chunkSize);
                        }

                        await requestStream.FlushAsync();
                    }

                    using (var response = (FtpWebResponse)await ftpRequest.GetResponseAsync())
                    {
                        Console.WriteLine($"FTP Response: {response.StatusCode} - {response.StatusDescription}");
                        var ftpFileSize = await GetFtpFileSize(ftpHost, ftpUsername, ftpPassword, fileName);
                        if (ftpFileSize == fileContent.Length)
                        {
                            Console.WriteLine("Файл успешно загружен, размеры совпадают.");
                            return;
                        }
                        Console.WriteLine($"Ошибка: Размер файла на FTP ({ftpFileSize} байт) не совпадает с исходным ({fileContent.Length} байт).");

                        if (response.StatusCode != FtpStatusCode.ClosingData &&
                            response.StatusCode != FtpStatusCode.CommandOK)
                        {
                            throw new Exception($"Unexpected FTP response: {response.StatusDescription}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to upload file to FTP: {ex.Message}");
                    throw;
                }
            }
        }

        private async Task<long> GetFtpFileSize(string ftpHost, string ftpUsername, string ftpPassword, string fileName)
        {
            try
            {
                var request = (FtpWebRequest)WebRequest.Create($"ftp://{ftpHost}/{fileName}");
                request.Method = WebRequestMethods.Ftp.GetFileSize;
                request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);
                request.UseBinary = true;
                request.KeepAlive = false;

                using (var response = (FtpWebResponse)await request.GetResponseAsync())
                {
                    return response.ContentLength;
                }
            }
            catch (WebException ex)
            {
                Console.WriteLine($"Failed to get file size: {ex.Message}");
                return -1; // Если файл не найден или ошибка
            }
        }

        public async Task<List<FileDownloadLog>> GetFileLog()
        {
            return await unitOfWork.FileDownloadLogRepository.GetAll();
        }


        public async Task<Domain.Entities.File> CreateArchive(List<Domain.Entities.File> files)
        {
            if (files == null || !files.Any())
                throw new ArgumentException("Список файлов не может быть пустым", nameof(files));

            var archiveName = $"archive_{Guid.NewGuid()}.zip";

            using (var archiveStream = new MemoryStream())
            {
                using (var archive = new System.IO.Compression.ZipArchive(archiveStream, System.IO.Compression.ZipArchiveMode.Create, true))
                {
                    foreach (var file in files)
                    {
                        // Получаем содержимое файла, если оно не загружено
                        if (file.body == null || file.body.Length == 0)
                        {
                            file.body = await unitOfWork.FileRepository.GetByPath(file.path);
                        }

                        // Создаем запись в архиве
                        var entryName = !string.IsNullOrEmpty(file.name) ? file.name : Path.GetFileName(file.path);
                        var entry = archive.CreateEntry(entryName);

                        using (var entryStream = entry.Open())
                        {
                            await entryStream.WriteAsync(file.body, 0, file.body.Length);
                        }
                    }
                }

                var archiveBytes = archiveStream.ToArray();

                // Загружаем архив на FTP
                //await UploadFileToFtp(archiveName, archiveBytes);

                // Создаем новую запись файла в базе данных
                var archiveFile = new Domain.Entities.File
                {
                    name = archiveName,
                    body = archiveBytes,
                    created_at = DateTime.UtcNow.AddHours(6), // TODO: использовать правильную timezone
                    //mime_type = "application/zip",
                    //size = archiveBytes.Length
                };

                // Сохраняем в базу данных
                var documentId = unitOfWork.FileRepository.AddDocument(archiveFile);
                await unitOfWork.FileRepository.Add(documentId);
                unitOfWork.Commit();

                return archiveFile;
            }
        }
        
        public async Task SendFilesToSmejPortal(int application_id, List<File> files)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            var message = new SmejPortalMessage();
            message.ApplicationNumber = app.number;
            message.Files = new List<UploadedDocumentData>();
            foreach (var file in files)
            {
                var path = Guid.NewGuid().ToString();
                await UploadFileToFtp(path, file.body);
                message.Files.Add(new UploadedDocumentData
                {
                    File = new FileData
                    {
                        Name = file.name,
                        Path = path
                    }
                });
            }
            await _bgaService.SendSmejPortalFilesAsync(message);
        }
    }
}