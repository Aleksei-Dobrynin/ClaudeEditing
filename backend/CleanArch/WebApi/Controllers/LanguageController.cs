using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LanguageController : ControllerBase
    {
        private readonly LanguageUseCases _LanguageUseCases;

        public LanguageController(LanguageUseCases LanguageUseCases)
        {
            _LanguageUseCases = LanguageUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _LanguageUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _LanguageUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateLanguageRequest requestDto)
        {
            var request = new Domain.Entities.Language
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                isDefault = requestDto.isDefault,
                queueNumber = requestDto.queueNumber,
            };
            var response = await _LanguageUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateLanguageRequest requestDto)
        {
            var request = new Domain.Entities.Language
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                isDefault = requestDto.isDefault,
                queueNumber = requestDto.queueNumber,
            };
            var response = await _LanguageUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _LanguageUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _LanguageUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
