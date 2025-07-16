using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationFilterTypeController : ControllerBase
    {
        private readonly ApplicationFilterTypeUseCases _ApplicationFilterTypeUseCases;

        public ApplicationFilterTypeController(ApplicationFilterTypeUseCases ApplicationFilterTypeUseCases)
        {
            _ApplicationFilterTypeUseCases = ApplicationFilterTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationFilterTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ApplicationFilterTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ApplicationFilterTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationFilterTypeRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationFilterType
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                post_id = requestDto.post_id,
                structure_id = requestDto.structure_id,
            };
            var response = await _ApplicationFilterTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationFilterTypeRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationFilterType
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                post_id = requestDto.post_id,
                structure_id = requestDto.structure_id,
            };
            var response = await _ApplicationFilterTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ApplicationFilterTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
