using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RepeatTypeController : ControllerBase
    {
        private readonly RepeatTypeUseCase _RepeatTypeUseCase;

        public RepeatTypeController(RepeatTypeUseCase RepeatTypeUseCase)
        {
            _RepeatTypeUseCase = RepeatTypeUseCase;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _RepeatTypeUseCase.GetAll();
            return Ok(response);
        }


        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _RepeatTypeUseCase.GetOneByID(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateRepeatTypeRequest requestDto)
        {
            var request = new Domain.Entities.RepeatType
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                repeatIntervalMinutes = requestDto.repeatIntervalMinutes,
                isPeriod = requestDto.isPeriod,
            };
            var response = await _RepeatTypeUseCase.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateRepeatTypeRequest requestDto)
        {
            var request = new Domain.Entities.RepeatType
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                repeatIntervalMinutes = requestDto.repeatIntervalMinutes,
                isPeriod = requestDto.isPeriod,
            };
            var response = await _RepeatTypeUseCase.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _RepeatTypeUseCase.Delete(id);
            return Ok();
        }
    }
}
