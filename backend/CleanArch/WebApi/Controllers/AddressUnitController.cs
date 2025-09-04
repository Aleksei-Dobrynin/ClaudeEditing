using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AddressUnitController : ControllerBase
    {
        private readonly AddressUnitUseCases _addressunitUseCases;

        public AddressUnitController(AddressUnitUseCases addressunitUseCases)
        {
            _addressunitUseCases = addressunitUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _addressunitUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _addressunitUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _addressunitUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateAddressUnitRequest requestDto)
        {
            var request = new Domain.Entities.AddressUnit
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
                type_id = requestDto.type_id,
                expired = requestDto.expired,
                remote_id = requestDto.remote_id,
                parent_id = requestDto.parent_id
            };
            var response = await _addressunitUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateAddressUnitRequest requestDto)
        {
            var request = new Domain.Entities.AddressUnit
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
                type_id = requestDto.type_id,
                expired = requestDto.expired,
                remote_id = requestDto.remote_id,
                parent_id = requestDto.parent_id
            };
            var response = await _addressunitUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _addressunitUseCases.Delete(id);
            return Ok();
        }
    }
}