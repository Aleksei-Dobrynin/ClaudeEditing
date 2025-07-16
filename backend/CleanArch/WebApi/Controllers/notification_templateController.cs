using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class notification_templateController : ControllerBase
    {
        private readonly notification_templateUseCases _notification_templateUseCases;

        public notification_templateController(notification_templateUseCases notification_templateUseCases)
        {
            _notification_templateUseCases = notification_templateUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _notification_templateUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _notification_templateUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createnotification_templateRequest requestDto)
        {
            var request = new Domain.Entities.notification_template
            {
                
                contact_type_id = requestDto.contact_type_id,
                code = requestDto.code,
                subject = requestDto.subject,
                body = requestDto.body,
                placeholders = requestDto.placeholders,
                link = requestDto.link,
            };
            var response = await _notification_templateUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatenotification_templateRequest requestDto)
        {
            var request = new Domain.Entities.notification_template
            {
                id = requestDto.id,
                
                contact_type_id = requestDto.contact_type_id,
                code = requestDto.code,
                subject = requestDto.subject,
                body = requestDto.body,
                placeholders = requestDto.placeholders,
                link = requestDto.link,
            };
            var response = await _notification_templateUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _notification_templateUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _notification_templateUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBycontact_type_id")]
        public async Task<IActionResult> GetBycontact_type_id(int contact_type_id)
        {
            var response = await _notification_templateUseCases.GetBycontact_type_id(contact_type_id);
            return Ok(response);
        }
        

    }
}
