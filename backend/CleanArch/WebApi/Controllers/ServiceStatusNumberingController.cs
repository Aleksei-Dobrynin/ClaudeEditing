using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class ServiceStatusNumberingController : ControllerBase
    {
        private readonly ServiceStatusNumberingUseCases _ServiceStatusNumberingUseCases;

        public ServiceStatusNumberingController(ServiceStatusNumberingUseCases ServiceStatusNumberingUseCases)
        {
            _ServiceStatusNumberingUseCases = ServiceStatusNumberingUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ServiceStatusNumberingUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByServiceId")]
        public async Task<IActionResult> GetByServiceId(int service_id)
        {
            var response = await _ServiceStatusNumberingUseCases.GetByServiceId(service_id);
            return Ok(response);
        }        
        [HttpGet]
        [Route("GetByJournalId")]
        public async Task<IActionResult> GetByJournalId(int journal_id)
        {
            var response = await _ServiceStatusNumberingUseCases.GetByJournalId(journal_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ServiceStatusNumberingUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ServiceStatusNumberingUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateServiceStatusNumberingRequest requestDto)
        {
            var request = new Domain.Entities.ServiceStatusNumbering
            {
               date_start = requestDto.date_start,
               date_end = requestDto.date_end,
               is_active = requestDto.is_active,
               service_id = requestDto.service_id,
               journal_id = requestDto.journal_id,
               number_template = requestDto.number_template
            };
            var response = await _ServiceStatusNumberingUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateServiceStatusNumberingRequest requestDto)
        {
            var request = new Domain.Entities.ServiceStatusNumbering
            {
               id = requestDto.id,
               date_start = requestDto.date_start,
               date_end = requestDto.date_end,
               is_active = requestDto.is_active,
               service_id = requestDto.service_id,
               journal_id = requestDto.journal_id,
               number_template = requestDto.number_template
            };
            var response = await _ServiceStatusNumberingUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ServiceStatusNumberingUseCases.Delete(id);
            return Ok();
        }
    }
}
