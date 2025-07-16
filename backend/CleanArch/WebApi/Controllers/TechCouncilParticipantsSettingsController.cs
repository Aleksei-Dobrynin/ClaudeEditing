using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TechCouncilParticipantsSettingsController : ControllerBase
    {
        private readonly TechCouncilParticipantsSettingsUseCases _TechCouncilParticipantsSettingsUseCases;

        public TechCouncilParticipantsSettingsController(TechCouncilParticipantsSettingsUseCases TechCouncilParticipantsSettingsUseCases)
        {
            _TechCouncilParticipantsSettingsUseCases = TechCouncilParticipantsSettingsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _TechCouncilParticipantsSettingsUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByServiceId")]
        public async Task<IActionResult> GetByServiceId(int service_id)
        {
            var response = await _TechCouncilParticipantsSettingsUseCases.GetByServiceId(service_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetActiveParticipantsByServiceId")]
        public async Task<IActionResult> GetActiveParticipantsByServiceId(int service_id)
        {
            var response = await _TechCouncilParticipantsSettingsUseCases.GetActiveParticipantsByServiceId(service_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _TechCouncilParticipantsSettingsUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _TechCouncilParticipantsSettingsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateTechCouncilParticipantsSettingsRequest requestDto)
        {
            var request = new Domain.Entities.TechCouncilParticipantsSettings
            {
               structure_id = requestDto.structure_id,
               service_id = requestDto.service_id,
               is_active = requestDto.is_active
            };
            var response = await _TechCouncilParticipantsSettingsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateTechCouncilParticipantsSettingsRequest requestDto)
        {
            var request = new Domain.Entities.TechCouncilParticipantsSettings
            {
               id = requestDto.id,
               structure_id = requestDto.structure_id,
               service_id = requestDto.service_id,
               is_active = requestDto.is_active,
            };
            var response = await _TechCouncilParticipantsSettingsUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _TechCouncilParticipantsSettingsUseCases.Delete(id);
            return Ok();
        }
    }
}
