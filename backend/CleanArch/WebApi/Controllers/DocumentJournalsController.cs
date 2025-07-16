using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class DocumentJournalsController : ControllerBase
    {
        private readonly DocumentJournalsUseCases _DocumentJournalsUseCases;

        public DocumentJournalsController(DocumentJournalsUseCases DocumentJournalsUseCases)
        {
            _DocumentJournalsUseCases = DocumentJournalsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _DocumentJournalsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _DocumentJournalsUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _DocumentJournalsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateDocumentJournalsRequest requestDto)
        {
            var request = new Domain.Entities.DocumentJournals
            {
               code = requestDto.code,
               name = requestDto.name,
               number_template = requestDto.number_template,
               current_number = requestDto.current_number,
               reset_period = requestDto.reset_period,
               last_reset = requestDto.last_reset,
               template_types = requestDto.template_types,
               period_type_id = requestDto.period_type_id,
               status_ids = requestDto.status_ids,
            };
            var response = await _DocumentJournalsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateDocumentJournalsRequest requestDto)
        {
            var request = new Domain.Entities.DocumentJournals
            {
               id = requestDto.id,
               code = requestDto.code,
               name = requestDto.name,
               number_template = requestDto.number_template,
               current_number = requestDto.current_number,
               reset_period = requestDto.reset_period,
               last_reset = requestDto.last_reset,
               template_types = requestDto.template_types,
               period_type_id = requestDto.period_type_id,
               status_ids = requestDto.status_ids,
            };
            var response = await _DocumentJournalsUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _DocumentJournalsUseCases.Delete(id);
            return Ok();
        }        
        
        [HttpGet]
        [Route("GetPeriodTypes")]
        public async Task<IActionResult> GetPeriodTypes()
        {
            var response = await _DocumentJournalsUseCases.GetPeriodTypes();
            return Ok(response);
        }
    }
}
