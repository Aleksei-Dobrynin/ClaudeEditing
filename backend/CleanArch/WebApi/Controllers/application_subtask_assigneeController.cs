using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_subtask_assigneeController : ControllerBase
    {
        private readonly application_subtask_assigneeUseCases _application_subtask_assigneeUseCases;

        public application_subtask_assigneeController(application_subtask_assigneeUseCases application_subtask_assigneeUseCases)
        {
            _application_subtask_assigneeUseCases = application_subtask_assigneeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_subtask_assigneeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_subtask_assigneeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_subtask_assigneeRequest requestDto)
        {
            var request = new Domain.Entities.application_subtask_assignee
            {
                
                structure_employee_id = requestDto.structure_employee_id,
                application_subtask_id = requestDto.application_subtask_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _application_subtask_assigneeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_subtask_assigneeRequest requestDto)
        {
            var request = new Domain.Entities.application_subtask_assignee
            {
                id = requestDto.id,
                
                structure_employee_id = requestDto.structure_employee_id,
                application_subtask_id = requestDto.application_subtask_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _application_subtask_assigneeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_subtask_assigneeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_subtask_assigneeUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystructure_employee_id")]
        public async Task<IActionResult> GetBystructure_employee_id(int structure_employee_id)
        {
            var response = await _application_subtask_assigneeUseCases.GetBystructure_employee_id(structure_employee_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByapplication_subtask_id")]
        public async Task<IActionResult> GetByapplication_subtask_id(int application_subtask_id)
        {
            var response = await _application_subtask_assigneeUseCases.GetByapplication_subtask_id(application_subtask_id);
            return Ok(response);
        }
        

    }
}
