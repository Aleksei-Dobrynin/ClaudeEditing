using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class JournalTemplateTypeController : ControllerBase
    {
        private readonly JournalTemplateTypeUseCases _JournalTemplateTypeUseCases;

        public JournalTemplateTypeController(JournalTemplateTypeUseCases JournalTemplateTypeUseCases)
        {
            _JournalTemplateTypeUseCases = JournalTemplateTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _JournalTemplateTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _JournalTemplateTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _JournalTemplateTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateJournalTemplateTypeRequest requestDto)
        {
            var request = new Domain.Entities.JournalTemplateType
            {
               code = requestDto.code,
               name = requestDto.name,
               raw_value = requestDto.raw_value,
               placeholder_id = requestDto.placeholder_id == 0 ? null : requestDto.placeholder_id,
               example = requestDto.example,
            };
            var response = await _JournalTemplateTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateJournalTemplateTypeRequest requestDto)
        {
            var request = new Domain.Entities.JournalTemplateType
            {
               id = requestDto.id,
               code = requestDto.code,
               name = requestDto.name,
               raw_value = requestDto.raw_value,
               placeholder_id = requestDto.placeholder_id == 0 ? null : requestDto.placeholder_id,
               example = requestDto.example,
            };
            var response = await _JournalTemplateTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _JournalTemplateTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
