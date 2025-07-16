using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_DocumentTemplateTypeController : ControllerBase
    {
        private readonly S_DocumentTemplateTypeUseCases _S_DocumentTemplateTypeUseCases;

        public S_DocumentTemplateTypeController(S_DocumentTemplateTypeUseCases S_DocumentTemplateTypeUseCases)
        {
            _S_DocumentTemplateTypeUseCases = S_DocumentTemplateTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_DocumentTemplateTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_DocumentTemplateTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_DocumentTemplateTypeRequest requestDto)
        {
            var request = new Domain.Entities.S_DocumentTemplateType
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                queueNumber = requestDto.queueNumber,
            };
            var response = await _S_DocumentTemplateTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_DocumentTemplateTypeRequest requestDto)
        {
            var request = new Domain.Entities.S_DocumentTemplateType
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                queueNumber = requestDto.queueNumber,
            };
            var response = await _S_DocumentTemplateTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_DocumentTemplateTypeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_DocumentTemplateTypeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
