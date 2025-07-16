using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UnitForFieldConfigController : ControllerBase
    {
        private readonly UnitForFieldConfigUseCases _UnitForFieldConfigUseCases;

        public UnitForFieldConfigController(UnitForFieldConfigUseCases UnitForFieldConfigUseCases)
        {
            _UnitForFieldConfigUseCases = UnitForFieldConfigUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _UnitForFieldConfigUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _UnitForFieldConfigUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateUnitForFieldConfigRequest requestDto)
        {
            var request = new Domain.Entities.UnitForFieldConfig
            {
                unitId = requestDto.unitId,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                createdAt = DateTime.Now,
                fieldId = requestDto.fieldId,
                //createdBy = requestDto.createdBy,
            };
            var response = await _UnitForFieldConfigUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateUnitForFieldConfigRequest requestDto)
        {
            var request = new Domain.Entities.UnitForFieldConfig
            {
                id = requestDto.id,

                unitId = requestDto.unitId,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                //createdAt = requestDto.createdAt,
                fieldId = requestDto.fieldId,
                //createdBy = requestDto.createdBy,
            };
            var response = await _UnitForFieldConfigUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _UnitForFieldConfigUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _UnitForFieldConfigUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidFieldConfig")]
        public async Task<IActionResult> GetByidFieldConfig(int idFieldConfig)
        {
            var response = await _UnitForFieldConfigUseCases.GetByidFieldConfig(idFieldConfig);
            return Ok(response);
        }



    }
}
