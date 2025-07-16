using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class document_statusController : ControllerBase
    {
        private readonly document_statusUseCases _document_statusUseCases;

        public document_statusController(document_statusUseCases document_statusUseCases)
        {
            _document_statusUseCases = document_statusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _document_statusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _document_statusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createdocument_statusRequest requestDto)
        {
            var request = new Domain.Entities.document_status
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
            };
            var response = await _document_statusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatedocument_statusRequest requestDto)
        {
            var request = new Domain.Entities.document_status
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
            };
            var response = await _document_statusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _document_statusUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _document_statusUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
