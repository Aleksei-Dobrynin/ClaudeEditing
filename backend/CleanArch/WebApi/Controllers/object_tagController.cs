using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class object_tagController : ControllerBase
    {
        private readonly object_tagUseCases _object_tagUseCases;

        public object_tagController(object_tagUseCases object_tagUseCases)
        {
            _object_tagUseCases = object_tagUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _object_tagUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _object_tagUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createobject_tagRequest requestDto)
        {
            var request = new Domain.Entities.object_tag
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _object_tagUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateobject_tagRequest requestDto)
        {
            var request = new Domain.Entities.object_tag
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _object_tagUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _object_tagUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _object_tagUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
