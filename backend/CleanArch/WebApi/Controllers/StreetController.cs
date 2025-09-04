using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StreetController : ControllerBase
    {
        private readonly StreetUseCases _streetUseCases;

        public StreetController(StreetUseCases streetUseCases)
        {
            _streetUseCases = streetUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _streetUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _streetUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _streetUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStreetRequest requestDto)
        {
            var request = new Domain.Entities.Street
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                expired = requestDto.expired,
                street_type_id = requestDto.street_type_id,
                address_unit_id = requestDto.address_unit_id,
                remote_id = requestDto.remote_id,
            };
            var response = await _streetUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateStreetRequest requestDto)
        {
            var request = new Domain.Entities.Street
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                expired = requestDto.expired,
                street_type_id = requestDto.street_type_id,
                address_unit_id = requestDto.address_unit_id,
                remote_id = requestDto.remote_id,
            };
            var response = await _streetUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _streetUseCases.Delete(id);
            return Ok();
        }
    }
}