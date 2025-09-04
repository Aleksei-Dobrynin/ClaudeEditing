using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AddressUnitTypeController : ControllerBase
    {
        private readonly AddressUnitTypeUseCases _addressunittypeUseCases;

        public AddressUnitTypeController(AddressUnitTypeUseCases addressunittypeUseCases)
        {
            _addressunittypeUseCases = addressunittypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _addressunittypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _addressunittypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _addressunittypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateAddressUnitTypeRequest requestDto)
        {
            var request = new Domain.Entities.AddressUnitType
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
                name_short = requestDto.name_short,
                name_kg_short = requestDto.name_kg_short,
                level = requestDto.level,
            };
            var response = await _addressunittypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateAddressUnitTypeRequest requestDto)
        {
            var request = new Domain.Entities.AddressUnitType
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
                name_short = requestDto.name_short,
                name_kg_short = requestDto.name_kg_short,
                level = requestDto.level,
            };
            var response = await _addressunittypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _addressunittypeUseCases.Delete(id);
            return Ok();
        }
    }
}