using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkflowController : ControllerBase
    {
        private readonly WorkflowUseCases _workflowUseCases;

        public WorkflowController(WorkflowUseCases workflowUseCases)
        {
            _workflowUseCases = workflowUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _workflowUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _workflowUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _workflowUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateWorkflowRequest requestDto)
        {
            var request = new Domain.Entities.Workflow
            {
                name = requestDto.name,
                is_active = requestDto.is_active,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
            };
            var response = await _workflowUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateWorkflowRequest requestDto)
        {
            var request = new Domain.Entities.Workflow
            {
                id = requestDto.id,
                name = requestDto.name,
                is_active = requestDto.is_active,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
            };
            var response = await _workflowUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _workflowUseCases.Delete(id);
            return Ok();
        }
    }
}
