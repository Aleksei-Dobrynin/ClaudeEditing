using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class service_pathController : ControllerBase
    {
        private readonly service_pathUseCases _service_pathUseCases;

        public service_pathController(service_pathUseCases service_pathUseCases)
        {
            _service_pathUseCases = service_pathUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _service_pathUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _service_pathUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createservice_pathRequest requestDto)
        {
            var request = new Domain.Entities.service_path
            {
                
                updated_by = requestDto.updated_by,
                service_id = requestDto.service_id,
                name = requestDto.name,
                description = requestDto.description,
                is_default = requestDto.is_default,
                is_active = requestDto.is_active,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
            };
            var response = await _service_pathUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateservice_pathRequest requestDto)
        {
            var request = new Domain.Entities.service_path
            {
                id = requestDto.id,
                
                updated_by = requestDto.updated_by,
                service_id = requestDto.service_id,
                name = requestDto.name,
                description = requestDto.description,
                is_default = requestDto.is_default,
                is_active = requestDto.is_active,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
            };
            var response = await _service_pathUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service_pathUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _service_pathUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByservice_id")]
        public async Task<IActionResult> GetByservice_id(int service_id)
        {
            var response = await _service_pathUseCases.GetByservice_id(service_id);
            return Ok(response);
        }
        

    }
}
