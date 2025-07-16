using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class legal_record_objectController : ControllerBase
    {
        private readonly legal_record_objectUseCases _legal_record_objectUseCases;

        public legal_record_objectController(legal_record_objectUseCases legal_record_objectUseCases)
        {
            _legal_record_objectUseCases = legal_record_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _legal_record_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _legal_record_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createlegal_record_objectRequest requestDto)
        {
            var request = new Domain.Entities.legal_record_object
            {
                
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
                id_record = requestDto.id_record,
                id_object = requestDto.id_object,
            };
            var response = await _legal_record_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatelegal_record_objectRequest requestDto)
        {
            var request = new Domain.Entities.legal_record_object
            {
                id = requestDto.id,
                
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
                id_record = requestDto.id_record,
                id_object = requestDto.id_object,
            };
            var response = await _legal_record_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _legal_record_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _legal_record_objectUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByid_record")]
        public async Task<IActionResult> GetByid_record(int id_record)
        {
            var response = await _legal_record_objectUseCases.GetByid_record(id_record);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByid_object")]
        public async Task<IActionResult> GetByid_object(int id_object)
        {
            var response = await _legal_record_objectUseCases.GetByid_object(id_object);
            return Ok(response);
        }
        

    }
}
