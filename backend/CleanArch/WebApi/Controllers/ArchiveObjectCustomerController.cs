using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveObjectCustomerController : ControllerBase
    {
        private readonly ArchiveObjectCustomerUseCases _ArchiveObjectCustomerUseCases;

        public ArchiveObjectCustomerController(ArchiveObjectCustomerUseCases ArchiveObjectCustomerUseCases)
        {
            _ArchiveObjectCustomerUseCases = ArchiveObjectCustomerUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ArchiveObjectCustomerUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ArchiveObjectCustomerUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateArchiveObjectCustomerRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObjectCustomer
            {
                archive_object_id = requestDto.archive_object_id,
                customer_id = requestDto.customer_id,
                description = requestDto.description,
            };
            var response = await _ArchiveObjectCustomerUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateArchiveObjectCustomerRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObjectCustomer
            {
                id = requestDto.id,
                archive_object_id = requestDto.archive_object_id,
                customer_id = requestDto.customer_id,
                description = requestDto.description,
            };
            var response = await _ArchiveObjectCustomerUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _ArchiveObjectCustomerUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _ArchiveObjectCustomerUseCases.GetOne(id);
            return Ok(response);
        }



    }
}
