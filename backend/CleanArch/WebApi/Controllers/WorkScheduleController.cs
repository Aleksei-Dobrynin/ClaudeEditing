using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkScheduleController : ControllerBase
    {
        private readonly WorkScheduleUseCases _WorkScheduleUseCases;

        public WorkScheduleController(WorkScheduleUseCases WorkScheduleUseCases)
        {
            _WorkScheduleUseCases = WorkScheduleUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _WorkScheduleUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _WorkScheduleUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateWorkScheduleRequest requestDto)
        {
            var request = new Domain.Entities.WorkSchedule
            {
                name = requestDto.name,
                is_active = requestDto.is_active,
                year = requestDto.year
            };
            var response = await _WorkScheduleUseCases.Create(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateWorkScheduleRequest requestDto)
        {
            var request = new Domain.Entities.WorkSchedule
            {
                id = requestDto.id,
                name = requestDto.name,
                is_active = requestDto.is_active,
                year = requestDto.year
            };
            var response = await _WorkScheduleUseCases.Update(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _WorkScheduleUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _WorkScheduleUseCases.GetOne(id);
            return Ok(response);
        }

    }
}
