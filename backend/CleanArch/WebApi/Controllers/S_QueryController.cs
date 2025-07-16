using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class S_QueryController : ControllerBase
    {
        private readonly S_QueryUseCases _S_QueryUseCases;

        public S_QueryController(S_QueryUseCases S_QueryUseCases)
        {
            _S_QueryUseCases = S_QueryUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _S_QueryUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _S_QueryUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateS_QueryRequest requestDto)
        {
            var request = new Domain.Entities.S_Query
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                query = requestDto.query,
            };
            var response = await _S_QueryUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateS_QueryRequest requestDto)
        {
            var request = new Domain.Entities.S_Query
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                query = requestDto.query,
            };
            var response = await _S_QueryUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _S_QueryUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _S_QueryUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
