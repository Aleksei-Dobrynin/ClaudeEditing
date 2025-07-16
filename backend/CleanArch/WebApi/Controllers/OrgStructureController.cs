using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrgStructureController : ControllerBase
    {
        private readonly OrgStructureUseCases _OrgStructureUseCases;

        public OrgStructureController(OrgStructureUseCases OrgStructureUseCases)
        {
            _OrgStructureUseCases = OrgStructureUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _OrgStructureUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllMy")]
        public async Task<IActionResult> GetAllMy()
        {
            var response = await _OrgStructureUseCases.GetAllMy();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _OrgStructureUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateOrgStructureRequest requestDto)
        {
            var request = new Domain.Entities.OrgStructure
            {
                parent_id = requestDto.parent_id,
                unique_id = requestDto.unique_id,
                name = requestDto.name,
                version = requestDto.version,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                remote_id = requestDto.remote_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                short_name = requestDto.short_name
            };
            var response = await _OrgStructureUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdateOrgStructureRequest requestDto)
        {
            var request = new Domain.Entities.OrgStructure
            {
                id = requestDto.id,
                parent_id = requestDto.parent_id,
                unique_id = requestDto.unique_id,
                name = requestDto.name,
                version = requestDto.version,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                remote_id = requestDto.remote_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                short_name = requestDto.short_name
            };
            var response = await _OrgStructureUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _OrgStructureUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _OrgStructureUseCases.GetOne(id);
            return Ok(response);
        }

    }
}
