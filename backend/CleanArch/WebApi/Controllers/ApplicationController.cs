using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities;
using Org.BouncyCastle.Asn1.Ocsp;
using Application.Exceptions;
using static WebApi.Controllers.application_taskController;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationUseCases _applicationUseCases;
        private readonly ApplicationStatusUseCases applicationStatusUseCases;
        private readonly FileUseCases _fileUseCases;
        private readonly customer_contactUseCases _customer_ContactUseCases;

        public ApplicationController(ApplicationUseCases applicationUseCases, FileUseCases fileUseCases, customer_contactUseCases customerContactsUseCases, ApplicationStatusUseCases applicationStatusUseCases)
        {
            _applicationUseCases = applicationUseCases;
            _fileUseCases = fileUseCases;
            _customer_ContactUseCases = customerContactsUseCases;
            this.applicationStatusUseCases = applicationStatusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _applicationUseCases.GetAll();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetNextNumber")]
        public async Task<IActionResult> GetNextNumber()
        {
            var response = await _applicationUseCases.GetNextNumber();
            return Ok(response);
        }



        [HttpGet]
        [AllowAnonymous]
        [Route("GetMyArchiveApplications")]
        public async Task<IActionResult> GetMyArchiveApplications(string pin)
        {
            var response = await _applicationUseCases.GetMyArchiveApplications(pin);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetFromCabinet")]
        public async Task<IActionResult> GetFromCabinet()
        {
            var response = await _applicationUseCases.GetFromCabinet();
            return Ok(response);
        }

        [HttpPost]
        [Route("GetByFilterFromCabinet")]
        public async Task<IActionResult> GetByFilterFromCabinet(PaginationFields model)
        {
            if (model.district_id == 0)
            {
                model.district_id = null;
            }
            var response = await _applicationUseCases.GetByFilterFromCabinet(model);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetCountAppsFromCabinet")]
        public async Task<IActionResult> GetCountAppsFromCabinet()
        {
            var response = await _applicationUseCases.GetCountAppsFromCabinet();
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            //throw new PermissionException("��� �� ����� �� ���", new PermissionExceptionDetails { Code = "test", Role = "d"}, null);
            var response = await _applicationUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetOneByGuid")]
        public async Task<IActionResult> GetOneByGuid(string guid)
        {
            //throw new PermissionException("��� �� ����� �� ���", new PermissionExceptionDetails { Code = "test", Role = "d"}, null);
            var response = await _applicationUseCases.GetOneByGuid(guid);
            return Ok(response);
        }

        [HttpGet]
        [Route("DownloadFileById")]
        public async Task<IActionResult> DownloadFileById(int id)
        {
            var idFile = await _applicationUseCases.GetFileId(id);
            var doc = await _fileUseCases.DownloadDocument(idFile);
            if (doc?.body == null) return NotFound();
            return Ok(File(doc.body, "application/octet-stream", doc.name));
        }

        [HttpPost]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(PaginationFields model)
        {
            if (model.district_id == 0)
            {
                model.district_id = null;
            }
            var response = await _applicationUseCases.GetPagniated(model);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetPaginatedFinPlan")]
        public async Task<IActionResult> GetPaginatedFinPlan(PaginationFields model)
        {
            if (model.district_id == 0)
            {
                model.district_id = null;
            }
            var response = await _applicationUseCases.GetPagniatedFinPlan(model);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationRequest requestDto)
        {
            var request = new Domain.Entities.Application
            {
                registration_date = requestDto.registration_date,
                customer_id = requestDto.customer_id,
                status_id = requestDto.status_id,
                workflow_id = requestDto.workflow_id,
                service_id = requestDto.service_id,
                workflow_task_structure_id = requestDto.workflow_task_structure_id,
                deadline = requestDto.deadline,
                arch_object_id = requestDto.arch_object_id,
                work_description = requestDto.work_description,
                object_tag_id = requestDto.object_tag_id,
                incoming_numbers = requestDto.incoming_numbers,
                outgoing_numbers = requestDto.outgoing_numbers,
                saveWithoutCheck = requestDto.saveWithoutCheck,
            };
            var customer = new Domain.Entities.Customer
            {
                id = requestDto.customer.id,
                pin = requestDto.customer.pin,
                is_organization = requestDto.customer.is_organization,
                full_name = requestDto.customer.full_name,
                address = requestDto.customer.address,
                director = requestDto.customer.director,
                okpo = requestDto.customer.okpo,
                organization_type_id = requestDto.customer.organization_type_id,
                payment_account = requestDto.customer.payment_account,
                postal_code = requestDto.customer.postal_code,
                ugns = requestDto.customer.ugns,
                bank = requestDto.customer.bank,
                bik = requestDto.customer.bik,
                sms_1 = requestDto.customer.sms_1,
                sms_2 = requestDto.customer.sms_2,
                email_1 = requestDto.customer.email_1,
                email_2 = requestDto.customer.email_2,
                registration_number = requestDto.customer.registration_number,
                individual_name = requestDto.customer.individual_name,
                individual_secondname = requestDto.customer.individual_secondname,
                individual_surname = requestDto.customer.individual_surname,
                identity_document_type_id = requestDto.customer.identity_document_type_id,
                document_serie = requestDto.customer.document_serie,
                document_date_issue = requestDto.customer.document_date_issue,
                document_whom_issued = requestDto.customer.document_whom_issued,
                customerRepresentatives = requestDto.customer.customerRepresentatives,
                is_foreign = requestDto.customer.is_foreign,
                foreign_country = requestDto.customer.foreign_country
            };
            request.customer = customer;

            var customerJson = System.Text.Json.JsonSerializer.Serialize(customer);
            //request.customers_info = new List<string> { customerJson };

            var archObjects = requestDto.archObjects.Select(x =>
            new Domain.Entities.ArchObject
            {
                id = x.id,
                address = x.address,
                name = x.name,
                identifier = x.identifier,
                district_id = x.district_id,
                description = x.description,
                tags = x.tags,
                xcoordinate = x.xcoordinate,
                ycoordinate = x.ycoordinate,
            }).ToList();
            request.archObjects = archObjects;

            var response = await _applicationUseCases.Create(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationRequest requestDto)
        {
            var request = new Domain.Entities.Application
            {
                id = requestDto.id,
                registration_date = requestDto.registration_date,
                customer_id = requestDto.customer_id,
                status_id = requestDto.status_id,
                workflow_id = requestDto.workflow_id,
                service_id = requestDto.service_id,
                deadline = requestDto.deadline,
                arch_object_id = requestDto.arch_object_id,
                updated_at = requestDto.updated_at,
                work_description = requestDto.work_description,
                object_tag_id = requestDto.object_tag_id,
                incoming_numbers = requestDto.incoming_numbers,
                outgoing_numbers = requestDto.outgoing_numbers,
            };
            var customer = new Domain.Entities.Customer
            {
                id = requestDto.customer.id,
                pin = requestDto.customer.pin,
                is_organization = requestDto.customer.is_organization,
                full_name = requestDto.customer.full_name,
                address = requestDto.customer.address,
                director = requestDto.customer.director,
                okpo = requestDto.customer.okpo,
                organization_type_id = requestDto.customer.organization_type_id,
                payment_account = requestDto.customer.payment_account,
                postal_code = requestDto.customer.postal_code,
                ugns = requestDto.customer.ugns,
                bank = requestDto.customer.bank,
                bik = requestDto.customer.bik,
                registration_number = requestDto.customer.registration_number,
                individual_name = requestDto.customer.individual_name,
                individual_secondname = requestDto.customer.individual_secondname,
                individual_surname = requestDto.customer.individual_surname,
                identity_document_type_id = requestDto.customer.identity_document_type_id,
                document_serie = requestDto.customer.document_serie,
                document_date_issue = requestDto.customer.document_date_issue,
                document_whom_issued = requestDto.customer.document_whom_issued,
                sms_1 = requestDto.customer.sms_1,
                sms_2 = requestDto.customer.sms_2,
                email_1 = requestDto.customer.email_1,
                email_2 = requestDto.customer.email_2,
                telegram_1 = requestDto.customer.telegram_1,
                telegram_2 = requestDto.customer.telegram_2,
                customerRepresentatives = requestDto.customer.customerRepresentatives,
                is_foreign = requestDto.customer.is_foreign,
                foreign_country = requestDto.customer.foreign_country
            };

            var customerJson = System.Text.Json.JsonSerializer.Serialize(customer);
            //request.customers_info = new List<string> { customerJson };

            var archObjects = requestDto.archObjects.Select(x =>
            new Domain.Entities.ArchObject
            {
                id = x.id,
                address = x.address,
                name = x.name,
                identifier = x.identifier,
                district_id = x.district_id,
                description = x.description,
                tags = x.tags,
                xcoordinate = x.xcoordinate,
                ycoordinate = x.ycoordinate,
            }).ToList();
            request.customer = customer;
            request.archObjects = archObjects;
            var response = await _applicationUseCases.Update(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPost]
        [Route("UpdateApplicationTags")]
        public async Task<IActionResult> UpdateApplicationTags([FromForm] UpdateApplicationTagsRequest model)
        {
            Domain.Entities.File file = null;
            if (model?.document?.file != null)
            {
                byte[] fileBytes = null;
                if (model.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    model.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                file = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = model.document.name,
                };
            }

            await _applicationUseCases.UpdateApplicationTags(model.application_id, model.structure_id, model.structure_tag_id, model.object_tag_id, model.district_id, model.application_square_value, model.application_square_unit_type_id, model.tech_decision_id, file);

            return Ok();
        }
        
        [HttpPost]
        [Route("UpdateApplicationTechTags")]
        public async Task<IActionResult> UpdateApplicationTechTags([FromForm] UpdateApplicationTagsRequest model)
        {
            Domain.Entities.File file = null;
            if (model?.document?.file != null)
            {
                byte[] fileBytes = null;
                if (model.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    model.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                file = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = model.document.name,
                };
            }

            await _applicationUseCases.UpdateApplicationTechTags(model.application_id, model.tech_decision_id, file);

            return Ok();
        }
        
        public class UpdateApplicationTagsRequest
        {
            public int application_id { get; set; }
            public int structure_tag_id { get; set; }
            public int structure_id { get; set; }
            public int object_tag_id { get; set; }
            public int district_id { get; set; }
            public double application_square_value { get; set; }
            public int application_square_unit_type_id { get; set; }
            public int tech_decision_id { get; set; }
            public FileModel? document { get; set; }

        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _applicationUseCases.Delete(id);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetStatusById")]
        public async Task<IActionResult> GetStatusById(int id)
        {
            var response = await _applicationUseCases.GetStatusById(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetForReport")]
        public async Task<IActionResult> GetForReport([FromQuery] bool? isOrg, [FromQuery] int? mount, [FromQuery] int? year, [FromQuery] int? structure)
        {
            var response = await _applicationUseCases.GetForReport(isOrg, mount, year, structure);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetMyApplications")]
        public async Task<IActionResult> GetMyApplications(string? searchField, string? orderBy, string? orderType, int skipItem, int getCountItems, string? codeFilter)
        {
            var response = await _applicationUseCases.GetMyApplications(searchField, orderBy, orderType, skipItem, getCountItems, codeFilter);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetForReportPaginated")]
        public async Task<IActionResult> GetForReportPaginated([FromQuery] bool? isOrg, [FromQuery] int? mount, [FromQuery] int? year, [FromQuery] int? structure, [FromQuery] int pageSize, [FromQuery] int pageNumber, [FromQuery] string orderBy, [FromQuery] string orderType)
        {
            var response = await _applicationUseCases.GetForReportPaginated(isOrg, mount, year, structure, pageSize, pageNumber, orderBy, orderType);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetForPivotDashboard")]
        public async Task<IActionResult> GetForPivotDashboard(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            var response = await _applicationUseCases.GetForPivotDashboard(date_start, date_end, service_id, status_id);
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetForPivotDashboardMyStructure")]
        public async Task<IActionResult> GetForPivotDashboardMyStructure(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            var response = await _applicationUseCases.GetForPivotDashboardMyStructure(date_start, date_end, service_id, status_id);
            return Ok(response);
        }


        [HttpPut]
        [Route("sendDpOutgoingNumber")]
        public async Task<IActionResult> sendDpOutgoingNumber(int application_id, string? dp_outgoing_number)
        {
            var response = await _applicationUseCases.sendDpOutgoingNumber(application_id, dp_outgoing_number);
            return ActionResultHelper.FromResult(response);
        }

        [HttpGet]
        [Route("GetForReestrOtchet")]
        public async Task<IActionResult> GetForReestrOtchet(int year, int month, string status, int structure_id)
        {
            var response = await _applicationUseCases.GetForReestrOtchet(year, month, status, structure_id);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("GetForReestrRealization")]
        public async Task<IActionResult> GetForReestrRealization(ReestrFilter filter)
        {
            var response = await _applicationUseCases.GetForReestrRealization(filter.year, filter.month, filter.status, filter.structure_ids);
            return Ok(response);
        }

        [HttpPost]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(ChangeStatusDto model)
        {
            var response = await _applicationUseCases.ChangeStatus(model.application_id, model.status_id);

            ////TODO id_status 6
            ////TODO it is for presentation. 
            //if (response != 0 && model.status_id == 6)
            //{

            //    var applacation = await _applicationUseCases.GetOneByID(model.application_id);

            //    var contacts = await _customer_ContactUseCases.GetBycustomer_id(applacation.customer_id);
            //    var email = contacts.Where(x => x.type_name == "Email").FirstOrDefault();

            //    if (email != null)
            //    {
            //        var client = new HttpClient();
            //        var n8n_response = await client.GetAsync("https://n8n.tech-demo.su/webhook/1901098f-55f5-4ccd-b556-d78b6345b76d?id=" + model.application_id + "&email=" + email?.value);
            //        if (n8n_response.IsSuccessStatusCode)
            //        {
            //        }
            //    }
            //}


            //var statuses = await applicationStatusUseCases.GetAll();
            //var status = statuses.FirstOrDefault(x => x.id == model.status_id);
            //if (status != null)
            //{
            //    var client2 = new HttpClient();
            //    await client2.GetAsync("https://n8n.tech-demo.su/webhook/testStatus1?id=" + model.application_id + "&name=" + status.name);
            //}



            return ActionResultHelper.FromResult(response); ;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetOneByApplicationCode")]
        public async Task<IActionResult> GetOneByApplicationCode(string code, string contact, long chat_id)
        {
            var response = await _applicationUseCases.GetOneByApplicationCode(code, contact, chat_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("CheckCalucationForApplication")]
        public async Task<IActionResult> CheckCalucationForApplication(int application_id)
        {
            var response = await _applicationUseCases.CheckCalucationForApplication(application_id);
            return Ok(response);
        }        
        
        [HttpGet]
        [AllowAnonymous]
        [Route("SendOutcomingDocs")]
        public async Task<IActionResult> SendOutcomingDocs(int application_id)
        {
            await _applicationUseCases.SendOutcomingDocs(application_id);
            return Ok();
        }

        [HttpPost]
        [Route("SendNotification")]
        public async Task<IActionResult> SendNotification(SendNotificationDto dto)
        {
            var notification = new SendCustomerNotification
            {
                smsNumbers = dto.smsNumbers,
                telegramNumbers = dto.telegramNumbers,
                textSms = dto.textSms,
                textTelegram = dto.textTelegram,
                application_id = dto.application_id,
                customer_id = dto.customer_id,
            };
            var res = await _applicationUseCases.SendNotification(notification);
            return Ok(res);
        }
        
        [HttpPost]
        [Route("Reject")]
        public async Task<IActionResult> Reject(RejectApproveDto model)
        {

            var response = await _applicationUseCases.Reject(model.Uuid, model.Html, model.Number, model.DocumentIds);
            return Ok();
        }
        
        [HttpPost]
        [Route("Approve")]
        public async Task<IActionResult> Approve(RejectApproveDto model)
        {
            var response = await _applicationUseCases.Approve(model.Uuid, model.Number);
            return Ok();
        }
        [HttpGet]
        [Route("GetMyApplication")]
        public async Task<IActionResult> GetMyApplication()
        {
            var response = await _applicationUseCases.GetMyApplication();
            return Ok(response);
        }
        

        public class SendNotificationDto
        {
            public string[] smsNumbers { get; set; }
            public string[] telegramNumbers { get; set; }
            public string textSms { get; set; }
            public string textTelegram { get; set; }
            public int? application_id { get; set; }
            public int? customer_id { get; set; }
        }

        public class ChangeStatusDto
        {
            public int application_id { get; set; }
            public int status_id { get; set; }
        }

        public class ReestrFilter
        {
            public int year { get; set; }
            public int month { get; set; }
            public string status { get; set; }
            public int[]? structure_ids { get; set; }
        }
        
        public class RejectApproveDto
        {
            public string Uuid { get; set; }
            public string? Html { get; set; }    
            public string? Number { get; set; }
            public int[] DocumentIds { get; set; } = Array.Empty<int>();
        }
    }
}
