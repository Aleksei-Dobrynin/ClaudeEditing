using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class release_videoController : ControllerBase
    {
        private readonly release_videoUseCases _release_videoUseCases;

        public release_videoController(release_videoUseCases release_videoUseCases)
        {
            _release_videoUseCases = release_videoUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _release_videoUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _release_videoUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createrelease_videoRequest requestDto)
        {
            var request = new Domain.Entities.release_video
            {
                
                release_id = requestDto.release_id,
                file_id = requestDto.file_id,
                name = requestDto.name,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _release_videoUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updaterelease_videoRequest requestDto)
        {
            var request = new Domain.Entities.release_video
            {
                id = requestDto.id,
                
                release_id = requestDto.release_id,
                file_id = requestDto.file_id,
                name = requestDto.name,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _release_videoUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _release_videoUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _release_videoUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByrelease_id")]
        public async Task<IActionResult> GetByrelease_id(int release_id)
        {
            var response = await _release_videoUseCases.GetByrelease_id(release_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByfile_id")]
        public async Task<IActionResult> GetByfile_id(int file_id)
        {
            var response = await _release_videoUseCases.GetByfile_id(file_id);
            return Ok(response);
        }
        

    }
}
