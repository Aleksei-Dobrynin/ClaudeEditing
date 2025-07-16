using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class legal_registry_statusController : ControllerBase
    {
        private readonly legal_registry_statusUseCases _legal_registry_statusUseCases;

        public legal_registry_statusController(legal_registry_statusUseCases legal_registry_statusUseCases)
        {
            _legal_registry_statusUseCases = legal_registry_statusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _legal_registry_statusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _legal_registry_statusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createlegal_registry_statusRequest requestDto)
        {
            var request = new Domain.Entities.legal_registry_status
            {
                
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
                name_kg = requestDto.name_kg,
            };
            var response = await _legal_registry_statusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatelegal_registry_statusRequest requestDto)
        {
            var request = new Domain.Entities.legal_registry_status
            {
                id = requestDto.id,
                
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
                name_kg = requestDto.name_kg,
            };
            var response = await _legal_registry_statusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _legal_registry_statusUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _legal_registry_statusUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
