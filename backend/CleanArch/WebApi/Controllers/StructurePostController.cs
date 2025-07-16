using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructurePostController : ControllerBase
    {
        private readonly StructurePostUseCases _structurePostUseCases;

        public StructurePostController(StructurePostUseCases structurePostUseCases)
        {
            _structurePostUseCases = structurePostUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _structurePostUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _structurePostUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _structurePostUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructurePostRequest requestDto)
        {
            var request = new Domain.Entities.StructurePost
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _structurePostUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateStructurePostRequest requestDto)
        {
            var request = new Domain.Entities.StructurePost
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _structurePostUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _structurePostUseCases.Delete(id);
            return Ok();
        }
    }
}
