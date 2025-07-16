using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class release_seenController : ControllerBase
    {
        private readonly release_seenUseCases _release_seenUseCases;

        public release_seenController(release_seenUseCases release_seenUseCases)
        {
            _release_seenUseCases = release_seenUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _release_seenUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _release_seenUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createrelease_seenRequest requestDto)
        {
            var request = new Domain.Entities.release_seen
            {
                
                release_id = requestDto.release_id,
                user_id = requestDto.user_id,
                date_issued = requestDto.date_issued,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _release_seenUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updaterelease_seenRequest requestDto)
        {
            var request = new Domain.Entities.release_seen
            {
                id = requestDto.id,
                
                release_id = requestDto.release_id,
                user_id = requestDto.user_id,
                date_issued = requestDto.date_issued,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _release_seenUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _release_seenUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _release_seenUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByrelease_id")]
        public async Task<IActionResult> GetByrelease_id(int release_id)
        {
            var response = await _release_seenUseCases.GetByrelease_id(release_id);
            return Ok(response);
        }
        

    }
}
