using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_task_assigneeController : ControllerBase
    {
        private readonly application_task_assigneeUseCases _application_task_assigneeUseCases;

        public application_task_assigneeController(application_task_assigneeUseCases application_task_assigneeUseCases)
        {
            _application_task_assigneeUseCases = application_task_assigneeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_task_assigneeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_task_assigneeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_task_assigneeRequest requestDto)
        {
            var request = new Domain.Entities.application_task_assignee
            {
                
                structure_employee_id = requestDto.structure_employee_id,
                application_task_id = requestDto.application_task_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _application_task_assigneeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_task_assigneeRequest requestDto)
        {
            var request = new Domain.Entities.application_task_assignee
            {
                id = requestDto.id,
                
                structure_employee_id = requestDto.structure_employee_id,
                application_task_id = requestDto.application_task_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _application_task_assigneeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _application_task_assigneeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_task_assigneeUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByapplication_task_id")]
        public async Task<IActionResult> GetByapplication_task_id(int application_task_id)
        {
            var response = await _application_task_assigneeUseCases.GetByapplication_task_id(application_task_id);
            return Ok(response);
        }
        

    }
}
