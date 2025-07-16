using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerDiscountController : ControllerBase
    {
        private readonly CustomerDiscountUseCases _CustomerDiscountUseCases;

        public CustomerDiscountController(CustomerDiscountUseCases CustomerDiscountUseCases)
        {
            _CustomerDiscountUseCases = CustomerDiscountUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _CustomerDiscountUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _CustomerDiscountUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetOneByIdApplication")]
        public async Task<IActionResult> GetOneByIdApplication(int idApplication)
        {
            var response = await _CustomerDiscountUseCases.GetOneByIdApplication(idApplication);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _CustomerDiscountUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateCustomerDiscountRequest requestDto)
        {
            var request = new Domain.Entities.CustomerDiscount
            {
               pin_customer = requestDto.pin_customer,
               description = requestDto.description,
            };
            var response = await _CustomerDiscountUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCustomerDiscountRequest requestDto)
        {
            var request = new Domain.Entities.CustomerDiscount
            {
               id = requestDto.id,
               pin_customer = requestDto.pin_customer,
               description = requestDto.description,
            };
            var response = await _CustomerDiscountUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _CustomerDiscountUseCases.Delete(id);
            return Ok();
        }
    }
}
