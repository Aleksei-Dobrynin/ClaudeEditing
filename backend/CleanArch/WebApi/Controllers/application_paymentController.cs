using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_paymentController : ControllerBase
    {
        private readonly application_paymentUseCases _application_paymentUseCases;
        private readonly ServicePriceUseCase _servicePriceUseCase;
        private readonly FileUseCases _fileUseCases;
        private readonly S_DocumentTemplateUseCases _documentTemplateUseCases;
        
        public application_paymentController(application_paymentUseCases application_paymentUseCases, 
            FileUseCases fileUseCases, 
            ServicePriceUseCase servicePriceUseCase,
            S_DocumentTemplateUseCases documentTemplateUseCases)
        {
            _application_paymentUseCases = application_paymentUseCases;
            _fileUseCases = fileUseCases;
            _servicePriceUseCase = servicePriceUseCase;
            _documentTemplateUseCases = documentTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_paymentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_paymentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetPaginatedByParam")]
        public async Task<IActionResult> GetPaginatedByParam(GetSumRequest model)
        {
            var response = await _application_paymentUseCases.GetPagniatedByParam(model.dateStart, model.dateEnd, model.structures_id);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Createapplication_paymentRequest requestDto)
        {
            
            var request = new Domain.Entities.application_payment
            {                
                application_id = requestDto.application_id,
                description = requestDto.description,
                sum = requestDto.sum,
                structure_id = requestDto.structure_id,
                sum_wo_discount = requestDto.sum_wo_discount,
                discount_percentage = requestDto.discount_percentage,
                discount_value = requestDto.discount_value,
                reason = requestDto.reason,
                file_id = requestDto.file_id,
                nds = requestDto.nds,
                nds_value = requestDto.nds_value,
                nsp = requestDto.nsp,
                nsp_value = requestDto.nsp_value,
                head_structure_id = requestDto.head_structure_id,
                implementer_id = requestDto.implementer_id,
                idTask = requestDto.idTask,
            };

            if (requestDto.selectedServicePrice != null && requestDto.selectedServicePrice > 0)
            {
                var servicePrice = await _servicePriceUseCase.GetOneByID(requestDto.selectedServicePrice.Value);
                var parametrs = new Dictionary<string, object>
                {
                    { "head_structure_id", requestDto.head_structure_id },
                    { "implementer_id", requestDto.implementer_id },
                    { "application_id", requestDto.application_id },
                    { "structure_id", requestDto.structure_id },
                    { "sum", requestDto.sum },
                    { "sum_wo_discount", requestDto.sum_wo_discount },
                    { "discount_percentage", requestDto.discount_percentage },
                    { "discount_value", requestDto.discount_value },
                    { "reason", requestDto.reason },
                    { "nds", requestDto.nds },
                    { "nds_value", requestDto.nds_value },
                    { "nsp", requestDto.nsp },
                    { "nsp_value", requestDto.nsp_value },
                };
                var sDocumentTemplate = await _documentTemplateUseCases.GetOne(servicePrice.document_template_id);
                var filledDocument = await _documentTemplateUseCases.GetFilledDocumentHtml(servicePrice.document_template_id, requestDto.selectedLang, parametrs);
                var pdfFile = await _fileUseCases.HtmlToFile(filledDocument.Value);
                if (pdfFile == null) return null;

                var stream = new MemoryStream(pdfFile.body);
                IFormFile formFile = new FormFile(stream, 0, stream.Length, "file", sDocumentTemplate.name)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "application/octet-stream"
                };
                requestDto.document.file = formFile;
                requestDto.document.name = sDocumentTemplate.name;
            }
            
            if (requestDto?.document?.file != null)
            {
                byte[] fileBytes = null;
                if (requestDto.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    requestDto.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                request.document = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = requestDto.document.name,
                };
            }
            
            var response = await _application_paymentUseCases.Create(request);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("ApplicationTemplate")]
        public async Task<IActionResult> ApplicationTemplate([FromForm] Createapplication_paymentRequest requestDto)
        {
            
            var request = new Domain.Entities.application_payment
            {                
                application_id = requestDto.application_id,
                description = requestDto.description,
                sum = requestDto.sum,
                structure_id = requestDto.structure_id,
                sum_wo_discount = requestDto.sum_wo_discount,
                discount_percentage = requestDto.discount_percentage,
                discount_value = requestDto.discount_value,
                reason = requestDto.reason,
                file_id = requestDto.file_id,
                nds = requestDto.nds,
                nds_value = requestDto.nds_value,
                nsp = requestDto.nsp,
                nsp_value = requestDto.nsp_value,
                head_structure_id = requestDto.head_structure_id,
                implementer_id = requestDto.implementer_id,
                idTask = requestDto.idTask,
            };
            var servicePrice = await _servicePriceUseCase.GetOneByID(requestDto.selectedServicePrice.Value);
            var parametrs = new Dictionary<string, object>
            {
                { "head_structure_id", requestDto.head_structure_id },
                { "implementer_id", requestDto.implementer_id },
                { "application_id", requestDto.application_id },
                { "structure_id", requestDto.structure_id },
                { "sum", requestDto.sum },
                { "sum_wo_discount", requestDto.sum_wo_discount },
                { "discount_percentage", requestDto.discount_percentage },
                { "discount_value", requestDto.discount_value },
                { "reason", requestDto.reason },
                { "nds", requestDto.nds },
                { "nds_value", requestDto.nds_value },
                { "nsp", requestDto.nsp },
                { "nsp_value", requestDto.nsp_value },
            };
            var sDocumentTemplate = await _documentTemplateUseCases.GetOne(servicePrice.document_template_id);
            var filledDocument = await _documentTemplateUseCases.GetFilledDocumentHtml(servicePrice.document_template_id, requestDto.selectedLang, parametrs);
            return Ok(filledDocument.Value);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromForm] Updateapplication_paymentRequest requestDto)
        {
            var request = new Domain.Entities.application_payment
            {
                id = requestDto.id,
                
                application_id = requestDto.application_id,
                description = requestDto.description,
                sum = requestDto.sum,
                structure_id = requestDto.structure_id,
                sum_wo_discount = requestDto.sum_wo_discount,
                discount_percentage = requestDto.discount_percentage,
                discount_value = requestDto.discount_value,
                reason = requestDto.reason,
                file_id = requestDto.file_id,
                nds = requestDto.nds,
                nds_value = requestDto.nds_value,
                nsp = requestDto.nsp,
                nsp_value = requestDto.nsp_value,
                head_structure_id = requestDto.head_structure_id,
                implementer_id = requestDto.implementer_id,
                idTask = requestDto.idTask,
            };
            
            if (requestDto?.document?.file != null)
            {
                byte[] fileBytes = null;
                if (requestDto.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    requestDto.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                request.document = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = requestDto.document.name,
                };
            }
            
            var response = await _application_paymentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id, [FromBody] DeletePaymentRequest request)
        {
            var response = await _application_paymentUseCases.Delete(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_paymentUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_paymentUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBystructure_id")]
        public async Task<IActionResult> GetBystructure_id(int structure_id)
        {
            var response = await _application_paymentUseCases.GetBystructure_id(structure_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetPrintDocument")]
        public async Task<IActionResult> GetPrintDocument(int application_id)
        {
            var response = await _application_paymentUseCases.GetPrintDocument(application_id);
            return ActionResultHelper.FromResult(response);
        }
        
        [HttpGet]
        [Route("GetApplicationSumByID")]
        public async Task<IActionResult> GetApplicationSumByID(int id)
        {
            var response = await _application_paymentUseCases.GetApplicationSumByID(id);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("SaveApplicationTotalSum")]
        public async Task<IActionResult> SaveApplicationTotalSum(SaveDiscountRequest request)
        {
            var response = await _application_paymentUseCases.SaveApplicationTotalSum(request);
            return Ok(response);
        }
        [HttpGet]
        [Route("DashboardGetEmployeeCalculations")]
        public async Task<IActionResult> DashboardGetEmployeeCalculations(int structure_id, string date_start, string date_end, string sort)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _application_paymentUseCases.DashboardGetEmployeeCalculations(structure_id, dateStart, dateEnd, sort);
            return Ok(response);
        }
        [HttpGet]
        [Route("DashboardGetEmployeeCalculationsGrouped")]
        public async Task<IActionResult> DashboardGetEmployeeCalculationsGrouped(int structure_id, string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _application_paymentUseCases.DashboardGetEmployeeCalculationsGrouped(structure_id, dateStart, dateEnd);
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("DashboardGetEmployeeCalculationsExcel")]
        public async Task<IActionResult> DashboardGetEmployeeCalculationsExcel(int structure_id, string date_start, string date_end, string sort)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var doc = await _application_paymentUseCases.GetEmployeeCalculations(structure_id, dateStart, dateEnd, sort);
            if (doc == null)
            {
                return NoContent();
            }
            return File(doc, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report");
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("DashboardGetEmployeeCalculationsGroupedExcel")]
        public async Task<IActionResult> DashboardGetEmployeeCalculationsGroupedExcel(int structure_id, string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var doc = await _application_paymentUseCases.DashboardGetEmployeeCalculationsGroupedExcel(structure_id, dateStart, dateEnd);
            if (doc == null)
            {
                return NoContent();
            }
            return File(doc, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report");
        }
    }
}
