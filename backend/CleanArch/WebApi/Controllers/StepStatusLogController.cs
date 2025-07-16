using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StepStatusLogController : ControllerBase
    {
        private readonly StepStatusLogUseCases _stepstatuslogUseCases;

        public StepStatusLogController(StepStatusLogUseCases stepstatuslogUseCases)
        {
            _stepstatuslogUseCases = stepstatuslogUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _stepstatuslogUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _stepstatuslogUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByAplicationStep")]
        public async Task<IActionResult> GetByAplicationStep(int id)
        {
            var response = await _stepstatuslogUseCases.GetByAplicationStep(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _stepstatuslogUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStepStatusLogRequest requestDto)
        {
            var request = new Domain.Entities.StepStatusLog
            {
                app_step_id = requestDto.app_step_id,
                old_status = requestDto.old_status,
                new_status = requestDto.new_status,
                change_date = requestDto.change_date,
                comments = requestDto.comments,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _stepstatuslogUseCases.Create(request);
            return Ok(response);
        }

        //[HttpPost]
        //[Route("ReturnStep")]
        //public async Task<IActionResult> ReturnStep(CreateStepStatusLogRequest requestDto)
        //{
        //    var request = new Domain.Entities.StepStatusLog
        //    {
        //        app_step_id = requestDto.app_step_id,
        //        old_status = requestDto.old_status,
        //        new_status = requestDto.new_status,
        //        change_date = requestDto.change_date,
        //        comments = requestDto.comments,
        //        //created_at = requestDto.created_at,
        //        //updated_at = requestDto.updated_at,
        //        //created_by = requestDto.created_by,
        //        //updated_by = requestDto.updated_by,
        //    };
        //    var response = await _stepstatuslogUseCases.ReturnStep(request);
        //    return Ok(response);
        //}

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateStepStatusLogRequest requestDto)
        {
            var request = new Domain.Entities.StepStatusLog
            {
                id = requestDto.id,
                app_step_id = requestDto.app_step_id,
                old_status = requestDto.old_status,
                new_status = requestDto.new_status,
                change_date = requestDto.change_date,
                comments = requestDto.comments,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _stepstatuslogUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _stepstatuslogUseCases.Delete(id);
            return Ok();
        }
    }
}