using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkDayController : ControllerBase
    {
        private readonly WorkDayUseCases _WorkDayUseCases;

        public WorkDayController(WorkDayUseCases WorkDayUseCases)
        {
            _WorkDayUseCases = WorkDayUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _WorkDayUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _WorkDayUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateWorkDayRequest requestDto)
        {
            var request = new Domain.Entities.WorkDay
            {
                week_number = requestDto.week_number,
                time_start = requestDto.time_start,
                time_end = requestDto.time_end,
                schedule_id = requestDto.schedule_id,
            };
            var response = await _WorkDayUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateWorkDayRequest requestDto)
        {
            var request = new Domain.Entities.WorkDay
            {
                id = requestDto.id,
                week_number = requestDto.week_number,
                time_start = requestDto.time_start,
                time_end = requestDto.time_end,
                schedule_id = requestDto.schedule_id,
            };
            var response = await _WorkDayUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _WorkDayUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _WorkDayUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByschedule_id")]
        public async Task<IActionResult> GetByschedule_id(int schedule_id)
        {
            var response = await _WorkDayUseCases.GetByschedule_id(schedule_id);
            return Ok(response);
        }

    }
}
