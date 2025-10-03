using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class saved_application_documentController : ControllerBase
    {
        private readonly saved_application_documentUseCases _saved_application_documentUseCases;
        private readonly S_DocumentTemplateUseCases _S_DocumentTemplateUseCases;

        public saved_application_documentController(saved_application_documentUseCases saved_application_documentUseCases, S_DocumentTemplateUseCases S_DocumentTemplateUseCases)
        {
            _saved_application_documentUseCases = saved_application_documentUseCases;
            _S_DocumentTemplateUseCases = S_DocumentTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _saved_application_documentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _saved_application_documentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createsaved_application_documentRequest requestDto)
        {
            var request = new Domain.Entities.saved_application_document
            {

                application_id = requestDto.application_id,
                template_id = requestDto.template_id,
                language_id = requestDto.language_id,
                body = requestDto.body,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                file_id = requestDto.file_id,
            };
            var response = await _saved_application_documentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatesaved_application_documentRequest requestDto)
        {
            var request = new Domain.Entities.saved_application_document
            {
                id = requestDto.id,

                application_id = requestDto.application_id,
                template_id = requestDto.template_id,
                language_id = requestDto.language_id,
                body = requestDto.body,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _saved_application_documentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _saved_application_documentUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _saved_application_documentUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByApplication")]
        public async Task<IActionResult> GetByApplication(int application_id, int template_id, int language_id, string language_code)
        {
            // var response = await _saved_application_documentUseCases.GetByApplication(application_id, template_id, language_id);
            // if(response?.id == 0)
            var response = new saved_application_document();
            {
                var queriedPlaceholders = new Dictionary<string, object>();
                queriedPlaceholders.Add("application_id", application_id);
                var res = await _S_DocumentTemplateUseCases.GetFilledDocumentHtml(template_id, language_code, queriedPlaceholders);
                response.body = res.Value;
                response.application_id = application_id;
                response.template_id = template_id;
                response.language_id = language_id;
            }
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _saved_application_documentUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBytemplate_id")]
        public async Task<IActionResult> GetBytemplate_id(int template_id)
        {
            var response = await _saved_application_documentUseCases.GetBytemplate_id(template_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBylanguage_id")]
        public async Task<IActionResult> GetBylanguage_id(int language_id)
        {
            var response = await _saved_application_documentUseCases.GetBylanguage_id(language_id);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetLatestSavedDocuments")]
        public async Task<IActionResult> GetLatestSavedDocuments(int app_id)
        {
            var response = await _saved_application_documentUseCases.GetLatestSavedDocuments(app_id);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("DownloadPdf")]
        public async Task<IActionResult> DownloadPdf(int id)
        {
            var response = await _saved_application_documentUseCases.DownloadPdf(id);
            string file_type = "application/pdf";
            string file_name = $"doc{id}.pdf";
            return File(response, file_type, file_name);
        }


        [HttpPost]
        [Route("CreateDoc")]
        public async Task<IActionResult> CreateDoc(SignData data)
        {
            var response = await _saved_application_documentUseCases.SignHtml(data.application_id, data.template_id, data.body, data.language_id);
            return Ok(response);
        }

        public class SignData
        {
            public int application_id { get; set; }
            public int language_id { get; set; }
            public int template_id { get; set; }
            public string body { get; set; }
        }
    }
}
