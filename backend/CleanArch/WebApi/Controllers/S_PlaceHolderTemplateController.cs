using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_PlaceHolderTemplateController : ControllerBase
    {
        private readonly S_PlaceHolderTemplateUseCases _S_PlaceHolderTemplateUseCases;

        public S_PlaceHolderTemplateController(S_PlaceHolderTemplateUseCases S_PlaceHolderTemplateUseCases)
        {
            _S_PlaceHolderTemplateUseCases = S_PlaceHolderTemplateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_PlaceHolderTemplateUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_PlaceHolderTemplateUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_PlaceHolderTemplateRequest requestDto)
        {
            var request = new Domain.Entities.S_PlaceHolderTemplate
            {

                name = requestDto.name,
                value = requestDto.value,
                code = requestDto.code,
                idQuery = requestDto.idQuery,
                idPlaceholderType = requestDto.idPlaceholderType,
            };
            var response = await _S_PlaceHolderTemplateUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_PlaceHolderTemplateRequest requestDto)
        {
            var request = new Domain.Entities.S_PlaceHolderTemplate
            {
                id = requestDto.id,

                name = requestDto.name,
                value = requestDto.value,
                code = requestDto.code,
                idQuery = requestDto.idQuery,
                idPlaceholderType = requestDto.idPlaceholderType,
            };
            var response = await _S_PlaceHolderTemplateUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_PlaceHolderTemplateUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_PlaceHolderTemplateUseCases.GetOne(id);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByidQuery")]
        public async Task<IActionResult> GetByidQuery(int idQuery)
        {
            var response = await _S_PlaceHolderTemplateUseCases.GetByidQuery(idQuery);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidPlaceholderType")]
        public async Task<IActionResult> GetByidPlaceholderType(int idPlaceholderType)
        {
            var response = await _S_PlaceHolderTemplateUseCases.GetByidPlaceholderType(idPlaceholderType);
            return Ok(response);
        }


    }
}
