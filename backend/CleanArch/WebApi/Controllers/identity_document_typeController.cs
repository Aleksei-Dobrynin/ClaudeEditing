using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class identity_document_typeController : ControllerBase
    {
        private readonly identity_document_typeUseCases _identity_document_typeUseCases;

        public identity_document_typeController(identity_document_typeUseCases identity_document_typeUseCases)
        {
            _identity_document_typeUseCases = identity_document_typeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _identity_document_typeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _identity_document_typeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createidentity_document_typeRequest requestDto)
        {
            var request = new Domain.Entities.identity_document_type
            {
                
                name = requestDto.name,
                code = requestDto.code,
                description = requestDto.description,
            };
            var response = await _identity_document_typeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateidentity_document_typeRequest requestDto)
        {
            var request = new Domain.Entities.identity_document_type
            {
                id = requestDto.id,
                
                name = requestDto.name,
                code = requestDto.code,
                description = requestDto.description,
            };
            var response = await _identity_document_typeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _identity_document_typeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _identity_document_typeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
