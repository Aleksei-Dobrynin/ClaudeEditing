using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructureReportFieldController : ControllerBase
    {
        private readonly StructureReportFieldUseCases _StructureReportFieldUseCases;

        public StructureReportFieldController(StructureReportFieldUseCases StructureReportFieldUseCases)
        {
            _StructureReportFieldUseCases = StructureReportFieldUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _StructureReportFieldUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidReport")]
        public async Task<IActionResult> GetByidReport(int idReport)
        {
            var response = await _StructureReportFieldUseCases.GetByidReport(idReport);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidFieldConfig")]
        public async Task<IActionResult> GetByidFieldConfig(int idFieldConfig)
        {
            var response = await _StructureReportFieldUseCases.GetByidFieldConfig(idFieldConfig);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StructureReportFieldUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructureReportFieldRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportField
            {
                
                unitId = requestDto.unitId,
                fieldId = requestDto.fieldId,
                //createdBy = requestDto.createdBy,
                createdAt = DateTime.Now,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                reportId = requestDto.reportId,
                value = requestDto.value,   
            };
            var response = await _StructureReportFieldUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateStructureReportFieldRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportField
            {
                id = requestDto.id,

                unitId = requestDto.unitId,
                fieldId = requestDto.fieldId,
                //createdBy = requestDto.createdBy,
                //createdAt = requestDto.createdAt,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                reportId = requestDto.reportId,
                value = requestDto.value,
            };
            var response = await _StructureReportFieldUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _StructureReportFieldUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _StructureReportFieldUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
