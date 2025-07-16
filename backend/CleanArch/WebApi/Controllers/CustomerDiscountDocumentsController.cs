using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerDiscountDocumentsController : ControllerBase
    {
        private readonly CustomerDiscountDocumentsUseCases _CustomerDiscountDocumentsUseCases;

        public CustomerDiscountDocumentsController(CustomerDiscountDocumentsUseCases CustomerDiscountDocumentsUseCases)
        {
            _CustomerDiscountDocumentsUseCases = CustomerDiscountDocumentsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _CustomerDiscountDocumentsUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByIdCustomer")]
        public async Task<IActionResult> GetByIdCustomer(int idCustomer)
        {
            var response = await _CustomerDiscountDocumentsUseCases.GetByIdCustomer(idCustomer);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _CustomerDiscountDocumentsUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _CustomerDiscountDocumentsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateCustomerDiscountDocumentsRequest requestDto)
        {
            var request = new Domain.Entities.CustomerDiscountDocuments
            {
               customer_discount_id = requestDto.customer_discount_id,
               discount_documents_id = requestDto.discount_documents_id,

            };
            var response = await _CustomerDiscountDocumentsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCustomerDiscountDocumentsRequest requestDto)
        {
            var request = new Domain.Entities.CustomerDiscountDocuments
            { 
               id = requestDto.id,
               customer_discount_id = requestDto.customer_discount_id,
               discount_documents_id = requestDto.discount_documents_id,

            };
            var response = await _CustomerDiscountDocumentsUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _CustomerDiscountDocumentsUseCases.Delete(id);
            return Ok();
        }
    }
}
