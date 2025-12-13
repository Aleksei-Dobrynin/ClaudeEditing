using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Exceptions;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentTypeController : ControllerBase
    {
        private readonly CommentTypeUseCases _commentTypeUseCases;

        public CommentTypeController(CommentTypeUseCases commentTypeUseCases)
        {
            _commentTypeUseCases = commentTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _commentTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _commentTypeUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateCommentTypeRequest requestDto)
        {
            var request = new Domain.Entities.CommentType
            {
                name = requestDto.name,
                code = requestDto.code,
                button_label = requestDto.button_label,
                button_color = requestDto.button_color,
            };
            var response = await _commentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCommentTypeRequest requestDto)
        {
            var request = new Domain.Entities.CommentType
            {
                id = requestDto.id,
                name = requestDto.name,
                code = requestDto.code,
                button_label = requestDto.button_label,
                button_color = requestDto.button_color,
            };
            var response = await _commentTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _commentTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
