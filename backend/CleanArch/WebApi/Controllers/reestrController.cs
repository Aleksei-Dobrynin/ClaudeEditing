using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class reestrController : ControllerBase
    {
        private readonly reestrUseCases _reestrUseCases;

        public reestrController(reestrUseCases reestrUseCases)
        {
            _reestrUseCases = reestrUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _reestrUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllMy")]
        public async Task<IActionResult> GetAllMy()
        {
            var response = await _reestrUseCases.GetAllMy();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _reestrUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatereestrRequest requestDto)
        {
            var request = new Domain.Entities.reestr
            {
                
                name = requestDto.name,
                month = requestDto.month,
                year = requestDto.year,
                status_id = requestDto.status_id,
            };
            var response = await _reestrUseCases.Create(request);
            return Ok(response);
        }
        

        [HttpPost]
        [Route("SetApplicationToReestr")]
        public async Task<IActionResult> SetApplicationToReestr(SetApplicationToReestrRequest requestDto)
        {
            var response = await _reestrUseCases.SetApplicationToReestr(requestDto.application_id, requestDto.reestr_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("CheckApplicationBeforeRegistering")]
        public async Task<IActionResult> CheckApplicationBeforeRegistering(int application_id)
        {
            var response = await _reestrUseCases.CheckApplicationBeforeRegistering(application_id);
            return Ok(response);
        }

        [HttpPost]
        [Route("ChangeReestrStatus")]
        public async Task<IActionResult> ChangeReestrStatus(ChangeReestrStatusRequest requestDto)
        {
            var response = await _reestrUseCases.ChangeReestrStatus(requestDto.status_code, requestDto.reestr_id);
            return Ok(response);
        }

        [HttpPost]
        [Route("ChangeAllApplicationStatusInReestr")]
        public async Task<IActionResult> ChangeAllApplicationStatusInReestr(ChangeReestrStatusRequest requestDto)
        {
            var response = await _reestrUseCases.ChangeAllApplicationStatusInReestr(requestDto.reestr_id);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdatereestrRequest requestDto)
        {
            var request = new Domain.Entities.reestr
            {
                id = requestDto.id,
                
                name = requestDto.name,
                month = requestDto.month,
                year = requestDto.year,
                status_id = requestDto.status_id,
            };
            var response = await _reestrUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _reestrUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _reestrUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystatus_id")]
        public async Task<IActionResult> GetBystatus_id(int status_id)
        {
            var response = await _reestrUseCases.GetBystatus_id(status_id);
            return Ok(response);
        }
        

    }
}
