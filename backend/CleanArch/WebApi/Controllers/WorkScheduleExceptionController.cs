using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkScheduleExceptionController : ControllerBase
    {
        private readonly WorkScheduleExceptionUseCases _WorkScheduleExceptionUseCases;

        public WorkScheduleExceptionController(WorkScheduleExceptionUseCases WorkScheduleExceptionUseCases)
        {
            _WorkScheduleExceptionUseCases = WorkScheduleExceptionUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _WorkScheduleExceptionUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _WorkScheduleExceptionUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateWorkScheduleExceptionRequest requestDto)
        {
            var request = new Domain.Entities.WorkScheduleException
            {
                date_end = requestDto.date_end,
                date_start = requestDto.date_start,
                name = requestDto.name,
                schedule_id = requestDto.schedule_id,
                is_holiday = requestDto.is_holiday,
                time_end = requestDto.time_end,
                time_start = requestDto.time_start,
            };
            var response = await _WorkScheduleExceptionUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateWorkScheduleExceptionRequest requestDto)
        {
            var request = new Domain.Entities.WorkScheduleException
            {
                id = requestDto.id,
                date_end = requestDto.date_end,
                date_start = requestDto.date_start,
                name = requestDto.name,
                schedule_id = requestDto.schedule_id,
                is_holiday = requestDto.is_holiday,
                time_end = requestDto.time_end,
                time_start = requestDto.time_start,
            };
            var response = await _WorkScheduleExceptionUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _WorkScheduleExceptionUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _WorkScheduleExceptionUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByschedule_id")]
        public async Task<IActionResult> GetByschedule_id(int schedule_id)
        {
            var response = await _WorkScheduleExceptionUseCases.GetByschedule_id(schedule_id);
            return Ok(response);
        }
    }
}
