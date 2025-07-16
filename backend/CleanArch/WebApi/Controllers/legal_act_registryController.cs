using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Domain.Entities;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class legal_act_registryController : ControllerBase
    {
        private readonly legal_act_registryUseCases _legal_act_registryUseCases;

        public legal_act_registryController(legal_act_registryUseCases legal_act_registryUseCases)
        {
            _legal_act_registryUseCases = legal_act_registryUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _legal_act_registryUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _legal_act_registryUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetByFilter")]
        public async Task<IActionResult> GetByFilter(LegalFilter filter)
        {
            var response = await _legal_act_registryUseCases.GetByFilter(filter);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByAddress")]
        public async Task<IActionResult> GetByAddress(string address)
        {
            var response = await _legal_act_registryUseCases.GetByAddress(address);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createlegal_act_registryRequest requestDto)
        {
            var request = new Domain.Entities.legal_act_registry
            {
                
                is_active = requestDto.is_active,
                act_type = requestDto.act_type,
                date_issue = requestDto.date_issue,
                id_status = requestDto.id_status,
                subject = requestDto.subject,
                act_number = requestDto.act_number,
                decision = requestDto.decision,
                addition = requestDto.addition,
                legalObjects = requestDto.legalObjects,
                assignees = requestDto.assignees,

                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _legal_act_registryUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatelegal_act_registryRequest requestDto)
        {
            var request = new Domain.Entities.legal_act_registry
            {
                id = requestDto.id,
                
                is_active = requestDto.is_active,
                act_type = requestDto.act_type,
                date_issue = requestDto.date_issue,
                id_status = requestDto.id_status,
                subject = requestDto.subject,
                act_number = requestDto.act_number,
                decision = requestDto.decision,
                addition = requestDto.addition,
                legalObjects = requestDto.legalObjects,
                assignees = requestDto.assignees,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _legal_act_registryUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _legal_act_registryUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _legal_act_registryUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByid_status")]
        public async Task<IActionResult> GetByid_status(int id_status)
        {
            var response = await _legal_act_registryUseCases.GetByid_status(id_status);
            return Ok(response);
        }
        

    }
}
