using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StreetTypeController : ControllerBase
    {
        private readonly StreetTypeUseCases _streettypeUseCases;

        public StreetTypeController(StreetTypeUseCases streettypeUseCases)
        {
            _streettypeUseCases = streettypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _streettypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _streettypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _streettypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStreetTypeRequest requestDto)
        {
            var request = new Domain.Entities.StreetType
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
            };
            var response = await _streettypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateStreetTypeRequest requestDto)
        {
            var request = new Domain.Entities.StreetType
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
            };
            var response = await _streettypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _streettypeUseCases.Delete(id);
            return Ok();
        }
    }
}