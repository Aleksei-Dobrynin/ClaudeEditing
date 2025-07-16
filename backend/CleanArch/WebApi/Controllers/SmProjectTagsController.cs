using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SmProjectTagsController : ControllerBase
    {
        private readonly SmProjectTagsUseCases _SmProjectTagsUseCases;

        public SmProjectTagsController(SmProjectTagsUseCases SmProjectTagsUseCases)
        {
            _SmProjectTagsUseCases = SmProjectTagsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _SmProjectTagsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _SmProjectTagsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateSmProjectTagsRequest requestDto)
        {
            var request = new Domain.Entities.SmProjectTags
            {
                project_id = requestDto.project_id,
                tag_id = requestDto.tag_id,
            };
            var response = await _SmProjectTagsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateSmProjectTagsRequest requestDto)
        {
            var request = new Domain.Entities.SmProjectTags
            {
                id = requestDto.id,
                project_id = requestDto.project_id,
                tag_id = requestDto.tag_id,
            };
            var response = await _SmProjectTagsUseCases.Update(request);
            return Ok(response);
        }
    }
}
