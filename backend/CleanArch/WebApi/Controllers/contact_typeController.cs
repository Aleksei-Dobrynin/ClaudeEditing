using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class contact_typeController : ControllerBase
    {
        private readonly contact_typeUseCases _contact_typeUseCases;

        public contact_typeController(contact_typeUseCases contact_typeUseCases)
        {
            _contact_typeUseCases = contact_typeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _contact_typeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _contact_typeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createcontact_typeRequest requestDto)
        {
            var request = new Domain.Entities.contact_type
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                additional = requestDto.additional,
            };
            var response = await _contact_typeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatecontact_typeRequest requestDto)
        {
            var request = new Domain.Entities.contact_type
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                additional = requestDto.additional,
            };
            var response = await _contact_typeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _contact_typeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _contact_typeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
