using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class structure_tag_applicationController : ControllerBase
    {
        private readonly structure_tag_applicationUseCases _structure_tag_applicationUseCases;

        public structure_tag_applicationController(structure_tag_applicationUseCases structure_tag_applicationUseCases)
        {
            _structure_tag_applicationUseCases = structure_tag_applicationUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _structure_tag_applicationUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _structure_tag_applicationUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstructure_tag_applicationRequest requestDto)
        {
            var request = new Domain.Entities.structure_tag_application
            {
                
                structure_tag_id = requestDto.structure_tag_id,
                application_id = requestDto.application_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                structure_id = requestDto.structure_id,
            };
            var response = await _structure_tag_applicationUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestructure_tag_applicationRequest requestDto)
        {
            var request = new Domain.Entities.structure_tag_application
            {
                id = requestDto.id,
                
                structure_tag_id = requestDto.structure_tag_id,
                application_id = requestDto.application_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                structure_id = requestDto.structure_id,
            };
            var response = await _structure_tag_applicationUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _structure_tag_applicationUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _structure_tag_applicationUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetForApplication")]
        public async Task<IActionResult> GetForApplication(int structure_id, int application_id)
        {
            var response = await _structure_tag_applicationUseCases.GetForApplication(structure_id, application_id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystructure_tag_id")]
        public async Task<IActionResult> GetBystructure_tag_id(int structure_tag_id)
        {
            var response = await _structure_tag_applicationUseCases.GetBystructure_tag_id(structure_tag_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBystructure_id")]
        public async Task<IActionResult> GetBystructure_id(int structure_id)
        {
            var response = await _structure_tag_applicationUseCases.GetBystructure_id(structure_id);
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _structure_tag_applicationUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }


    }
}
