using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_DocumentTemplateController : ControllerBase
    {
        private readonly S_DocumentTemplateUseCases _S_DocumentTemplateUseCases;

        public S_DocumentTemplateController(S_DocumentTemplateUseCases S_DocumentTemplateUseCases)
        {
            _S_DocumentTemplateUseCases = S_DocumentTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_DocumentTemplateUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByType")]
        public async Task<IActionResult> GetByType(string type)
        {
            var response = await _S_DocumentTemplateUseCases.GetByType(type);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetMyStructureReports")]
        public async Task<IActionResult> GetMyStructureReports()
        {
            var response = await _S_DocumentTemplateUseCases.GetMyStructureReports();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByApplicationType")]
        public async Task<IActionResult> GetByApplicationType()
        {
            var response = await _S_DocumentTemplateUseCases.GetByApplicationType();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByApplicationTypeAndID")]
        public async Task<IActionResult> GetByApplicationTypeAndID(int idApplication)
        {
            var response = await _S_DocumentTemplateUseCases.GetByApplicationTypeAndID(idApplication);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_DocumentTemplateUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_DocumentTemplateRequest requestDto)
        {
            var request = new Domain.Entities.S_DocumentTemplate
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                //idCustomSvgIcon = requestDto.idCustomSvgIcon,
                //iconColor = requestDto.iconColor,
                idDocumentType = requestDto.idDocumentType,
                translations = requestDto.translations,
                orgStructures = requestDto.orgStructures,
            };
            var response = await _S_DocumentTemplateUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_DocumentTemplateRequest requestDto)
        {
            var request = new Domain.Entities.S_DocumentTemplate
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                //idCustomSvgIcon = requestDto.idCustomSvgIcon,
                //iconColor = requestDto.iconColor,
                idDocumentType = requestDto.idDocumentType,
                translations = requestDto.translations,
                orgStructures = requestDto.orgStructures,
            };
            var response = await _S_DocumentTemplateUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_DocumentTemplateUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_DocumentTemplateUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByidCustomSvgIcon")]
        public async Task<IActionResult> GetByidCustomSvgIcon(int idCustomSvgIcon)
        {
            var response = await _S_DocumentTemplateUseCases.GetByidCustomSvgIcon(idCustomSvgIcon);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidDocumentType")]
        public async Task<IActionResult> GetByidDocumentType(int idDocumentType)
        {
            var response = await _S_DocumentTemplateUseCases.GetByidDocumentType(idDocumentType);
            return Ok(response);
        }


        [HttpPost]
        [Route("GetFilledDocumentHtml")]
        public async Task<IActionResult> GetFilledDocumentHtml(DocModelWithHtml model)
        {
            var p = new Dictionary<string, object> { };
            if (model.parameters == null || model.parameters.Count == 0)
                model.parameters = p;
            //object par = model.parameters;
            foreach (var item in model.parameters)
            {
                if (int.TryParse(item.Value.ToString(), out int output))
                {
                    p.Add(item.Key, output);
                }
                else
                {
                    p.Add(item.Key, item.Value.ToString());
                }
            }

            var response = await _S_DocumentTemplateUseCases.GetFilledDocumentHtml(model.idTemplate, model.language, p);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPost]
        [Route("GetFilledDocumentHtmlByCode")]
        public async Task<IActionResult> GetFilledDocumentHtmlByCode(DocModelWithHtml model)
        {
            var p = new Dictionary<string, object> { };
            if (model.parameters == null || model.parameters.Count == 0)
                model.parameters = p;
            //object par = model.parameters;
            foreach (var item in model.parameters)
            {
                if (int.TryParse(item.Value.ToString(), out int output))
                {
                    p.Add(item.Key, output);
                }
                else
                {
                    p.Add(item.Key, item.Value.ToString());
                }
            }

            var response = await _S_DocumentTemplateUseCases.GetFilledDocumentHtmlByCode(model.template_code, model.language, p);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPost]
        [Route("GetFilledReport")]
        public async Task<IActionResult> GetFilledReport(Domain.Entities.GetFilledReportRequest model)
        {
            var response = await _S_DocumentTemplateUseCases.GetFilledReport(model);
            return ActionResultHelper.FromResult(response);
        }

    }
    public class DocModelWithHtml
    {
        public int idTemplate { get; set; }
        public string? template_code { get; set; }
        public string language { get; set; }
        public Dictionary<string, object> parameters { get; set; }
    }

}
