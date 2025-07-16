using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomSvgIconController : ControllerBase
    {
        private readonly CustomSvgIconUseCases _CustomSvgIconUseCases;

        public CustomSvgIconController(CustomSvgIconUseCases CustomSvgIconUseCases)
        {
            _CustomSvgIconUseCases = CustomSvgIconUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _CustomSvgIconUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _CustomSvgIconUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateCustomSvgIconRequest requestDto)
        {
            var request = new Domain.Entities.CustomSvgIcon
            {
                name = requestDto.name,
                svgPath = requestDto.code,
            };
            var response = await _CustomSvgIconUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCustomSvgIconRequest requestDto)
        {
            var request = new Domain.Entities.CustomSvgIcon
            {
                id = requestDto.id,
                name = requestDto.name,
                svgPath = requestDto.code,
            };
            var response = await _CustomSvgIconUseCases.Update(request);
            return Ok(response);
        }
    }
}
