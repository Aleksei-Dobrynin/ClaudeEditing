using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructureReportController : ControllerBase
    {
        private readonly StructureReportUseCases _StructureReportUseCases;

        public StructureReportController(StructureReportUseCases StructureReportUseCases)
        {
            _StructureReportUseCases = StructureReportUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _StructureReportUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetbyidConfig")]
        public async Task<IActionResult> GetbyidConfig(int idConfig)
        {
            var response = await _StructureReportUseCases.GetbyidConfig(idConfig);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetbyidStructure")]
        public async Task<IActionResult> GetbyidStructure(int idStructure)
        {
            var response = await _StructureReportUseCases.GetbyidStructure(idStructure);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetReportsforStructure")]
        public async Task<IActionResult> GetReportsforStructure()
        {
            var response = await _StructureReportUseCases.GetReportsforStructure();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StructureReportUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructureReportRequest requestDto)
        {
            var request = new Domain.Entities.StructureReport
            {
                year = requestDto.year,
                statusId = requestDto.statusId,
                reportConfigId = requestDto.reportConfigId,
                quarter = requestDto.quarter,
                month = requestDto.month,
                createdAt = DateTime.Now,
                //createdBy = requestDto.createdBy,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                structureId = requestDto.structureId
            };
            var response = await _StructureReportUseCases.Create(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("CreateFromConfig")]
        public async Task<IActionResult> CreateFromConfig(CreateStructureReportRequest requestDto)
        {

            //TODO Add custom logic to create fields from config
            var request = new Domain.Entities.StructureReport
            {
                year = requestDto.year,
                statusId = requestDto.statusId,
                reportConfigId = requestDto.reportConfigId,
                quarter = requestDto.quarter,
                month = requestDto.month,
                createdAt = DateTime.Now,
                //createdBy = requestDto.createdBy,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                structureId = requestDto.structureId
            };
            var response = await _StructureReportUseCases.CreateFromConfig(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateStructureReportRequest requestDto)
        {
            var request = new Domain.Entities.StructureReport
            {
                id = requestDto.id,
                year = requestDto.year,
                statusId = requestDto.statusId,
                reportConfigId = requestDto.reportConfigId,
                quarter = requestDto.quarter,
                month = requestDto.month,
                //createdAt = requestDto.createdAt,
                //createdBy = requestDto.createdBy,
                updatedAt = DateTime.Now,
                //updatedBy = requestDto.updatedBy,
                structureId = requestDto.structureId
            };
            var response = await _StructureReportUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _StructureReportUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _StructureReportUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
