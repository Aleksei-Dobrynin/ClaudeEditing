using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class ApplicationLegalRecordController : ControllerBase
    {
        private readonly ApplicationLegalRecordUseCases _ApplicationLegalRecordUseCases;

        public ApplicationLegalRecordController(ApplicationLegalRecordUseCases ApplicationLegalRecordUseCases)
        {
            _ApplicationLegalRecordUseCases = ApplicationLegalRecordUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationLegalRecordUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ApplicationLegalRecordUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ApplicationLegalRecordUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationLegalRecordRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationLegalRecord
            {
               id_application = requestDto.id_application,
               id_legalrecord = requestDto.id_legalrecord,
               id_legalact = requestDto.id_legalact
            };
            var response = await _ApplicationLegalRecordUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationLegalRecordRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationLegalRecord
            {
               id = requestDto.id,
               id_application = requestDto.id_application,
               id_legalrecord = requestDto.id_legalrecord,
               id_legalact = requestDto.id_legalact
            };
            var response = await _ApplicationLegalRecordUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ApplicationLegalRecordUseCases.Delete(id);
            return Ok();
        }
    }
}
