using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class archive_file_tagsController : ControllerBase
    {
        private readonly archive_file_tagsUseCases _archive_file_tagsUseCases;

        public archive_file_tagsController(archive_file_tagsUseCases archive_file_tagsUseCases)
        {
            _archive_file_tagsUseCases = archive_file_tagsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archive_file_tagsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archive_file_tagsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarchive_file_tagsRequest requestDto)
        {
            var request = new Domain.Entities.archive_file_tags
            {
                
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                file_id = requestDto.file_id,
                tag_id = requestDto.tag_id,
            };
            var response = await _archive_file_tagsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearchive_file_tagsRequest requestDto)
        {
            var request = new Domain.Entities.archive_file_tags
            {
                id = requestDto.id,
                
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                file_id = requestDto.file_id,
                tag_id = requestDto.tag_id,
            };
            var response = await _archive_file_tagsUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _archive_file_tagsUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _archive_file_tagsUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByfile_id")]
        public async Task<IActionResult> GetByfile_id(int file_id)
        {
            var response = await _archive_file_tagsUseCases.GetByfile_id(file_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBytag_id")]
        public async Task<IActionResult> GetBytag_id(int tag_id)
        {
            var response = await _archive_file_tagsUseCases.GetBytag_id(tag_id);
            return Ok(response);
        }
        

    }
}
