using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkflowSubtaskTemplateController : ControllerBase
    {
        private readonly WorkflowSubtaskTemplateUseCases _workflowSubtaskTemplateUseCases;

        public WorkflowSubtaskTemplateController(WorkflowSubtaskTemplateUseCases workflowSubtaskTemplateUseCases)
        {
            _workflowSubtaskTemplateUseCases = workflowSubtaskTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _workflowSubtaskTemplateUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _workflowSubtaskTemplateUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidWorkflowTaskTemplate")]
        public async Task<IActionResult> GetByidWorkflowTaskTemplate(int idWorkflowTaskTemplate)
        {
            var response = await _workflowSubtaskTemplateUseCases.GetByidWorkflowTaskTemplate(idWorkflowTaskTemplate);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _workflowSubtaskTemplateUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateWorkflowSubtaskTemplateRequest requestDto)
        {
            var request = new Domain.Entities.WorkflowSubtaskTemplate
            {
                name = requestDto.name,
                description = requestDto.description,
                workflow_task_id = requestDto.workflow_task_id,
                type_id = requestDto.type_id,
            };
            var response = await _workflowSubtaskTemplateUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateWorkflowSubtaskTemplateRequest requestDto)
        {
            var request = new Domain.Entities.WorkflowSubtaskTemplate
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                workflow_task_id = requestDto.workflow_task_id,
                type_id = requestDto.type_id,
            };
            var response = await _workflowSubtaskTemplateUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _workflowSubtaskTemplateUseCases.Delete(id);
            return Ok();
        }
    }
}
