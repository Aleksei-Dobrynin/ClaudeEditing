using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class contragentController : ControllerBase
    {
        private readonly contragentUseCases _contragentUseCases;

        public contragentController(contragentUseCases contragentUseCases)
        {
            _contragentUseCases = contragentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _contragentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _contragentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatecontragentRequest requestDto)
        {
            var request = new Domain.Entities.contragent
            {

                name = requestDto.name,
                address = requestDto.address,
                contacts = requestDto.contacts,
                user_id = requestDto.user_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _contragentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdatecontragentRequest requestDto)
        {
            var request = new Domain.Entities.contragent
            {
                id = requestDto.id,

                name = requestDto.name,
                address = requestDto.address,
                contacts = requestDto.contacts,
                user_id = requestDto.user_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _contragentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _contragentUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _contragentUseCases.GetOne(id);
            return Ok(response);
        }



    }
}
