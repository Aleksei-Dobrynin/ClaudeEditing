using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class architecture_statusController : ControllerBase
    {
        private readonly architecture_statusUseCases _architecture_statusUseCases;

        public architecture_statusController(architecture_statusUseCases architecture_statusUseCases)
        {
            _architecture_statusUseCases = architecture_statusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _architecture_statusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _architecture_statusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarchitecture_statusRequest requestDto)
        {
            var request = new Domain.Entities.architecture_status
            {
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                created_at = requestDto.created_at,
            };
            var response = await _architecture_statusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearchitecture_statusRequest requestDto)
        {
            var request = new Domain.Entities.architecture_status
            {
                id = requestDto.id,
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                created_at = requestDto.created_at,
            };
            var response = await _architecture_statusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _architecture_statusUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _architecture_statusUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
