using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationFilterController : ControllerBase
    {
        private readonly ApplicationFilterUseCases _ApplicationFilterUseCases;

        public ApplicationFilterController(ApplicationFilterUseCases ApplicationFilterUseCases)
        {
            _ApplicationFilterUseCases = ApplicationFilterUseCases;
        }
        
        [HttpGet]
        [Route("GetFilters")]
        public async Task<IActionResult> GetFilters()
        {
            var response = await _ApplicationFilterUseCases.GetFilters();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationFilterUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ApplicationFilterUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ApplicationFilterUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationFilterRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationFilter
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                type_id = requestDto.type_id,
                query_id = requestDto.query_id,
                post_id = requestDto.post_id,
                parameters = requestDto.parameters,
            };
            var response = await _ApplicationFilterUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationFilterRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationFilter
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                type_id = requestDto.type_id,
                query_id = requestDto.query_id,
                post_id = requestDto.post_id,
                parameters = requestDto.parameters,
            };
            var response = await _ApplicationFilterUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ApplicationFilterUseCases.Delete(id);
            return Ok();
        }
    }
}
