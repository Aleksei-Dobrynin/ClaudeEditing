using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_DocumentTemplateTranslationController : ControllerBase
    {
        private readonly S_DocumentTemplateTranslationUseCases _S_DocumentTemplateTranslationUseCases;

        public S_DocumentTemplateTranslationController(S_DocumentTemplateTranslationUseCases S_DocumentTemplateTranslationUseCases)
        {
            _S_DocumentTemplateTranslationUseCases = S_DocumentTemplateTranslationUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_DocumentTemplateTranslationUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_DocumentTemplateTranslationUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_DocumentTemplateTranslationRequest requestDto)
        {
            var request = new Domain.Entities.S_DocumentTemplateTranslation
            {
                
                template = requestDto.template,
                idDocumentTemplate = requestDto.idDocumentTemplate,
                idLanguage = requestDto.idLanguage,
            };
            var response = await _S_DocumentTemplateTranslationUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_DocumentTemplateTranslationRequest requestDto)
        {
            var request = new Domain.Entities.S_DocumentTemplateTranslation
            {
                id = requestDto.id,
                
                template = requestDto.template,
                idDocumentTemplate = requestDto.idDocumentTemplate,
                idLanguage = requestDto.idLanguage,
            };
            var response = await _S_DocumentTemplateTranslationUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_DocumentTemplateTranslationUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_DocumentTemplateTranslationUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByidDocumentTemplate")]
        public async Task<IActionResult> GetByidDocumentTemplate(int idDocumentTemplate)
        {
            var response = await _S_DocumentTemplateTranslationUseCases.GetByidDocumentTemplate(idDocumentTemplate);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidLanguage")]
        public async Task<IActionResult> GetByidLanguage(int idLanguage)
        {
            var response = await _S_DocumentTemplateTranslationUseCases.GetByidLanguage(idLanguage);
            return Ok(response);
        }
        

    }
}
