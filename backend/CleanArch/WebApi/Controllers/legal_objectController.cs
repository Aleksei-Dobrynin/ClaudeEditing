using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class legal_objectController : ControllerBase
    {
        private readonly legal_objectUseCases _legal_objectUseCases;

        public legal_objectController(legal_objectUseCases legal_objectUseCases)
        {
            _legal_objectUseCases = legal_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _legal_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _legal_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createlegal_objectRequest requestDto)
        {
            var request = new Domain.Entities.legal_object
            {
                
                description = requestDto.description,
                address = requestDto.address,
                geojson = requestDto.geojson,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _legal_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatelegal_objectRequest requestDto)
        {
            var request = new Domain.Entities.legal_object
            {
                id = requestDto.id,
                
                description = requestDto.description,
                address = requestDto.address,
                geojson = requestDto.geojson,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _legal_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _legal_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _legal_objectUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
