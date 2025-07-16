using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationDocumentController : ControllerBase
    {
        private readonly ApplicationDocumentUseCases _applicationDocumentTypeUseCases;

        public ApplicationDocumentController(ApplicationDocumentUseCases applicationDocumentUseCases)
        {
            _applicationDocumentTypeUseCases = applicationDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _applicationDocumentTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAttachedOldDocuments")]
        public async Task<IActionResult> GetAttachedOldDocuments(int application_document_id, int application_id)
        {
            var response = await _applicationDocumentTypeUseCases.GetAttachedOldDocuments(application_document_id, application_id);
            return Ok(response);
        }



        [HttpGet]
        [Route("GetByServiceId")]
        public async Task<IActionResult> GetByServiceId(int service_id)
        {
            var response = await _applicationDocumentTypeUseCases.GetByServiceId(service_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOldUploads")]
        public async Task<IActionResult> GetOldUploads(int application_id)
        {
            var response = await _applicationDocumentTypeUseCases.GetOldUploads(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _applicationDocumentTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _applicationDocumentTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationDocument
            {
                name = requestDto.name,
                document_type_id = requestDto.document_type_id,
                description = requestDto.description,
                law_description = requestDto.law_description,
                doc_is_outcome = requestDto.doc_is_outcome
            };
            var response = await _applicationDocumentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationDocument
            {
                id = requestDto.id,
                name = requestDto.name,
                document_type_id = requestDto.document_type_id,
                description = requestDto.description,
                law_description = requestDto.law_description,
                doc_is_outcome = requestDto.doc_is_outcome
            };
            var response = await _applicationDocumentTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _applicationDocumentTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
