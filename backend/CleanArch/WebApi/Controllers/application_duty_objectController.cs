using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_duty_objectController : ControllerBase
    {
        private readonly application_duty_objectUseCases _application_duty_objectUseCases;

        public application_duty_objectController(application_duty_objectUseCases application_duty_objectUseCases)
        {
            _application_duty_objectUseCases = application_duty_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_duty_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_duty_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_duty_objectRequest requestDto)
        {
            var request = new Domain.Entities.application_duty_object
            {
                
                dutyplan_object_id = requestDto.dutyplan_object_id,
                application_id = requestDto.application_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _application_duty_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_duty_objectRequest requestDto)
        {
            var request = new Domain.Entities.application_duty_object
            {
                id = requestDto.id,
                
                dutyplan_object_id = requestDto.dutyplan_object_id,
                application_id = requestDto.application_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _application_duty_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_duty_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_duty_objectUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBydutyplan_object_id")]
        public async Task<IActionResult> GetBydutyplan_object_id(int dutyplan_object_id)
        {
            var response = await _application_duty_objectUseCases.GetBydutyplan_object_id(dutyplan_object_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_duty_objectUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        

    }
}
