using Application.Models;
using Application.Repositories;
using Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text;
using Application.Services;
using Newtonsoft.Json;
using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using HTMLQuestPDF.Extensions;
using DocumentFormat.OpenXml.Drawing.Charts;
using File = Domain.Entities.File;
using Infrastructure.Services;
using System;

namespace Application.UseCases
{
    public class saved_application_documentUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserRepository userRepository;
        private readonly IN8nService _n8nService;
        private readonly IPdfGenerator pdfGenerator;
        private readonly IWatermarkService _watermarkService;
        private readonly Iuploaded_application_documentUseCases uploaded_Application_DocumentUse;

        public saved_application_documentUseCases(IUnitOfWork unitOfWork, IUserRepository userRepository, IN8nService n8nService, IPdfGenerator pdfGenerator, IWatermarkService watermarkService, Iuploaded_application_documentUseCases uploaded_Application_DocumentUse)
        {
            this.unitOfWork = unitOfWork;
            this.userRepository = userRepository;
            _n8nService = n8nService;
            this.pdfGenerator = pdfGenerator;
            _watermarkService = watermarkService;
            this.uploaded_Application_DocumentUse = uploaded_Application_DocumentUse;
        }

        public Task<List<saved_application_document>> GetAll()
        {
            return unitOfWork.saved_application_documentRepository.GetAll();
        }
        public Task<saved_application_document> GetOne(int id)
        {
            return unitOfWork.saved_application_documentRepository.GetOne(id);
        }
        async public Task<saved_application_document> GetByApplication(int application_id, int template_id, int language_id)
        {
            var res = await unitOfWork.saved_application_documentRepository.GetByApplication(application_id, template_id, language_id);
            return res;
        }

        public async Task<saved_application_document> Create(saved_application_document domain)
        {
            domain.created_at = DateTime.Now;
            domain.created_by = await userRepository.GetUserID();
            domain.updated_at = DateTime.Now;
            domain.updated_by = domain.created_by;


            //create pdf file
            //var pdfBytes = pdfGenerator.GeneratePdf(domain.body);

            //var doc_id = await unitOfWork.FileRepository.Add(new File
            //{
            //    body = pdfBytes,
            //    name = domain.template_name,
            //});

            //var files = await unitOfWork.FileRepository.GetAll();
            //var file = files.OrderByDescending(x => x.id).FirstOrDefault();

            //var body = await unitOfWork.FileRepository.GetByPath(file.path);

            //var document = unitOfWork.FileRepository.AddDocument(new File
            //{
            //    body = body ?? new byte[1],
            //    name = domain.template_name, 
            //});

            //var mark = new List<string> { "Документ подписан электронной подписью", "Государственного портала электронных услуг", "Дата подписи: " + DateTime.Now.ToString("dd.MM.yyyy"), document.path };
            //var res = await _watermarkService.AddSignatureStampDirectlyToPdfAsync(document.body, mark, document.path);
            //document.body = res.Value;
            //document = unitOfWork.FileRepository.UpdateDocumentFilePath(document);


            //var id_file = await unitOfWork.FileRepository.Add(document);
            //domain.file_id = id_file;




            var result = await unitOfWork.saved_application_documentRepository.Add(domain);
            domain.id = result;


            unitOfWork.Commit();

            try
            {
                if (domain.template_id == 10 || domain.template_id == 33 || domain.template_id == 14) //TODO Dogovor
                {
                    var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
                    var customer = await unitOfWork.CustomerRepository.GetOneByID(application.customer_id);
                    if (application.maria_db_statement_id != null)
                    {
                        var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(application.id);
                        double cost = 0.0;
                        foreach (var payment in payments)
                        {
                            cost += (double)(payment.sum ?? 0);
                        }

                        if (application.discount_percentage > 0)
                        {
                            cost = Math.Round(cost * ((double)(application.discount_percentage / 100.0m)), 2);
                        }

                        await unitOfWork.MariaDbRepository.UpdateCost(application.maria_db_statement_id.Value, cost);
                        await unitOfWork.MariaDbRepository.UpdateCustomer(application.maria_db_statement_id.Value, customer?.full_name);
                        unitOfWork.Commit();
                    }

                    var app = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
                    if (app.status_id == 4 || app.status_id == 2 || app.status_id == 16)
                    {
                        await _n8nService.RegisterInFinBook(app, true);
                    }
                    else
                    {
                        await _n8nService.RegisterInFinBook(app, false);
                    }
                }

            }
            catch
            {

            }


            return domain;
        }

        public async Task<saved_application_document> Update(saved_application_document domain)
        {
            domain.updated_by = await userRepository.GetUserID();
            domain.updated_at = DateTime.Now;

            await unitOfWork.saved_application_documentRepository.Update(domain);

            unitOfWork.Commit();

            try
            {
                if (domain.template_id == 10 || domain.template_id == 33 || domain.template_id == 14)  //TODO Dogovor
                {
                    var application = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
                    var customer = await unitOfWork.CustomerRepository.GetOneByID(application.customer_id);
                    if (application.maria_db_statement_id != null)
                    {
                        var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(application.id);
                        double cost = 0.0;
                        foreach (var payment in payments)
                        {
                            cost += (double)(payment.sum ?? 0);
                        }
                        await unitOfWork.MariaDbRepository.UpdateCost(application.maria_db_statement_id.Value, cost);
                        await unitOfWork.MariaDbRepository.UpdateCustomer(application.maria_db_statement_id.Value, customer?.full_name);
                        unitOfWork.Commit();
                    }
                }
            }
            catch
            {

            }

            return domain;
        }

        public Task<PaginatedList<saved_application_document>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.saved_application_documentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.saved_application_documentRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<saved_application_document>> GetByapplication_id(int application_id)
        {
            return unitOfWork.saved_application_documentRepository.GetByapplication_id(application_id);
        }

        public Task<List<saved_application_document>> GetBytemplate_id(int template_id)
        {
            return unitOfWork.saved_application_documentRepository.GetBytemplate_id(template_id);
        }

        public Task<List<saved_application_document>> GetBylanguage_id(int language_id)
        {
            return unitOfWork.saved_application_documentRepository.GetBylanguage_id(language_id);
        }

        public async Task<List<saved_application_document>> GetLatestSavedDocuments(int appId)
        {
            var docs = await unitOfWork.saved_application_documentRepository.GetByapplication_id(appId);


            var latestRecords = docs
                .GroupBy(r => new { r.template_id, r.language_id })
                .Select(g => g.OrderByDescending(r => r.id).FirstOrDefault())
                .Where(x => x != null)
                .ToList();

            return latestRecords;

        }

        public async Task<int> SignHtml(int application_id, int template_id, string html, int langauge_id)
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
                            handler.SetContainerStyleForHtmlElement("img", c => c.MaxHeight(4, Unit.Centimetre));
                        });
                    });

                });
            });

            var file = new File
            {
                id = 0,
                name = $"{application_id}_{template_id}.pdf",
            };

            using (var stream = new MemoryStream())
            {
                pdfDocument.GeneratePdf(stream);
                file.body = stream.ToArray();
            }
            var body = file.body;

            var document = unitOfWork.FileRepository.AddDocument(file);



            var temp = await unitOfWork.S_DocumentTemplateRepository.GetOne(template_id);
            var doc = await unitOfWork.ApplicationDocumentRepository.GetOneByType(temp.description);
            var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
            var sds = await unitOfWork.ServiceDocumentRepository.GetByidService(app.service_id);
            var sd = sds.FirstOrDefault(x => x.application_document_id == doc.id);

            var upl = new uploaded_application_document
            {
                document = file,
                application_document_id = application_id,
                service_document_id = sd?.id,
            };
            await uploaded_Application_DocumentUse.Create(upl);



            var mark = new List<string> { "Дата создания: " + DateTime.Now.ToString("dd.MM.yyyy"), "QR-код для проверки ЭЦП", document.path };
            var secured = _watermarkService.GenerateSecureLink("", document.path);
            var res = await _watermarkService.AddSignatureStampDirectlyToPdfAsync(document.body, mark, secured);
            document.body = res.Value;
            document = unitOfWork.FileRepository.UpdateDocumentFilePath(document);


            var idFile = await unitOfWork.FileRepository.Add(document);

            var sad = new saved_application_document();
            sad.created_at = DateTime.Now;
            sad.created_by = await userRepository.GetUserID();
            sad.updated_at = DateTime.Now;
            sad.updated_by = sad.created_by;
            sad.file_id = idFile;
            sad.template_id = template_id;
            sad.language_id = langauge_id;
            sad.body = html;
            sad.application_id = application_id;

            var result = await unitOfWork.saved_application_documentRepository.Add(sad);
            sad.id = result;

            unitOfWork.Commit();

            return idFile;
        }



        public async Task<byte[]> DownloadPdf(int id)
        {
            var doc = await unitOfWork.saved_application_documentRepository.GetOne(id);

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
                            handler.SetHtml(doc.body);
                        });
                    });
                });
            });


            using (var stream = new MemoryStream())
            {
                pdfDocument.GeneratePdf(stream);
                return stream.ToArray();
            }
        }


    }
}
