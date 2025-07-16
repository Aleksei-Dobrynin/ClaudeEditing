using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UnitTypeController : ControllerBase
    {
        private readonly UnitTypeUseCases _UnitTypeUseCases;

        public UnitTypeController(UnitTypeUseCases UnitTypeUseCases)
        {
            _UnitTypeUseCases = UnitTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _UnitTypeUseCases.GetAll();
            return Ok(response);
        }
        [HttpGet]
        [Route("GetAllSquare")]
        public async Task<IActionResult> GetAllSquare()
        {
            var response = await _UnitTypeUseCases.GetAllSquare();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _UnitTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateUnitTypeRequest requestDto)
        {
            var request = new Domain.Entities.UnitType
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                type = requestDto.type,
                createdAt = DateTime.Now,
                updatedAt = DateTime.Now
            };
            var response = await _UnitTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateUnitTypeRequest requestDto)
        {
            var request = new Domain.Entities.UnitType
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                type = requestDto.type,
                updatedAt = DateTime.Now
            };
            var response = await _UnitTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _UnitTypeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _UnitTypeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
