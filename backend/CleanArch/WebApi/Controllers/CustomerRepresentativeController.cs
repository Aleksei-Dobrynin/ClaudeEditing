using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerRepresentativeController : ControllerBase
    {
        private readonly CustomerRepresentativeUseCases _customerRepresentativeUseCases;

        public CustomerRepresentativeController(CustomerRepresentativeUseCases customerRepresentativeUseCases)
        {
            _customerRepresentativeUseCases = customerRepresentativeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _customerRepresentativeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _customerRepresentativeUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidCustomer")]
        public async Task<IActionResult> GetByidCustomer(int idCustomer)
        {
            var response = await _customerRepresentativeUseCases.GetByidCustomer(idCustomer);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _customerRepresentativeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateCustomerRepresentativeRequest requestDto)
        {
            var request = new Domain.Entities.CustomerRepresentative
            {
                customer_id = requestDto.customer_id,
                last_name = requestDto.last_name,
                first_name = requestDto.first_name,
                second_name = requestDto.second_name,
                date_start = requestDto.date_start,
                pin = requestDto.pin,
                date_document = requestDto.date_document,
                date_end = requestDto.date_end,
                notary_number = requestDto.notary_number,
                requisites = requestDto.requisites,
                is_included_to_agreement = requestDto.is_included_to_agreement,
                contact = requestDto.contact
            };
            var response = await _customerRepresentativeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCustomerRepresentativeRequest requestDto)
        {
            var request = new Domain.Entities.CustomerRepresentative
            {
                id = requestDto.id,
                customer_id = requestDto.customer_id,
                last_name = requestDto.last_name,
                first_name = requestDto.first_name,
                second_name = requestDto.second_name,
                date_document = requestDto.date_document,
                date_start = requestDto.date_start,
                pin = requestDto.pin,
                date_end = requestDto.date_end,
                notary_number = requestDto.notary_number,
                requisites = requestDto.requisites,
                is_included_to_agreement = requestDto.is_included_to_agreement,
                contact = requestDto.contact
            };
            var response = await _customerRepresentativeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _customerRepresentativeUseCases.Delete(id);
            return Ok();
        }
    }
}
