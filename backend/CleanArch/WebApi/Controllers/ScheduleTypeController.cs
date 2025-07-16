using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;


namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleTypeController : ControllerBase
    {
        private readonly ScheduleTypeUseCase _ScheduleTypeUseCase;

        public ScheduleTypeController(ScheduleTypeUseCase ScheduleTypeUseCase)
        {
            _ScheduleTypeUseCase = ScheduleTypeUseCase;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _ScheduleTypeUseCase.GetAll();
            return Ok(response);
        }


        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ScheduleTypeUseCase.GetOneByID(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateScheduleTypeRequest requestDto)
        {
            var request = new Domain.Entities.ScheduleType
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _ScheduleTypeUseCase.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateScheduleTypeRequest requestDto)
        {
            var request = new Domain.Entities.ScheduleType
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _ScheduleTypeUseCase.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ScheduleTypeUseCase.Delete(id);
            return Ok();
        }
    }
}
