using Application.Models;
using Application.Repositories;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;
using Domain.Entities;
using System.Threading.Tasks;
using File = System.IO.File;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Text = DocumentFormat.OpenXml.Spreadsheet.Text;
using Newtonsoft.Json;
using DocumentFormat.OpenXml.Office.SpreadSheetML.Y2023.MsForms;
using FluentResults;
using Microsoft.Extensions.Hosting;

namespace Application.UseCases
{
    public class application_paymentUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IMariaDbRepository _mariaDbRepository;
        private readonly S_DocumentTemplateUseCases _sDocumentTemplateUseCases;
        private ApplicationUseCases _applicationUseCases;
        //private static readonly BasicConverter Converter = new BasicConverter(new PdfTools()); //TODO CLEAN

        public application_paymentUseCases(IUnitOfWork unitOfWork, IEmployeeRepository employeeRepository, IMariaDbRepository mariaDbRepository, S_DocumentTemplateUseCases sDocumentTemplateUseCases, ApplicationUseCases applicationUseCases)
        {
            this.unitOfWork = unitOfWork;
            _employeeRepository = employeeRepository;
            _mariaDbRepository = mariaDbRepository;
            _sDocumentTemplateUseCases = sDocumentTemplateUseCases;
            _applicationUseCases = applicationUseCases;
        }
        private static readonly Random rnd = new();

        public Task<List<application_payment>> GetAll()
        {
            return unitOfWork.application_paymentRepository.GetAll();
        }
        public Task<application_payment> GetOne(int id)
        {
            return unitOfWork.application_paymentRepository.GetOne(id);
        }
        public async Task<application_payment> Create(application_payment domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.created_by = user_id;
            domain.created_at = DateTime.Now;

            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
                unitOfWork.Commit();
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var eisId = unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id).Result.FirstOrDefault();
                var paymentType = await unitOfWork.WorkDocumentTypeRepository.GetOneByCode("Payment");
                await unitOfWork.ApplicationWorkDocumentRepository.Add(new ApplicationWorkDocument
                {
                    created_at = DateTime.Now,
                    structure_employee_id = eisId != null ? eisId.id : null,
                    structure_id = domain.structure_id,
                    task_id = domain.idTask,
                    id_type = paymentType.id,
                    file_id = domain.file_id,
                });
            }
            else
            {
                domain.file_id = null;
            }
            var result = await unitOfWork.application_paymentRepository.Add(domain);
            domain.id = result;

            var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(domain.application_id);
            var application = await unitOfWork.ApplicationRepository.GetForSaveApplicationTotalSum(domain.application_id);

            var sum = payments.Sum(x => x.sum) ?? 0;

            decimal tax_multiplier = 1 + (application.nds_value / 100) + (application.nsp_value / 100);
            decimal base_sum_without_taxes = sum / tax_multiplier;

            // 2. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
            decimal discount = application.discount_percentage > 0
                ? (application.discount_percentage / 100) * base_sum_without_taxes
                : application.discount_value;

            // 3. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
            decimal discounted_base_sum = base_sum_without_taxes - discount; // пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ

            // 4. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
            decimal new_nds_value = discounted_base_sum * (application.nds_value / 100);
            decimal new_nsp_value = discounted_base_sum * (application.nsp_value / 100);

            // 5. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
            decimal total_sum = discounted_base_sum + new_nds_value + new_nsp_value;

            if (application.calc_created_at == null)
            {
                application.calc_created_at = DateTime.Now;
                application.calc_created_by = user_id;
            }
            else
            {
                application.calc_updated_at = DateTime.Now;
                application.calc_updated_by = user_id;
            }

            application.sum_wo_discount = sum;
            application.total_sum = total_sum;
            application.nds_value = new_nds_value;
            application.nsp_value = new_nsp_value;
            application.nds_percentage = 12; //todo
            application.nsp_percentage = 2; //todo
            await unitOfWork.ApplicationRepository.SaveApplicationTotalSum(application);
            unitOfWork.Commit();


            try
            {

                var app = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
                if (app != null && app.maria_db_statement_id.HasValue) { 
                    await unitOfWork.MariaDbRepository.UpdateCost(app.maria_db_statement_id.Value, (double)total_sum);
                }

                var user = await unitOfWork.UserRepository.GetUserInfo();
                var maria_users = await unitOfWork.MariaDbRepository.GetEmployeesByEmail(user.Email ?? "");
                var maria_user_id = maria_users.FirstOrDefault();
                if (maria_user_id == null)
                {
                    var admin = await unitOfWork.MariaDbRepository.GetEmployeesByEmail("aasakeeva@bga.kg");
                    maria_user_id = admin.FirstOrDefault();
                }
                if (maria_user_id != null)
                {
                    await _mariaDbRepository.SyncPayment(app.number, domain.structure_id ?? 209, maria_user_id, payments, domain);
                }
            }
            catch (Exception ex)
            {
            }

            await _applicationUseCases.InvalidatePaginationCache();


            return domain;
        }

        public async Task<application_payment> Update(application_payment domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;

            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var id_file = await unitOfWork.FileRepository.Add(document);
                domain.file_id = id_file;
                var paymentType = await unitOfWork.WorkDocumentTypeRepository.GetOneByCode("Payment");
                var emp = await unitOfWork.EmployeeRepository.GetUser();
                var eisId = unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id).Result.FirstOrDefault();
                await unitOfWork.ApplicationWorkDocumentRepository.Add(new ApplicationWorkDocument
                {
                    created_at = DateTime.Now,
                    structure_employee_id = eisId != null ? eisId.id : null,
                    structure_id = domain.structure_id,
                    task_id = domain.idTask,
                    id_type = paymentType.id,
                    file_id = domain.file_id,
                });
            }
            await unitOfWork.application_paymentRepository.Update(domain);
            unitOfWork.Commit();

            var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(domain.application_id);

            var app = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);

            try
            {
                var user = await unitOfWork.UserRepository.GetUserInfo();

                var maria_users = await unitOfWork.MariaDbRepository.GetEmployeesByEmail(user.Email ?? "");
                var maria_user_id = maria_users.FirstOrDefault();
                if (maria_user_id == null)
                {
                    var admin = await unitOfWork.MariaDbRepository.GetEmployeesByEmail("aasakeeva@bga.kg");
                    maria_user_id = admin.FirstOrDefault();
                }
                if (maria_user_id != null)
                {

                    await _mariaDbRepository.SyncPaymentUpdate(app.number, domain.structure_id ?? 209, maria_user_id, payments, domain);
                }
            }
            catch (Exception ex)
            {
            }

            var application = await unitOfWork.ApplicationRepository.GetForSaveApplicationTotalSum(domain.application_id);

            var sum = payments.Sum(x => x.sum) ?? 0;

            decimal tax_multiplier = 1 + (application.nds_value / 100) + (application.nsp_value / 100);
            decimal base_sum_without_taxes = sum / tax_multiplier;

            // 2. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
            decimal discount = application.discount_percentage > 0
                ? (application.discount_percentage / 100) * base_sum_without_taxes
                : application.discount_value;

            // 3. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
            decimal discounted_base_sum = Math.Max(base_sum_without_taxes - discount, 0); // пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ

            // 4. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
            decimal new_nds_value = discounted_base_sum * (application.nds_value / 100);
            decimal new_nsp_value = discounted_base_sum * (application.nsp_value / 100);

            // 5. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
            decimal total_sum = discounted_base_sum + new_nds_value + new_nsp_value;

            if (application.calc_created_at == null)
            {
                application.calc_created_at = DateTime.Now;
                application.calc_created_by = user_id;
            }
            else
            {
                application.calc_updated_at = DateTime.Now;
                application.calc_updated_by = user_id;
            }

            application.sum_wo_discount = sum;
            application.total_sum = total_sum;
            application.nds_value = new_nds_value;
            application.nsp_value = new_nsp_value;
            application.nds_percentage = 12; //todo
            application.nsp_percentage = 2; //todo
            await unitOfWork.ApplicationRepository.SaveApplicationTotalSum(application);
            unitOfWork.Commit();

            if (app != null && app.maria_db_statement_id.HasValue)
            {
                await unitOfWork.MariaDbRepository.UpdateCost(app.maria_db_statement_id.Value, (double)total_sum);
            }

            await _applicationUseCases.InvalidatePaginationCache();

            return domain;
        }

        public Task<PaginatedList<application_payment>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_paymentRepository.GetPaginated(pageSize, pageNumber);
        }

        public Task<PaginatedList<applacation_payment_sum>> GetPagniatedByParam(DateTime dateStart, DateTime dateEnd, List<int> structiure_ids)
        {
            return unitOfWork.application_paymentRepository.GetPagniatedByParam(dateStart, dateEnd, structiure_ids);
        }

        public async Task<int> Delete(DeletePaymentRequest request)
        {
            var id = request.id;
            var payment = await unitOfWork.application_paymentRepository.GetOne(id);
            var user = await unitOfWork.UserRepository.GetUserInfo();
            var user_id = await unitOfWork.UserRepository.GetUserID();
            
            if (payment.file_id != null)
            {
                var appWorkDocument = await unitOfWork.ApplicationWorkDocumentRepository.GetOneByFileID(payment.file_id.Value);
                var document = new ApplicationWorkDocument
                {
                    id = appWorkDocument.id,
                    deactivated_at = DateTime.Now,
                    deactivated_by = user_id,
                    is_active = false,
                    reason_deactivated = request.reason,
                };
                await unitOfWork.ApplicationWorkDocumentRepository.DeactivateDocument(document);
            }

            var app = await unitOfWork.ApplicationRepository.GetOneByID(payment.application_id);

            try
            {

                var maria_users = await unitOfWork.MariaDbRepository.GetEmployeesByEmail(user.Email ?? "");
                var maria_user_id = maria_users.FirstOrDefault();
                if (maria_user_id == null)
                {
                    var admin = await unitOfWork.MariaDbRepository.GetEmployeesByEmail("aasakeeva@bga.kg");
                    maria_user_id = admin.FirstOrDefault();
                }
                if (maria_user_id != null)
                {

                    var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(payment.application_id);
                    await _mariaDbRepository.SyncPaymentDelete(app.number, payment.structure_id ?? 209, maria_user_id, payments);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("delete:" + ex.ToString());
            }

            await unitOfWork.application_paymentRepository.Delete(id);
            unitOfWork.Commit();

            try
            {
                var payments2 = await unitOfWork.application_paymentRepository.GetByapplication_id(payment.application_id);
                var application = await unitOfWork.ApplicationRepository.GetForSaveApplicationTotalSum(payment.application_id);

                var sum = payments2.Where(x=>x.id != id).Sum(x => x.sum) ?? 0;

                decimal tax_multiplier = 1 + (application.nds_value / 100) + (application.nsp_value / 100);
                decimal base_sum_without_taxes = sum / tax_multiplier;

                // 2. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
                decimal discount = application.discount_percentage > 0
                    ? (application.discount_percentage / 100) * base_sum_without_taxes
                    : application.discount_value;

                // 3. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
                decimal discounted_base_sum = Math.Max(base_sum_without_taxes - discount, 0); // пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ

                // 4. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
                decimal new_nds_value = discounted_base_sum * (application.nds_value / 100);
                decimal new_nsp_value = discounted_base_sum * (application.nsp_value / 100);

                // 5. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
                decimal total_sum = discounted_base_sum + new_nds_value + new_nsp_value;

                if (application.calc_created_at == null)
                {
                    application.calc_created_at = DateTime.Now;
                    application.calc_created_by = user_id;
                }
                else
                {
                    application.calc_updated_at = DateTime.Now;
                    application.calc_updated_by = user_id;
                }

                application.sum_wo_discount = sum;
                application.total_sum = total_sum;
                application.nds_value = new_nds_value;
                application.nsp_value = new_nsp_value;
                application.nds_percentage = 12; //todo
                application.nsp_percentage = 2; //todo
                await unitOfWork.ApplicationRepository.SaveApplicationTotalSum(application);
                unitOfWork.Commit();

                if (app != null && app.maria_db_statement_id.HasValue)
                {
                    await unitOfWork.MariaDbRepository.UpdateCost(app.maria_db_statement_id.Value, (double)total_sum);
                }

            }
            catch (Exception e)
            {

                Console.WriteLine("update app sum:" + e.ToString());
            }

            await _applicationUseCases.InvalidatePaginationCache();

            return id;
        }


        
        public Task<List<application_payment>>  GetByapplication_id(int application_id)
        {
            return unitOfWork.application_paymentRepository.GetByapplication_id(application_id);
        }
        public Task<List<DashboardGetEmployeeCalculationsDto>> DashboardGetEmployeeCalculations(int structure_id, DateTime date_start, DateTime date_end, string sort)
        {
            return unitOfWork.application_paymentRepository.DashboardGetEmployeeCalculations(structure_id, date_start, date_end, sort);
        }
        public Task<List<DashboardGetEmployeeCalculationsGroupedDto>> DashboardGetEmployeeCalculationsGrouped(int structure_id, DateTime date_start, DateTime date_end)
        {
            return unitOfWork.application_paymentRepository.DashboardGetEmployeeCalculationsGrouped(structure_id, date_start, date_end);
        }
        
        public Task<List<application_payment>>  GetBystructure_id(int structure_id)
        {
            return unitOfWork.application_paymentRepository.GetBystructure_id(structure_id);
        }

        public async Task<Result<string>> GetPrintDocument(int application_id)
        {
            var emp = await unitOfWork.EmployeeRepository.GetUser();
            var orgs = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
            var calculationTemplate = await unitOfWork.S_DocumentTemplateRepository.GetOneByCode("calculation_template");
            var parametrs = new Dictionary<string, object>
            {
                { "application_id", application_id },
                { "structure_id", orgs?.FirstOrDefault()?.structure_id },
                { "user_id", emp?.user_id },
            };
            
            var response = await _sDocumentTemplateUseCases.GetFilledDocumentHtml(calculationTemplate.id, "ru", parametrs);
            return response;
        }
        
        public Task<Domain.Entities.Application> GetApplicationSumByID(int id)
        {
            return unitOfWork.ApplicationRepository.GetOneApplicationSumByID(id);
        }
        
        public async Task<Domain.Entities.Application> SaveApplicationTotalSum(SaveDiscountRequest request)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();

            var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(request.application_id);
            var sum = payments.Sum(x => x.sum) ?? 0;

            decimal tax_multiplier = 1 + (request.nds_value / 100) + (request.nsp_value / 100);
            decimal base_sum_without_taxes = sum / tax_multiplier;

            // 2. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
            decimal discount = request.discount_percentage > 0
                ? request.discount_percentage / 100 * base_sum_without_taxes
                : request.discount_value;

            // 3. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
            decimal discounted_base_sum = Math.Max(base_sum_without_taxes - discount, 0); // пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ

            // 4. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ
            decimal new_nds_value = discounted_base_sum * (request.nds_value / 100);
            decimal new_nsp_value = discounted_base_sum * (request.nsp_value / 100);

            // 5. пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
            decimal total_sum = discounted_base_sum + new_nds_value + new_nsp_value;


            var application = await unitOfWork.ApplicationRepository.GetForSaveApplicationTotalSum(request.application_id);
            if (application.calc_created_at == null)
            {
                application.calc_created_at = DateTime.Now;
                application.calc_created_by = user_id;
            }
            else
            {
                application.calc_updated_at = DateTime.Now;
                application.calc_updated_by = user_id;
            }
            application.has_discount = true;
            application.sum_wo_discount = sum;
            application.total_sum = total_sum;
            application.discount_percentage = request.discount_percentage;
            application.discount_value = request.discount_value;
            application.nds_value = new_nds_value;
            application.nsp_value = new_nsp_value;
            application.nds_percentage = 12; //todo
            application.nsp_percentage = 2; //todo
            var result = await unitOfWork.ApplicationRepository.SaveApplicationTotalSum(application);
            unitOfWork.Commit();
            return result;
        }

        public async Task<byte[]> GetEmployeeCalculations(int structure_id, DateTime date_start, DateTime date_end, string sort)
        {
            var res = await unitOfWork.application_paymentRepository.DashboardGetEmployeeCalculations(structure_id, date_start, date_end, sort);

            var rowsArray = new List<List<string>>();
            res.ForEach(x =>
            {
                rowsArray.Add(new List<string> {
                    x.number,
                    x.customer,
                    x.address,
                    x.employee,
                    x.all_sum.ToString(),
                    x.wo_nalog.ToString(),
                    x.discount,
                });
            });
            var header = new List<string>
            {
                "Номер заявки", "Заказчик","Адрес", "Исполнитель","Сумма", "Сумма без налога","Есть скидка"
            };

            var fileExcel = new MemoryStream();
            using (var spreadsheetDocument = SpreadsheetDocument.Create(fileExcel, SpreadsheetDocumentType.Workbook))
            {
                WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
                workbookpart.Workbook = new Workbook();
                WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
                worksheetPart.Worksheet = new Worksheet();
                var data = CreateSheetData(header, rowsArray);
                Columns columns = AutoSizeCells(data);
                worksheetPart.Worksheet.Append(columns);
                worksheetPart.Worksheet.Append(data);

                var sheets =
                    spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new Sheets());
                sheets.Append(new Sheet
                {
                    Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart),
                    SheetId = 1,
                    Name = "questionnaire_details"
                });
                workbookpart.Workbook.Save();
            }
            return fileExcel.ToArray();
        }
        public async Task<byte[]> DashboardGetEmployeeCalculationsGroupedExcel(int structure_id, DateTime date_start, DateTime date_end)
        {
            var res = await unitOfWork.application_paymentRepository.DashboardGetEmployeeCalculationsGrouped(structure_id, date_start, date_end);

            var rowsArray = new List<List<string>>();
            res.ForEach(x =>
            {
                rowsArray.Add(new List<string> {
                    x.employee,
                    x.app_count.ToString(),
                    x.all_sum.ToString(),
                    x.wo_nalog.ToString(),
                });
            });
            var header = new List<string>
            {
                "Исполнитель", "Количество заявок","Сумма", "Сумма без налога"
            };

            var fileExcel = new MemoryStream();
            using (var spreadsheetDocument = SpreadsheetDocument.Create(fileExcel, SpreadsheetDocumentType.Workbook))
            {
                WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
                workbookpart.Workbook = new Workbook();
                WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
                worksheetPart.Worksheet = new Worksheet();
                var data = CreateSheetData(header, rowsArray);
                Columns columns = AutoSizeCells(data);
                worksheetPart.Worksheet.Append(columns);
                worksheetPart.Worksheet.Append(data);

                var sheets =
                    spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new Sheets());
                sheets.Append(new Sheet
                {
                    Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart),
                    SheetId = 1,
                    Name = "questionnaire_details"
                });
                workbookpart.Workbook.Save();
            }
            return fileExcel.ToArray();
        }

        private static SheetData CreateSheetData(List<string> sheetHeaders, List<List<string>> sheetData)
        {
            var data = new SheetData();
            var rowId = 0;
            var row = new Row();
            for (var i = 0; i < sheetHeaders.Count; i++)
            {
                InsertHeaderCell(row, sheetHeaders[i], i);
            };

            data.InsertAt(row, rowId++);

            for (var k = 0; k < sheetData.Count; k++)
            {
                row = new Row();
                for (var j = 0; j < sheetData[k].Count; j++)
                {
                    var idx2 = new UInt32Value((uint)rnd.Next(2, 6));
                    var value = sheetData[k][j];
                    InsertTextCell(row, value, j, idx2 == 5 ? null : idx2);
                }

                data.InsertAt(row, rowId++);
            }

            return data;
        }

        private static void InsertHeaderCell(Row row, string content, int cellIndex)
        {
            row.InsertAt(new Cell
            {
                DataType = CellValues.InlineString,
                InlineString = new InlineString { Text = new Text(content) },
                //StyleIndex = 1
            }, cellIndex);
        }

        private static void InsertTextCell(Row row, string content, int cellIndex,
            UInt32Value? styleIndex)
        {
            row.InsertAt(
                new Cell
                {
                    DataType = CellValues.InlineString,
                    InlineString = new InlineString { Text = new Text(content) },
                    //StyleIndex = styleIndex
                }, cellIndex);
        }

        private static Columns AutoSizeCells(SheetData sheetData)
        {
            var maxColWidth = GetMaxCharacterWidth(sheetData);
            var columns = new Columns();
            double maxWidth = 7;
            foreach (var item in maxColWidth)
            {
                var width = Math.Truncate((item.Value * maxWidth + 5) / maxWidth * 256) / 256;
                var col = new Column
                {
                    BestFit = true,
                    Min = (uint)(item.Key + 1),
                    Max = (uint)(item.Key + 1),
                    CustomWidth = true,
                    Width = (DoubleValue)width
                };
                columns.Append(col);
            }

            return columns;
        }
        private static Dictionary<int, int> GetMaxCharacterWidth(SheetData sheetData)
        {
            var maxColWidth = new Dictionary<int, int>();
            var rows = sheetData.Elements<Row>();
            foreach (var r in rows)
            {
                var cells = r.Elements<Cell>().ToArray();
                for (var i = 0; i < cells.Length; i++)
                {
                    var cell = cells[i];
                    var cellValue = cell.CellValue == null ? cell.InnerText : cell.CellValue.InnerText;
                    var cellTextLength = cellValue.Length;

                    if (maxColWidth.ContainsKey(i))
                    {
                        var current = maxColWidth[i];
                        if (cellTextLength > current) maxColWidth[i] = cellTextLength;
                    }
                    else
                    {
                        maxColWidth.Add(i, cellTextLength);
                    }
                }
            }

            return maxColWidth;
        }
    }
}
