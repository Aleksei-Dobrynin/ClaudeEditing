using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SmProjectController : ControllerBase
    {
        private readonly SmProjectUseCases _SmProjectUseCases;

        public SmProjectController(SmProjectUseCases SmProjectUseCases)
        {
            _SmProjectUseCases = SmProjectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _SmProjectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _SmProjectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateSmProjectRequest requestDto)
        {
            var request = new Domain.Entities.SmProject
            {
                name = requestDto.name,
                projecttype_id = requestDto.projecttype_id,
                test = requestDto.test,
                access_link = requestDto.access_link,
                min_responses = requestDto.min_responses,
            };
            var response = await _SmProjectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateSmProjectRequest requestDto)
        {
            var request = new Domain.Entities.SmProject
            {
                id = requestDto.id,
                name = requestDto.name,
                projecttype_id = requestDto.projecttype_id,
                test = requestDto.test,
                access_link = requestDto.access_link,
                min_responses = requestDto.min_responses,
            };
            var response = await _SmProjectUseCases.Update(request);
            return Ok(response);
        }
    }
}
