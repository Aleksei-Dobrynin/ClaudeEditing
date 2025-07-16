using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkflowTaskTemplateController : ControllerBase
    {
        private readonly WorkflowTaskTemplateUseCases _workflowTaskTemplateUseCases;

        public WorkflowTaskTemplateController(WorkflowTaskTemplateUseCases workflowTaskTemplateUseCases)
        {
            _workflowTaskTemplateUseCases = workflowTaskTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _workflowTaskTemplateUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _workflowTaskTemplateUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidWorkflow")]
        public async Task<IActionResult> GetByidWorkflow(int idWorkflow)
        {
            var response = await _workflowTaskTemplateUseCases.GetByidWorkflow(idWorkflow);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _workflowTaskTemplateUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateWorkflowTaskTemplateRequest requestDto)
        {
            var request = new Domain.Entities.WorkflowTaskTemplate
            {
                workflow_id = requestDto.workflow_id,
                name = requestDto.name,
                order = requestDto.order,
                is_active = requestDto.is_active,
                is_required = requestDto.is_required,
                description = requestDto.description,
                structure_id = requestDto.structure_id,
                type_id = requestDto.type_id,
            };
            var response = await _workflowTaskTemplateUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateWorkflowTaskTemplateRequest requestDto)
        {
            var request = new Domain.Entities.WorkflowTaskTemplate
            {
                id = requestDto.id,
                workflow_id = requestDto.workflow_id,
                name = requestDto.name,
                order = requestDto.order,
                is_active = requestDto.is_active,
                is_required = requestDto.is_required,
                description = requestDto.description,
                structure_id = requestDto.structure_id,
                type_id = requestDto.type_id,
            };
            var response = await _workflowTaskTemplateUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _workflowTaskTemplateUseCases.Delete(id);
            return Ok();
        }
    }
}
