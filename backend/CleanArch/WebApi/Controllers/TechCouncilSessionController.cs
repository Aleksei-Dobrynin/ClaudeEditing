using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TechCouncilSessionController : ControllerBase
    {
        private readonly TechCouncilSessionUseCases _TechCouncilSessionUseCases;

        public TechCouncilSessionController(TechCouncilSessionUseCases TechCouncilSessionUseCases)
        {
            _TechCouncilSessionUseCases = TechCouncilSessionUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _TechCouncilSessionUseCases.GetAll();
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetArchiveAll")]
        public async Task<IActionResult> GetArchiveAll()
        {
            var response = await _TechCouncilSessionUseCases.GetArchiveAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _TechCouncilSessionUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _TechCouncilSessionUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateTechCouncilSessionRequest requestDto)
        {
            var request = new Domain.Entities.TechCouncilSession
            {
               date = requestDto.date,
               is_active = requestDto.is_active,
            };
            var response = await _TechCouncilSessionUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateTechCouncilSessionRequest requestDto)
        {
            var request = new Domain.Entities.TechCouncilSession
            {
               id = requestDto.id,
               date = requestDto.date,
               is_active = requestDto.is_active,
            };
            var response = await _TechCouncilSessionUseCases.Update(request);
            return Ok(response);
        }        
        
        [HttpPut]
        [Route("toArchive")]
        public async Task<IActionResult> toArchive(UpdateTechCouncilSessionRequest requestDto)
        {
            var response = await _TechCouncilSessionUseCases.toArchive(requestDto.id);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _TechCouncilSessionUseCases.Delete(id);
            return Ok();
        }
    }
}
