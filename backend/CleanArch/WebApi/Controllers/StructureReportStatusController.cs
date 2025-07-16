using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructureReportStatusController : ControllerBase
    {
        private readonly StructureReportStatusUseCases _StructureReportStatusUseCases;

        public StructureReportStatusController(StructureReportStatusUseCases StructureReportStatusUseCases)
        {
            _StructureReportStatusUseCases = StructureReportStatusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _StructureReportStatusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StructureReportStatusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructureReportStatusRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportStatus
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                createdAt = DateTime.Now,
                updatedAt = DateTime.Now
            };
            var response = await _StructureReportStatusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateStructureReportStatusRequest requestDto)
        {
            var request = new Domain.Entities.StructureReportStatus
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                updatedAt= DateTime.Now
            };
            var response = await _StructureReportStatusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _StructureReportStatusUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _StructureReportStatusUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
