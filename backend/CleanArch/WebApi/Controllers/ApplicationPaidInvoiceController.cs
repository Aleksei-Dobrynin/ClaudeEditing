using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationPaidInvoiceController : ControllerBase
    {
        private readonly ApplicationPaidInvoiceUseCases _applicationPaidInvoiceUseCases;

        public ApplicationPaidInvoiceController(ApplicationPaidInvoiceUseCases applicationPaidInvoiceUseCases)
        {
            _applicationPaidInvoiceUseCases = applicationPaidInvoiceUseCases;
        }

        [HttpGet]
        [Route("GetOneByIDApplication")]
        public async Task<IActionResult> GetOneByIDApplication(int idApplication)
        {
            var response = await _applicationPaidInvoiceUseCases.GetOneByIDApplication(idApplication);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByApplicationGuid")]
        public async Task<IActionResult> GetByApplicationGuid(string guid)
        {
            var response = await _applicationPaidInvoiceUseCases.GetByApplicationGuid(guid);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetApplicationWithTaxAndDateRange")]
        public async Task<IActionResult> GetApplicationWithTaxAndDateRange( DateTime startDate, DateTime endDate)
        {
            var response = await _applicationPaidInvoiceUseCases.GetApplicationWithTaxAndDateRange(startDate,  endDate);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_paid_invoiceRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationPaidInvoice
            {

                date = requestDto.date,
                payment_identifier = requestDto.payment_identifier,
                sum = requestDto.sum,
                application_id = requestDto.application_id,
                bank_identifier = requestDto.bank_identifier,
                mbank = requestDto.mbank,
                number = requestDto.number,
            };
            var response = await _applicationPaidInvoiceUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_paid_invoiceRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationPaidInvoice
            {
                id = requestDto.id,

                date = requestDto.date,
                payment_identifier = requestDto.payment_identifier,
                sum = requestDto.sum,
                application_id = requestDto.application_id,
                bank_identifier = requestDto.bank_identifier,
            };
            var response = await _applicationPaidInvoiceUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _applicationPaidInvoiceUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _applicationPaidInvoiceUseCases.GetOne(id);
            return Ok(response);
        } 
        
        [HttpGet]
        [Route("GetPaidInvoices")]
        public async Task<IActionResult> GetPaidInvoices(DateTime dateStart, DateTime dateEnd, string? number, [FromQuery] int[]? structures_ids)
        {
            var response = await _applicationPaidInvoiceUseCases.GetPaidInvoices(dateStart, dateEnd, number, structures_ids);
            return Ok(response);
        }
    }
}
