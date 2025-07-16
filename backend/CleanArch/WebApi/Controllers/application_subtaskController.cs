using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using static WebApi.Controllers.application_taskController;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_subtaskController : ControllerBase
    {
        private readonly application_subtaskUseCases _application_subtaskUseCases;

        public application_subtaskController(application_subtaskUseCases application_subtaskUseCases)
        {
            _application_subtaskUseCases = application_subtaskUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_subtaskUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_subtaskUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }


        [HttpPost]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(ChangeSubTaskStatus model)
        {
            var response = await _application_subtaskUseCases.ChangeStatus(model.subtask_id, model.status_id);
            return Ok(response);
        }
        
        public class ChangeSubTaskStatus
        {
            public int subtask_id { get; set; }
            public int status_id { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_subtaskRequest requestDto)
        {
            var request = new Domain.Entities.application_subtask
            {
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                subtask_template_id = requestDto.subtask_template_id,
                name = requestDto.name,
                status_id = requestDto.status_id,
                progress = requestDto.progress,
                application_task_id = requestDto.application_task_id,
                description = requestDto.description,
                created_at = requestDto.created_at,
                type_id = requestDto.type_id,
                assignees = requestDto.assignees,
            };
            var response = await _application_subtaskUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_subtaskRequest requestDto)
        {
            var request = new Domain.Entities.application_subtask
            {
                id = requestDto.id,
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                subtask_template_id = requestDto.subtask_template_id,
                name = requestDto.name,
                status_id = requestDto.status_id,
                progress = requestDto.progress,
                application_task_id = requestDto.application_task_id,
                description = requestDto.description,
                created_at = requestDto.created_at,
                type_id = requestDto.type_id,
                assignees = requestDto.assignees,
            };
            var response = await _application_subtaskUseCases.Update(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _application_subtaskUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_subtaskUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBysubtask_template_id")]
        public async Task<IActionResult> GetBysubtask_template_id(int subtask_template_id)
        {
            var response = await _application_subtaskUseCases.GetBysubtask_template_id(subtask_template_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBystatus_id")]
        public async Task<IActionResult> GetBystatus_id(int status_id)
        {
            var response = await _application_subtaskUseCases.GetBystatus_id(status_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByapplication_task_id")]
        public async Task<IActionResult> GetByapplication_task_id(int application_task_id)
        {
            var response = await _application_subtaskUseCases.GetByapplication_task_id(application_task_id);
            return Ok(response);
        }
        

    }
}
