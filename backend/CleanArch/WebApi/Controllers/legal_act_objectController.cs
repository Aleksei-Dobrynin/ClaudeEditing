using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class legal_act_objectController : ControllerBase
    {
        private readonly legal_act_objectUseCases _legal_act_objectUseCases;

        public legal_act_objectController(legal_act_objectUseCases legal_act_objectUseCases)
        {
            _legal_act_objectUseCases = legal_act_objectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _legal_act_objectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _legal_act_objectUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createlegal_act_objectRequest requestDto)
        {
            var request = new Domain.Entities.legal_act_object
            {
                
                id_act = requestDto.id_act,
                id_object = requestDto.id_object,
            };
            var response = await _legal_act_objectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatelegal_act_objectRequest requestDto)
        {
            var request = new Domain.Entities.legal_act_object
            {
                id = requestDto.id,
                
                id_act = requestDto.id_act,
                id_object = requestDto.id_object,
            };
            var response = await _legal_act_objectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _legal_act_objectUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _legal_act_objectUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByid_act")]
        public async Task<IActionResult> GetByid_act(int id_act)
        {
            var response = await _legal_act_objectUseCases.GetByid_act(id_act);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByid_object")]
        public async Task<IActionResult> GetByid_object(int id_object)
        {
            var response = await _legal_act_objectUseCases.GetByid_object(id_object);
            return Ok(response);
        }
        

    }
}
