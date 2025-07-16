using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using static WebApi.Dtos.user_selectable_questions_telegram;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class user_selectable_questions_telegramController : ControllerBase
    {
        private readonly user_selectable_questions_telegramUseCase _user_selectable_questions_telegramUseCases;

        public user_selectable_questions_telegramController(user_selectable_questions_telegramUseCase user_selectable_questions_telegramUseCases)
        {
            _user_selectable_questions_telegramUseCases = user_selectable_questions_telegramUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _user_selectable_questions_telegramUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _user_selectable_questions_telegramUseCases.GetById(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(Createuser_selectable_questions_telegramRequest requestDto)
        {
            var request = new Domain.Entities.user_selectable_questions_telegram
            {

                chatId = requestDto.chatId,
                questionId = requestDto.questionId,
                created_at = requestDto.created_at,

            };
            var response = await _user_selectable_questions_telegramUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateuser_selectable_questions_telegramRequest requestDto)
        {
            var request = new Domain.Entities.user_selectable_questions_telegram
            {
                id = requestDto.id,
                chatId = requestDto.chatId,
                questionId = requestDto.questionId,
                created_at = requestDto.created_at,
            };
            var response = await _user_selectable_questions_telegramUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _user_selectable_questions_telegramUseCases.Delete(id);
            return Ok();
        }

        [HttpGet]
        [Route("GetClicked")]
        public async Task<ActionResult> GetClicked([FromQuery] DateTime startDate, [FromQuery] DateTime? endDate)
        {
            var response = await _user_selectable_questions_telegramUseCases.GetClicked(startDate, endDate);
            return Ok(response);
        }
    }
}
