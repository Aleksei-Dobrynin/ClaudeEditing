using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerUseCases _customerUseCases;

        public CustomerController(CustomerUseCases customerUseCases)
        {
            _customerUseCases = customerUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _customerUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("BySearch")]
        public async Task<IActionResult> BySearch(string? text)
        {
            var response = await _customerUseCases.GetAllBySearch(text);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _customerUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneByPin")]
        public async Task<IActionResult> GetOneByPin(string pin, int customer_id)
        {
            var response = await _customerUseCases.GetOneByPin(pin, customer_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber, string? orderBy, string? orderType)
        {
            var response = await _customerUseCases.GetPagniated(pageSize, pageNumber, orderBy, orderType);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateCustomerRequest requestDto)
        {
            var request = new Domain.Entities.Customer
            {
                pin = requestDto.pin,
                is_organization = requestDto.is_organization,
                full_name = requestDto.full_name,
                address = requestDto.address,
                director = requestDto.director,
                okpo = requestDto.okpo,
                organization_type_id = requestDto.organization_type_id,
                payment_account = requestDto.payment_account,
                postal_code = requestDto.postal_code,
                ugns = requestDto.ugns,
                bank = requestDto.bank,
                bik = requestDto.bik,
                registration_number = requestDto.registration_number,
                individual_name = requestDto.individual_name,
                individual_secondname = requestDto.individual_secondname,
                individual_surname = requestDto.individual_surname,
                identity_document_type_id = requestDto.identity_document_type_id,
                document_serie = requestDto.document_serie,
                document_date_issue = requestDto.document_date_issue,
                document_whom_issued = requestDto.document_whom_issued,
                sms_1 = requestDto.sms_1,
                sms_2 = requestDto.sms_2,
                email_1 = requestDto.email_1,
                email_2 = requestDto.email_2,
                telegram_1 = requestDto.telegram_1,
                telegram_2 = requestDto.telegram_2,
                customerRepresentatives = requestDto.customerRepresentatives,
            };
            var response = await _customerUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCustomerRequest requestDto)
        {
            var request = new Domain.Entities.Customer
            {
                id = requestDto.id,
                pin = requestDto.pin,
                is_organization = requestDto.is_organization,
                full_name = requestDto.full_name,
                address = requestDto.address,
                director = requestDto.director,
                okpo = requestDto.okpo,
                organization_type_id = requestDto.organization_type_id,
                payment_account = requestDto.payment_account,
                postal_code = requestDto.postal_code,
                ugns = requestDto.ugns,
                bank = requestDto.bank,
                bik = requestDto.bik,
                registration_number = requestDto.registration_number,
                individual_name = requestDto.individual_name,
                individual_secondname = requestDto.individual_secondname,
                individual_surname = requestDto.individual_surname,
                identity_document_type_id = requestDto.identity_document_type_id,
                document_serie = requestDto.document_serie,
                document_date_issue = requestDto.document_date_issue,
                document_whom_issued = requestDto.document_whom_issued,
    };
            var response = await _customerUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _customerUseCases.Delete(id);
            return Ok();
        }
    }
}
