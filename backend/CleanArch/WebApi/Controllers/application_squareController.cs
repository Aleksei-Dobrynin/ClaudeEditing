using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_squareController : ControllerBase
    {
        private readonly application_squareUseCases _application_squareUseCases;

        public application_squareController(application_squareUseCases application_squareUseCases)
        {
            _application_squareUseCases = application_squareUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_squareUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_squareUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_squareRequest requestDto)
        {
            var request = new Domain.Entities.application_square
            {
                
                application_id = requestDto.application_id,
                structure_id = requestDto.structure_id,
                unit_type_id = requestDto.unit_type_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                value = requestDto.value,
            };
            var response = await _application_squareUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_squareRequest requestDto)
        {
            var request = new Domain.Entities.application_square
            {
                id = requestDto.id,
                
                application_id = requestDto.application_id,
                structure_id = requestDto.structure_id,
                unit_type_id = requestDto.unit_type_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                value = requestDto.value,
            };
            var response = await _application_squareUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_squareUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_squareUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_squareUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBystructure_id")]
        public async Task<IActionResult> GetBystructure_id(int structure_id)
        {
            var response = await _application_squareUseCases.GetBystructure_id(structure_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByunit_type_id")]
        public async Task<IActionResult> GetByunit_type_id(int unit_type_id)
        {
            var response = await _application_squareUseCases.GetByunit_type_id(unit_type_id);
            return Ok(response);
        }
        

    }
}
