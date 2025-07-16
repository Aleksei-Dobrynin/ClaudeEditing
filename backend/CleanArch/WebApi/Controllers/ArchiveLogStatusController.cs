using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveLogStatusController : ControllerBase
    {
        private readonly ArchiveLogStatusUseCases _archiveLogStatusUseCases;

        public ArchiveLogStatusController(ArchiveLogStatusUseCases archiveLogStatusUseCases)
        {
            _archiveLogStatusUseCases = archiveLogStatusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archiveLogStatusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _archiveLogStatusUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archiveLogStatusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateArchiveLogStatusRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveLogStatus
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _archiveLogStatusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateArchiveLogStatusRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveLogStatus
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _archiveLogStatusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _archiveLogStatusUseCases.Delete(id);
            return Ok();
        }
    }
}
