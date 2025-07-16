using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_QueriesDocumentTemplateController : ControllerBase
    {
        private readonly S_QueriesDocumentTemplateUseCases _S_QueriesDocumentTemplateUseCases;

        public S_QueriesDocumentTemplateController(S_QueriesDocumentTemplateUseCases S_QueriesDocumentTemplateUseCases)
        {
            _S_QueriesDocumentTemplateUseCases = S_QueriesDocumentTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_QueriesDocumentTemplateUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_QueriesDocumentTemplateUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_QueriesDocumentTemplateRequest requestDto)
        {
            var request = new Domain.Entities.S_QueriesDocumentTemplate
            {
                
                idDocumentTemplate = requestDto.idDocumentTemplate,
                idQuery = requestDto.idQuery,
            };
            var response = await _S_QueriesDocumentTemplateUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_QueriesDocumentTemplateRequest requestDto)
        {
            var request = new Domain.Entities.S_QueriesDocumentTemplate
            {
                id = requestDto.id,
                
                idDocumentTemplate = requestDto.idDocumentTemplate,
                idQuery = requestDto.idQuery,
            };
            var response = await _S_QueriesDocumentTemplateUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_QueriesDocumentTemplateUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_QueriesDocumentTemplateUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByidDocumentTemplate")]
        public async Task<IActionResult> GetByidDocumentTemplate(int idDocumentTemplate)
        {
            var response = await _S_QueriesDocumentTemplateUseCases.GetByidDocumentTemplate(idDocumentTemplate);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidQuery")]
        public async Task<IActionResult> GetByidQuery(int idQuery)
        {
            var response = await _S_QueriesDocumentTemplateUseCases.GetByidQuery(idQuery);
            return Ok(response);
        }
        

    }
}
