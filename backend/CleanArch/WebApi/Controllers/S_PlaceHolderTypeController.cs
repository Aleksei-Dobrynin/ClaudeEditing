using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_PlaceHolderTypeController : ControllerBase
    {
        private readonly S_PlaceHolderTypeUseCases _S_PlaceHolderTypeUseCases;

        public S_PlaceHolderTypeController(S_PlaceHolderTypeUseCases S_PlaceHolderTypeUseCases)
        {
            _S_PlaceHolderTypeUseCases = S_PlaceHolderTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_PlaceHolderTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_PlaceHolderTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_PlaceHolderTypeRequest requestDto)
        {
            var request = new Domain.Entities.S_PlaceHolderType
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                queueNumber = requestDto.queueNumber,
            };
            var response = await _S_PlaceHolderTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_PlaceHolderTypeRequest requestDto)
        {
            var request = new Domain.Entities.S_PlaceHolderType
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                queueNumber = requestDto.queueNumber,
            };
            var response = await _S_PlaceHolderTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_PlaceHolderTypeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_PlaceHolderTypeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
