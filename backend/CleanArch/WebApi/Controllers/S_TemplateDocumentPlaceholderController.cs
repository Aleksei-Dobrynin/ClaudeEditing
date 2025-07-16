using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_TemplateDocumentPlaceholderController : ControllerBase
    {
        private readonly S_TemplateDocumentPlaceholderUseCases _S_TemplateDocumentPlaceholderUseCases;

        public S_TemplateDocumentPlaceholderController(S_TemplateDocumentPlaceholderUseCases S_TemplateDocumentPlaceholderUseCases)
        {
            _S_TemplateDocumentPlaceholderUseCases = S_TemplateDocumentPlaceholderUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_TemplateDocumentPlaceholderUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_TemplateDocumentPlaceholderUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_TemplateDocumentPlaceholderRequest requestDto)
        {
            var request = new Domain.Entities.S_TemplateDocumentPlaceholder
            {
                
                idTemplateDocument = requestDto.idTemplateDocument,
                idPlaceholder = requestDto.idPlaceholder,
            };
            var response = await _S_TemplateDocumentPlaceholderUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_TemplateDocumentPlaceholderRequest requestDto)
        {
            var request = new Domain.Entities.S_TemplateDocumentPlaceholder
            {
                id = requestDto.id,
                
                idTemplateDocument = requestDto.idTemplateDocument,
                idPlaceholder = requestDto.idPlaceholder,
            };
            var response = await _S_TemplateDocumentPlaceholderUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_TemplateDocumentPlaceholderUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_TemplateDocumentPlaceholderUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByidTemplateDocument")]
        public async Task<IActionResult> GetByidTemplateDocument(int idTemplateDocument)
        {
            var response = await _S_TemplateDocumentPlaceholderUseCases.GetByidTemplateDocument(idTemplateDocument);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidPlaceholder")]
        public async Task<IActionResult> GetByidPlaceholder(int idPlaceholder)
        {
            var response = await _S_TemplateDocumentPlaceholderUseCases.GetByidPlaceholder(idPlaceholder);
            return Ok(response);
        }
        

    }
}
