using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class tech_decisionController : ControllerBase
    {
        private readonly tech_decisionUseCases _tech_decisionUseCases;

        public tech_decisionController(tech_decisionUseCases tech_decisionUseCases)
        {
            _tech_decisionUseCases = tech_decisionUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _tech_decisionUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _tech_decisionUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createtech_decisionRequest requestDto)
        {
            var request = new Domain.Entities.tech_decision
            {
                background_color = requestDto.background_color,
                code = requestDto.code,
                description = requestDto.description,
                description_kg = requestDto.description_kg,
                name    = requestDto.name,
                name_kg = requestDto.name_kg,
                text_color = requestDto.text_color,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _tech_decisionUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatetech_decisionRequest requestDto)
        {
            var request = new Domain.Entities.tech_decision
            {
                id = requestDto.id,

                background_color = requestDto.background_color,
                code = requestDto.code,
                description = requestDto.description,
                description_kg = requestDto.description_kg,
                name = requestDto.name,
                name_kg = requestDto.name_kg,
                text_color = requestDto.text_color,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _tech_decisionUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _tech_decisionUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _tech_decisionUseCases.GetOne(id);
            return Ok(response);
        }

        
        //[HttpGet]
        //[Route("GetBydutyplan_object_id")]
        //public async Task<IActionResult> GetBydutyplan_object_id(int dutyplan_object_id)
        //{
        //    var response = await _tech_decisionUseCases.GetBydutyplan_object_id(dutyplan_object_id);
        //    return Ok(response);
        //}
        
        //[HttpGet]
        //[Route("GetByapplication_id")]
        //public async Task<IActionResult> GetByapplication_id(int application_id)
        //{
        //    var response = await _tech_decisionUseCases.GetByapplication_id(application_id);
        //    return Ok(response);
        //}
        

    }
}
