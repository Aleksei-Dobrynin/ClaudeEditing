using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using static WebApi.Dtos.telegram_questions_chats;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class telegram_questions_chatsController : ControllerBase
    {
        private readonly telegram_questions_chatsUseCase _telegram_questions_chatsUseCases;

        public telegram_questions_chatsController(telegram_questions_chatsUseCase telegram_questions_chatsUseCases)
        {
            _telegram_questions_chatsUseCases = telegram_questions_chatsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAll ()
        {
            var response = await _telegram_questions_chatsUseCases.GetAll();
            return Ok(response);
        }
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _telegram_questions_chatsUseCases.GetById(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(Createtelegram_questions_chatsRequest requestDto)
        {
            var request = new Domain.Entities.telegram_questions_chats
            {
                chatId = requestDto.chatId,
                created_at = requestDto.created_at
            };
            var response = await _telegram_questions_chatsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatetelegram_questions_chatsRequest requestDto)
        {
            var request = new Domain.Entities.telegram_questions_chats
            {
                id = requestDto.id,
                chatId = requestDto.chatId,
                created_at = requestDto.created_at
   
            };
            var response = await _telegram_questions_chatsUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _telegram_questions_chatsUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByChatId")]
        public async Task<ActionResult> GetByChatId([FromQuery] string chatId)
        {
            var response = await _telegram_questions_chatsUseCases.GetByChatId(chatId);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetNumberOfChats")]
        public async Task<ActionResult> GetNumberOfChats()
        {
            var response = await _telegram_questions_chatsUseCases.GetNumberOfChats();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetNumberOfChatsByDate")]
        public async Task<ActionResult> GetNumberOfChatsByDate([FromQuery] DateTime startDate, [FromQuery] DateTime? endDate)
        {
            var response = await _telegram_questions_chatsUseCases.GetNumberOfChatsByDate(startDate, endDate);
            return Ok(response);
        }
    }
}