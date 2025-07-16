using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class archirecture_roadController : ControllerBase
    {
        private readonly archirecture_roadUseCases _archirecture_roadUseCases;

        public archirecture_roadController(archirecture_roadUseCases archirecture_roadUseCases)
        {
            _archirecture_roadUseCases = archirecture_roadUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archirecture_roadUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archirecture_roadUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarchirecture_roadRequest requestDto)
        {
            var request = new Domain.Entities.archirecture_road
            {

                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                rule_expression = requestDto.rule_expression,
                description = requestDto.description,
                validation_url = requestDto.validation_url,
                post_function_url = requestDto.post_function_url,
                is_active = requestDto.is_active,
                from_status_id = requestDto.from_status_id,
                to_status_id = requestDto.to_status_id,
                created_at = requestDto.created_at,
            };
            var response = await _archirecture_roadUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearchirecture_roadRequest requestDto)
        {
            var request = new Domain.Entities.archirecture_road
            {
                id = requestDto.id,

                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                rule_expression = requestDto.rule_expression,
                description = requestDto.description,
                validation_url = requestDto.validation_url,
                post_function_url = requestDto.post_function_url,
                is_active = requestDto.is_active,
                from_status_id = requestDto.from_status_id,
                to_status_id = requestDto.to_status_id,
                created_at = requestDto.created_at,
            };
            var response = await _archirecture_roadUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _archirecture_roadUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _archirecture_roadUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByfrom_status_id")]
        public async Task<IActionResult> GetByfrom_status_id(int from_status_id)
        {
            var response = await _archirecture_roadUseCases.GetByfrom_status_id(from_status_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByto_status_id")]
        public async Task<IActionResult> GetByto_status_id(int to_status_id)
        {
            var response = await _archirecture_roadUseCases.GetByto_status_id(to_status_id);
            return Ok(response);
        }
        

    }
}
