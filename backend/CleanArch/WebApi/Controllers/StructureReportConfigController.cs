using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructureReportConfigController : ControllerBase
    {
        private readonly StructureReportConfigUseCases _StructureReportConfigUseCases;

        public StructureReportConfigController(StructureReportConfigUseCases StructureReportConfigUseCases)
        {
            _StructureReportConfigUseCases = StructureReportConfigUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _StructureReportConfigUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetbyidStructure")]
        public async Task<IActionResult> GetbyidStructure(int idStructure)
        {
            var response = await _StructureReportConfigUseCases.GetbyidStructure(idStructure);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StructureReportConfigUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructureReportConfigRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportConfig
            {
                
                name = requestDto.name,
                isActive = requestDto.isActive,
                structureId = requestDto.structureId,
                //updatedBy = requestDto.updatedBy,
                updatedAt = DateTime.Now,
                //createdBy = requestDto.createdBy,
                createdAt = DateTime.Now,

            };
            var response = await _StructureReportConfigUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateStructureReportConfigRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportConfig
            {
                id = requestDto.id,

                name = requestDto.name,
                isActive = requestDto.isActive,
                structureId = requestDto.structureId,
                //updatedBy = requestDto.updatedBy,
                updatedAt = DateTime.Now,
                //createdBy = requestDto.createdBy,
                //createdAt = requestDto.createdAt,
            };
            var response = await _StructureReportConfigUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _StructureReportConfigUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _StructureReportConfigUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
