using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkDocumentTypeController : ControllerBase
    {
        private readonly WorkDocumentTypeUseCases _WorkDocumentTypeUseCases;

        public WorkDocumentTypeController(WorkDocumentTypeUseCases WorkDocumentTypeUseCases)
        {
            _WorkDocumentTypeUseCases = WorkDocumentTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _WorkDocumentTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _WorkDocumentTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _WorkDocumentTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateWorkDocumentTypeRequest requestDto)
        {
            var request = new Domain.Entities.WorkDocumentType
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                metadata = requestDto.metadata,
            };
            var response = await _WorkDocumentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateWorkDocumentTypeRequest requestDto)
        {
            var request = new Domain.Entities.WorkDocumentType
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                metadata = requestDto.metadata,
            };
            var response = await _WorkDocumentTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _WorkDocumentTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
