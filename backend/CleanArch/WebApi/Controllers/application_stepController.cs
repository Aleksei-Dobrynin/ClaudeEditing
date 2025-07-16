using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_stepController : ControllerBase
    {
        private readonly application_stepUseCases _application_stepUseCases;

        public application_stepController(application_stepUseCases application_stepUseCases)
        {
            _application_stepUseCases = application_stepUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_stepUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_stepUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_stepRequest requestDto)
        {
            var request = new Domain.Entities.application_step
            {
                
                is_overdue = requestDto.is_overdue,
                overdue_days = requestDto.overdue_days,
                is_paused = requestDto.is_paused,
                comments = requestDto.comments,
                created_at = requestDto.created_at,
                created_by = requestDto.created_by,
                updated_at = requestDto.updated_at,
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                step_id = requestDto.step_id,
                status = requestDto.status,
                start_date = requestDto.start_date,
                due_date = requestDto.due_date,
                completion_date = requestDto.completion_date,
                planned_duration = requestDto.planned_duration,
                actual_duration = requestDto.actual_duration,
            };
            var response = await _application_stepUseCases.Create(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("Pause")]
        public async Task<IActionResult> Pause(PauseDto requestDto)
        {
            var response = await _application_stepUseCases.Pause(requestDto.stepId, requestDto.reason);
            return Ok(response);
        }

        [HttpPost]
        [Route("Complete")]
        public async Task<IActionResult> Complete(CompleteDto requestDto)
        {
            var response = await _application_stepUseCases.Complete(requestDto.stepId);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPost]
        [Route("ToProgress")]
        public async Task<IActionResult> ToProgress(CompleteDto requestDto)
        {
            var response = await _application_stepUseCases.ToProgress(requestDto.stepId);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPost]
        [Route("Return")]
        public async Task<IActionResult> Return(ReturnDto requestDto)
        {
            var response = await _application_stepUseCases.Return(requestDto.stepId, requestDto.comment);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("Resume")]
        public async Task<IActionResult> Resume(CompleteDto requestDto)
        {
            var response = await _application_stepUseCases.Resume(requestDto.stepId);
            return Ok(response);
        }

        public class PauseDto
        {
            public int stepId { get; set; }
            public string reason { get; set; }
        }
        public class CompleteDto
        {
            public int stepId { get; set; }
        }
        public class ReturnDto
        {
            public int stepId { get; set; }
            public string comment { get; set; }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_stepRequest requestDto)
        {
            var request = new Domain.Entities.application_step
            {
                id = requestDto.id,
                
                is_overdue = requestDto.is_overdue,
                overdue_days = requestDto.overdue_days,
                is_paused = requestDto.is_paused,
                comments = requestDto.comments,
                created_at = requestDto.created_at,
                created_by = requestDto.created_by,
                updated_at = requestDto.updated_at,
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                step_id = requestDto.step_id,
                status = requestDto.status,
                start_date = requestDto.start_date,
                due_date = requestDto.due_date,
                completion_date = requestDto.completion_date,
                planned_duration = requestDto.planned_duration,
                actual_duration = requestDto.actual_duration,
            };
            var response = await _application_stepUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_stepUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_stepUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetUnsignedDocuments")]
        public async Task<IActionResult> GetUnsignedDocuments(string? search, bool isDeadline)
        {
            var response = await _application_stepUseCases.GetUnsignedDocuments(search, isDeadline);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_stepUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBystep_id")]
        public async Task<IActionResult> GetBystep_id(int step_id)
        {
            var response = await _application_stepUseCases.GetBystep_id(step_id);
            return Ok(response);
        }
        

    }
}
