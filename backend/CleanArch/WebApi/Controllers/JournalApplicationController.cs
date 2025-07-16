using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class JournalApplicationController : ControllerBase
    {
        private readonly JournalApplicationUseCases _JournalApplicationUseCases;

        public JournalApplicationController(JournalApplicationUseCases JournalApplicationUseCases)
        {
            _JournalApplicationUseCases = JournalApplicationUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _JournalApplicationUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _JournalApplicationUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(    
            [FromQuery] int page,
            [FromQuery] int pageSize,
            [FromQuery] string? sortBy,
            [FromQuery] string? sortType,
            [FromQuery] int journalsId)
        {
            var response = await _JournalApplicationUseCases.GetPagniated(pageSize, page, sortBy, sortType, journalsId);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateJournalApplicationRequest requestDto)
        {
            var request = new Domain.Entities.JournalApplication
            {
               journal_id = requestDto.journal_id,
               application_id = requestDto.application_id,
               application_status_id = requestDto.application_status_id,
               outgoing_number = requestDto.outgoing_number,
               created_at = requestDto.created_at,
               updated_at = requestDto.updated_at,
               created_by = requestDto.created_by,
               updated_by = requestDto.updated_by,

            };
            var response = await _JournalApplicationUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateJournalApplicationRequest requestDto)
        {
            var request = new Domain.Entities.JournalApplication
            {
               id = requestDto.id,
               journal_id = requestDto.journal_id,
               application_id = requestDto.application_id,
               application_status_id = requestDto.application_status_id,
               outgoing_number = requestDto.outgoing_number,
               created_at = requestDto.created_at,
               updated_at = requestDto.updated_at,
               created_by = requestDto.created_by,
               updated_by = requestDto.updated_by,

            };
            var response = await _JournalApplicationUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _JournalApplicationUseCases.Delete(id);
            return Ok();
        }
    }
}
