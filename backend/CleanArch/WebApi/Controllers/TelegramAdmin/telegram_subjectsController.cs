using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using static WebApi.Dtos.telegram_subjects;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class telegram_subjectsController : ControllerBase
    {
        private readonly telegram_subjectsUseCase _telegram_subjectsUseCases;

        public telegram_subjectsController(telegram_subjectsUseCase telegram_subjectsUseCases)
        {
            _telegram_subjectsUseCases = telegram_subjectsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _telegram_subjectsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _telegram_subjectsUseCases.GetById(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(Createtelegram_subjectsRequest requestDto)
        {
            var request = new Domain.Entities.telegram_subjects
            {
   
                name = requestDto.name,
                name_kg = requestDto.name_kg,

            };
            var response = await _telegram_subjectsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatetelegram_subjectsRequest requestDto)
        {
            var request = new Domain.Entities.telegram_subjects
            {
                id = requestDto.id,
                name = requestDto.name,
                name_kg = requestDto.name_kg,

            };
            var response = await _telegram_subjectsUseCases.Update(request);
            return Ok(response);
        }
        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _telegram_subjectsUseCases.Delete(id);
            return Ok();
        }


    }
}
