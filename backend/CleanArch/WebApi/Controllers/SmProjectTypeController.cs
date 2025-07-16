using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SmProjectTypeController : ControllerBase
    {
        private readonly SmProjectTypeUseCases _SmProjectTypeUseCases;

        public SmProjectTypeController(SmProjectTypeUseCases SmProjectTypeUseCases)
        {
            _SmProjectTypeUseCases = SmProjectTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _SmProjectTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _SmProjectTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateSmProjectTypeRequest requestDto)
        {
            var request = new Domain.Entities.SmProjectType
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _SmProjectTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateSmProjectTypeRequest requestDto)
        {
            var request = new Domain.Entities.SmProjectType
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _SmProjectTypeUseCases.Update(request);
            return Ok(response);
        }
    }
}
