using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class faq_questionController : ControllerBase
    {
        private readonly faq_questionUseCases _faq_questionUseCases;

        public faq_questionController(faq_questionUseCases faq_questionUseCases)
        {
            _faq_questionUseCases = faq_questionUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _faq_questionUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _faq_questionUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createfaq_questionRequest requestDto)
        {
            var request = new Domain.Entities.faq_question
            {
                
                title = requestDto.title,
                answer = requestDto.answer,
                video = requestDto.video,
                is_visible = requestDto.is_visible,
                settings = requestDto.settings,
            };
            var response = await _faq_questionUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatefaq_questionRequest requestDto)
        {
            var request = new Domain.Entities.faq_question
            {
                id = requestDto.id,
                
                title = requestDto.title,
                answer = requestDto.answer,
                video = requestDto.video,
                is_visible = requestDto.is_visible,
                settings = requestDto.settings,
            };
            var response = await _faq_questionUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _faq_questionUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _faq_questionUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
