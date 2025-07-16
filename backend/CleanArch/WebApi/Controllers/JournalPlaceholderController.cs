using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class JournalPlaceholderController : ControllerBase
    {
        private readonly JournalPlaceholderUseCases _JournalPlaceholderUseCases;

        public JournalPlaceholderController(JournalPlaceholderUseCases JournalPlaceholderUseCases)
        {
            _JournalPlaceholderUseCases = JournalPlaceholderUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _JournalPlaceholderUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _JournalPlaceholderUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _JournalPlaceholderUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateJournalPlaceholderRequest requestDto)
        {
            var request = new Domain.Entities.JournalPlaceholder
            {
               order_number = requestDto.order_number,
               template_id = requestDto.template_id,
               journal_id = requestDto.journal_id,
            };
            var response = await _JournalPlaceholderUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateJournalPlaceholderRequest requestDto)
        {
            var request = new Domain.Entities.JournalPlaceholder
            {
               id = requestDto.id,
               order_number = requestDto.order_number,
               template_id = requestDto.template_id,
               journal_id = requestDto.journal_id,
            };
            var response = await _JournalPlaceholderUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _JournalPlaceholderUseCases.Delete(id);
            return Ok();
        }
    }
}
