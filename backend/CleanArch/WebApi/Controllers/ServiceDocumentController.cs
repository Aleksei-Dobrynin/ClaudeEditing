using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServiceDocumentController : ControllerBase
    {
        private readonly ServiceDocumentUseCases _serviceDocumentUseCases;

        public ServiceDocumentController(ServiceDocumentUseCases serviceDocumentUseCases)
        {
            _serviceDocumentUseCases = serviceDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _serviceDocumentUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidService")]
        public async Task<IActionResult> GetByidService(int idService)
        {
            var response = await _serviceDocumentUseCases.GetByidService(idService);
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetByidServiceInternal")]
        public async Task<IActionResult> GetByidServiceInternal(int idService)
        {
            var response = await _serviceDocumentUseCases.GetByidServiceInternal(idService);
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetDocumentsByidServiceInternal")]
        public async Task<IActionResult> GetDocumentsByidServiceInternal(int idService)
        {
            var response = await _serviceDocumentUseCases.GetDocumentsByidServiceInternal(idService);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _serviceDocumentUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _serviceDocumentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateServiceDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ServiceDocument
            {
                service_id = requestDto.service_id,
                application_document_id = requestDto.application_document_id,
                is_required = requestDto.is_required,
            };
            var response = await _serviceDocumentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateServiceDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ServiceDocument
            {
                id = requestDto.id,
                service_id = requestDto.service_id,
                application_document_id = requestDto.application_document_id,
                is_required = requestDto.is_required,
            };
            var response = await _serviceDocumentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceDocumentUseCases.Delete(id);
            return Ok();
        }
    }
}
