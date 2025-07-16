using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class step_partnerController : ControllerBase
    {
        private readonly step_partnerUseCases _step_partnerUseCases;

        public step_partnerController(step_partnerUseCases step_partnerUseCases)
        {
            _step_partnerUseCases = step_partnerUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _step_partnerUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _step_partnerUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstep_partnerRequest requestDto)
        {
            var request = new Domain.Entities.step_partner
            {
                
                step_id = requestDto.step_id,
                partner_id = requestDto.partner_id,
                role = requestDto.role,
                is_required = requestDto.is_required,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _step_partnerUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestep_partnerRequest requestDto)
        {
            var request = new Domain.Entities.step_partner
            {
                id = requestDto.id,
                
                step_id = requestDto.step_id,
                partner_id = requestDto.partner_id,
                role = requestDto.role,
                is_required = requestDto.is_required,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _step_partnerUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _step_partnerUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _step_partnerUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystep_id")]
        public async Task<IActionResult> GetBystep_id(int step_id)
        {
            var response = await _step_partnerUseCases.GetBystep_id(step_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBypartner_id")]
        public async Task<IActionResult> GetBypartner_id(int partner_id)
        {
            var response = await _step_partnerUseCases.GetBypartner_id(partner_id);
            return Ok(response);
        }
        

    }
}
