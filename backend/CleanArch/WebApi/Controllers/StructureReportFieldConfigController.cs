using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructureReportFieldConfigController : ControllerBase
    {
        private readonly StructureReportFieldConfigUseCases _StructureReportFieldConfigUseCases;

        public StructureReportFieldConfigController(StructureReportFieldConfigUseCases StructureReportFieldConfigUseCases)
        {
            _StructureReportFieldConfigUseCases = StructureReportFieldConfigUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _StructureReportFieldConfigUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidReportConfig")]
        public async Task<IActionResult> GetByidReportConfig(int idReportConfig)
        {
            var response = await _StructureReportFieldConfigUseCases.GetByidReportConfig(idReportConfig);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StructureReportFieldConfigUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructureReportFieldConfigRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportFieldConfig
            {
                //createdBy = requestDto.createdBy,
                createdAt = DateTime.Now,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                fieldName = requestDto.fieldName,
                reportItem  = requestDto.reportItem,
                structureReportId = requestDto.structureReportId,
                unitTypes = requestDto.unitTypes
            };
            var response = await _StructureReportFieldConfigUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateStructureReportFieldConfigRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportFieldConfig
            {
                id = requestDto.id,

                //createdBy = requestDto.createdBy,
                //createdAt = requestDto.createdAt,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                fieldName = requestDto.fieldName,
                reportItem = requestDto.reportItem,
                structureReportId = requestDto.structureReportId,
                unitTypes = requestDto.unitTypes

            };
            var response = await _StructureReportFieldConfigUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _StructureReportFieldConfigUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _StructureReportFieldConfigUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
