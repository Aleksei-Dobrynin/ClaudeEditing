using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class customers_for_archive_objectController : ControllerBase
    {
        private readonly customers_for_archive_objectUseCases _customers_for_archive_objectUseCases;

        public customers_for_archive_objectController(customers_for_archive_objectUseCases customers_for_archive_objectUseCases)
        {
            _customers_for_archive_objectUseCases = customers_for_archive_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _customers_for_archive_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetCustomersForArchiveObjects")]
        public async Task<IActionResult> GetCustomersForArchiveObjects()
        {
            var response = await _customers_for_archive_objectUseCases.GetCustomersForArchiveObjects();
            return Ok(response);
        }


        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _customers_for_archive_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByCustomersIdArchiveObject")]
        public async Task<IActionResult> GetByCustomersIdArchiveObject(int ArchiveObject_id)
        {
            var response = await _customers_for_archive_objectUseCases.GetByCustomersIdArchiveObject(ArchiveObject_id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(Createcustomers_for_archive_objectRequest requestDto)
        {
            var request = new Domain.Entities.customers_for_archive_object
            {
                full_name = requestDto.full_name,
                pin = requestDto.pin,
                address = requestDto.address,
                is_organization = requestDto.is_organization,
                description = requestDto.description,
                dp_outgoing_number = requestDto.dp_outgoing_number
            };
            var response = await _customers_for_archive_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatecustomers_for_archive_objectRequest requestDto)
        {
            var request = new Domain.Entities.customers_for_archive_object
            {
                id = requestDto.id,
                pin = requestDto.pin,
                address = requestDto.address,
                is_organization = requestDto.is_organization,
                description = requestDto.description,
                dp_outgoing_number = requestDto.dp_outgoing_number
            };
            var response = await _customers_for_archive_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _customers_for_archive_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _customers_for_archive_objectUseCases.GetOne(id);
            return Ok(response);
        }



    }
}
