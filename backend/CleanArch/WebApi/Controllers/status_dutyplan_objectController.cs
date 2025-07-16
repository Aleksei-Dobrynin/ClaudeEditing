using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class status_dutyplan_objectController : ControllerBase
    {
        private readonly status_dutyplan_objectUseCases _status_dutyplan_objectUseCases;

        public status_dutyplan_objectController(status_dutyplan_objectUseCases status_dutyplan_objectUseCases)
        {
            _status_dutyplan_objectUseCases = status_dutyplan_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _status_dutyplan_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _status_dutyplan_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstatus_dutyplan_objectRequest requestDto)
        {
            var request = new Domain.Entities.status_dutyplan_object
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
            var response = await _status_dutyplan_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestatus_dutyplan_objectRequest requestDto)
        {
            var request = new Domain.Entities.status_dutyplan_object
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
            var response = await _status_dutyplan_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _status_dutyplan_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _status_dutyplan_objectUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
