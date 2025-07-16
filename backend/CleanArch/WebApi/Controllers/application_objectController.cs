using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_objectController : ControllerBase
    {
        private readonly application_objectUseCases _application_objectUseCases;

        public application_objectController(application_objectUseCases application_objectUseCases)
        {
            _application_objectUseCases = application_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_objectRequest requestDto)
        {
            var request = new Domain.Entities.application_object
            {
                
                application_id = requestDto.application_id,
                arch_object_id = requestDto.arch_object_id,
            };
            var response = await _application_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_objectRequest requestDto)
        {
            var request = new Domain.Entities.application_object
            {
                id = requestDto.id,
                
                application_id = requestDto.application_id,
                arch_object_id = requestDto.arch_object_id,
            };
            var response = await _application_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_objectUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_objectUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByarch_object_id")]
        public async Task<IActionResult> GetByarch_object_id(int arch_object_id)
        {
            var response = await _application_objectUseCases.GetByarch_object_id(arch_object_id);
            return Ok(response);
        }
        

    }
}
