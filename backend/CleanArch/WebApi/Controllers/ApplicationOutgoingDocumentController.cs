using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class ApplicationOutgoingDocumentController : ControllerBase
    {
        private readonly ApplicationOutgoingDocumentUseCases _ApplicationOutgoingDocumentUseCases;

        public ApplicationOutgoingDocumentController(ApplicationOutgoingDocumentUseCases ApplicationOutgoingDocumentUseCases)
        {
            _ApplicationOutgoingDocumentUseCases = ApplicationOutgoingDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationOutgoingDocumentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ApplicationOutgoingDocumentUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ApplicationOutgoingDocumentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationOutgoingDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationOutgoingDocument
            {
               application_id = requestDto.application_id,
               outgoing_number = requestDto.outgoing_number,
               issued_to_customer = requestDto.issued_to_customer,
               issued_at = requestDto.issued_at,
               signed_ecp = requestDto.signed_ecp,
               signature_data = requestDto.signature_data,
               journal_id = requestDto.journal_id
            };
            var response = await _ApplicationOutgoingDocumentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationOutgoingDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationOutgoingDocument
            {
               id = requestDto.id,
               application_id = requestDto.application_id,
               outgoing_number = requestDto.outgoing_number,
               issued_to_customer = requestDto.issued_to_customer,
               issued_at = requestDto.issued_at,
               signed_ecp = requestDto.signed_ecp,
               signature_data = requestDto.signature_data,
               journal_id = requestDto.journal_id
            };
            var response = await _ApplicationOutgoingDocumentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ApplicationOutgoingDocumentUseCases.Delete(id);
            return Ok();
        }
    }
}
