using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class organization_typeController : ControllerBase
    {
        private readonly organization_typeUseCases _organization_typeUseCases;

        public organization_typeController(organization_typeUseCases organization_typeUseCases)
        {
            _organization_typeUseCases = organization_typeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _organization_typeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _organization_typeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createorganization_typeRequest requestDto)
        {
            var request = new Domain.Entities.organization_type
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _organization_typeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateorganization_typeRequest requestDto)
        {
            var request = new Domain.Entities.organization_type
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _organization_typeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _organization_typeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _organization_typeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
