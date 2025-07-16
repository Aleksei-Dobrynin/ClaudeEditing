using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkflowTaskDependencyController : ControllerBase
    {
        private readonly WorkflowTaskDependencyUseCases _workflowTaskDependencyUseCases;

        public WorkflowTaskDependencyController(WorkflowTaskDependencyUseCases workflowTaskDependencyUseCases)
        {
            _workflowTaskDependencyUseCases = workflowTaskDependencyUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _workflowTaskDependencyUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _workflowTaskDependencyUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _workflowTaskDependencyUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateWorkflowTaskDependencyRequest requestDto)
        {
            var request = new Domain.Entities.WorkflowTaskDependency
            {
                task_id = requestDto.task_id,
                dependent_task_id = requestDto.dependent_task_id,
            };
            var response = await _workflowTaskDependencyUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateWorkflowTaskDependencyRequest requestDto)
        {
            var request = new Domain.Entities.WorkflowTaskDependency
            {
                id = requestDto.id,
                task_id = requestDto.task_id,
                dependent_task_id = requestDto.dependent_task_id,
            };
            var response = await _workflowTaskDependencyUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _workflowTaskDependencyUseCases.Delete(id);
            return Ok();
        }
    }
}
