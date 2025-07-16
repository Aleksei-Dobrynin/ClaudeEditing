using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Domain.Entities;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DutyPlanLogController : ControllerBase
    {
        private readonly DutyPlanLogUseCases _dutyPlanLogUseCases;

        public DutyPlanLogController(DutyPlanLogUseCases dutyPlanLogUseCases)
        {
            _dutyPlanLogUseCases = dutyPlanLogUseCases;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _dutyPlanLogUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _dutyPlanLogUseCases.GetOneByID(id);
            return Ok(response);
        }

        // [HttpPost("Create")]
        // public async Task<IActionResult> Create(DutyPlanLog request)
        // {
        //     var response = await _dutyPlanLogUseCases.Create(request);
        //     return Ok(response);
        // }
        //
        // [HttpPut("Update")]
        // public async Task<IActionResult> Update(DutyPlanLog request)
        // {
        //     var response = await _dutyPlanLogUseCases.Update(request);
        //     return Ok(response);
        // }
        //
        // [HttpDelete("Delete")]
        // public async Task<IActionResult> Delete(int id)
        // {
        //     await _dutyPlanLogUseCases.Delete(id);
        //     return Ok();
        // }

        [HttpGet("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _dutyPlanLogUseCases.GetPaginated(pageSize, pageNumber);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("GetByFilter")]
        public async Task<IActionResult> GetByFilter(ArchiveLogFilter filter)
        {
            var response = await _dutyPlanLogUseCases.GetByFilter(filter);
            return Ok(response);
        }
    }
}